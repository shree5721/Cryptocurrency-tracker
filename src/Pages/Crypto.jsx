import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCryptocontext } from "../Context/CryptoContext";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
  ButtonGroup,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { collection, doc, setDoc } from "firebase/firestore";   
import { db } from "../config/FirebaseConfif";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Crypto = () => {
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("1d"); // Default timeframe: 1 day
  const { id } = useParams();
  const { currency, symbol, setAlert, user, watchlist } = useCryptocontext();

  const timeframes = [
    { label: "15 Min", value: "15m" },
    { label: "1 Hour", value: "1h" },
    { label: "1 Day", value: "1d" },
    { label: "1 Week", value: "7d" },
    { label: "1 Month", value: "30d" },
  ];
  const inWatchlist = watchlist.includes(coin?.id);
  const addToWatchlist = async () => {
    if (!user) {
      setAlert({
        open: true,
        message: "You need to be logged in to add to watchlist.",
        type: "error",
      });
      return;
    }

    const coinRef = doc(collection(db, "watchlist"), user.uid);

    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };
  const removeFromWatchlist = async () => {
    if (!user) {
      setAlert({
        open: true,
        message: "You need to be logged in to remove from watchlist.",
        type: "error",
      });
      return;
    }

    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const getSingleCoin = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      if (!response.ok) setError("Failed to fetch coin data.");
      const data = await response.json();
      setCoin(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const getCoinChart = async (id, timeframe) => {
    try {
      const days = timeframe.replace(/[a-z]/g, ""); // Extract numeric part (e.g., "15m" -> "15")
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
      );
      if (!response.ok) throw new Error("Failed to fetch chart data.");
      const data = await response.json();

      // Prepare data for the chart
      const labels = data.prices.map((price) => new Date(price[0]).toLocaleString());
      const prices = data.prices.map((price) => price[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: `Price in ${currency}`,
            data: prices,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getSingleCoin(id);
    getCoinChart(id, timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, timeframe, currency]);

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }
  if (loading) {
    return <LinearProgress sx={{ width: "100%", mt: "100px" }} />;
  }

  return (
    <>
      <Box
        className="crypto_page"
        sx={{
          display: "flex",
          alignItems: "center",
          pt: "50px",
          height: "auto",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="crypto_Info"
          width={{ xs: "100%", sm: "30%" }}
          px={3}
          borderRight={{ sm: 2 }}
          borderColor="#28282B"
          mb={{ xs: 4, sm: 0 }}
        >
          <img src={coin?.image.large} alt="crypto" width="100%" />
          <Typography
            gutterBottom
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ color: "#28282B", textAlign: "center" }}
          >
            {coin?.name}
          </Typography>
          <Typography gutterBottom variant="subtitle2" component="h2" sx={{ textAlign: "center" }}>
            {coin?.description?.en
              ? coin.description.en.split(". ")[0]
              : "Description not available."}
          </Typography>
          <Box alignSelf="start">
            <Typography gutterBottom variant="h5" fontWeight="bold" sx={{ color: "#28282B" }}>
              Rank: <span style={{ fontSize: "18px", color: "#38893c" }}> {coin?.market_cap_rank}</span>
            </Typography>
            <Typography gutterBottom variant="h5" fontWeight="bold" sx={{ color: "#28282B" }}>
              Current price:{" "}
              <span style={{ fontSize: "18px", color: "#38893c" }}>
                {symbol} {coin?.market_data.current_price[currency.toLowerCase()]}
              </span>
            </Typography>
            <Typography gutterBottom variant="h5" fontWeight="bold" sx={{ color: "#28282B" }}>
              Market Cap:{" "}
              <span style={{ fontSize: "18px", color: "#38893c" }}>
                {coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)}{" "}
                M
              </span>
            </Typography>
            {user && (
              <Button
                sx={{
                  backgroundColor: "#ffd32a",
                  color: "black",
                  px: "20px",
                  fontWeight: "500",
                  width: "100%",
                }}
                onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
                type="contained"
              >
                {inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              </Button>
            )}
          </Box>
        </Stack>

        <Box width={{ xs: "100%", sm: "70%" }} className="crypto_chart" px={3}>
          {/* Timeframe Buttons */}
          <ButtonGroup sx={{ mb: 3 }} fullWidth>
            {timeframes.map((time) => (
              <Button
                key={time.value}
                onClick={() => setTimeframe(time.value)}
                variant={time.value === timeframe ? "contained" : "outlined"}
                fullWidth
              >
                {time.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Chart */}
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: { mode: "index", intersect: false },
                  legend: { display: false },
                },
                scales: {
                  x: { display: true },
                  y: { display: true, beginAtZero: false },
                },
              }}
            />
          ) : (
            <Typography>Loading chart...</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Crypto;
