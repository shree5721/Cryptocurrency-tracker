import React, { useEffect, useState } from "react";
import { Box, Container, LinearProgress, Typography, useTheme, useMediaQuery } from "@mui/material";
import CryptoImage2 from "../../Assets/CryptoImage2.jpg";
import { useCryptocontext } from "../../Context/CryptoContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

export const numberWithCommas = (x) => {
  if (!x) return "Not Available";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Banner = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currency, symbol } = useCryptocontext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 👈 Detect mobile screen

  const TrendingCoins = async (currency) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      );
      const data = await response.json();
      setTrendingCoins(data);
      setLoading(false);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    TrendingCoins(currency);
  }, [currency]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1536 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1536, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${CryptoImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          p: 4,
          height: isMobile ? "auto" : "400px", // 👈 On mobile height becomes auto
          width: "100%",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center", // 👈 Center align text
            gap: 2,
          }}
        >
          <Typography
            color="#f1f2f6"
            variant={isMobile ? "h4" : "h2"} // 👈 Smaller font on mobile
            fontWeight="bolder"
          >
            Crypto Tracking
          </Typography>
          <Typography
            color="#ced6e0"
            mt={1}
            variant={isMobile ? "body1" : "subtitle2"} // 👈 Slightly bigger description text on mobile
          >
            Crypto Tracking is the #1 crypto portfolio tracker app.
          </Typography>
        </Container>

        {error ? (
          <Typography variant="h6" color="gold" textAlign="center" mt={4}>
            Couldn't fetch data
          </Typography>
        ) : (
          <Container maxWidth="lg" sx={{ my: 4 }}>
            {loading ? (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            ) : (
              <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={2000}
                keyBoardControl
                transitionDuration={1500}
                removeArrowOnDeviceType={["tablet", "mobile"]}
                arrows={false}
              >
                {trendingCoins.map((coin, index) => (
                  <Link to={`coin/${coin.id}`} key={index} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        backgroundColor: "rgba(0,0,0,0.5)", // 👈 Little background for better mobile look
                        borderRadius: 2,
                      }}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        style={{ width: isMobile ? "70px" : "100px", marginBottom: "10px" }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "center", color: "#d2dae2", fontWeight: "bold" }}
                      >
                        {coin.symbol.toUpperCase()}{" "}
                        {coin?.price_change_percentage_24h >= 0 && "+"}
                        <span
                          style={{
                            color: coin.price_change_percentage_24h > 0 ? "lightgreen" : "#ff3838",
                            fontWeight: "bold",
                          }}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </Typography>
                      <Typography variant="h6" color="#7efff5" fontWeight="bold">
                        {symbol}
                        {numberWithCommas(coin.current_price.toFixed(2))}
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </Carousel>
            )}
          </Container>
        )}
      </Box>
    </>
  );
};

export default Banner;
