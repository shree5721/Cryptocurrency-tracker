import React, { useEffect, useState } from "react";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
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
  const [error, setError]= useState("")
  let { currency, symbol } = useCryptocontext();

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
    setError(error.message)
   }
  };

  useEffect(() => {
    TrendingCoins(currency);
  }, [currency]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4, // Number of items to show on large screens
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3, // Number of items to show on medium screens
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2, // Number of items to show on small screens
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, // Number of items to show on very small screens
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
          height: "400px",
          width: "100%",
          marginTop: "80px",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography color="#f1f2f6" variant="h2" fontWeight="bolder">
            Crypto Tracking
          </Typography>
          <Typography color="#ced6e0" mt={1} variant="subtitle2">
            Crypto Tracking is the #1 crypto portfolio tracker app.
          </Typography>
        </Container>
        { 
          error ? <h2 style={{color: "gold", textAlign:"center",marginTop:"30px"}}>Couldn't fetch data</h2>
        :
        <Container maxWidth="lg" sx={{ my: 4 }}>
          {loading ? (
           <Box sx={{ width: '100%' }}>
           <LinearProgress />
           </Box>
          ) : (
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              transitionDuration={1500}
              removeArrowOnDeviceType={["tablet", "mobile"]}
              arrows={false}
            >
              {trendingCoins.map((coin, index) => (
                <Link to={`coin/${coin.id}`} key={index}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      style={{ width: "100px", marginBottom: "10px" }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ textAlign: "center" }}
                    >
                      <span style={{ color: "#d2dae2", fontWeight: "bold" }}>
                        {coin.symbol.toUpperCase()}
                      </span>{" "}
                      {coin?.price_change_percentage_24h >= 0 && "+"}
                      <span
                        style={{
                          color:
                            coin.price_change_percentage_24h > 0
                              ? "green"
                              : "#ff3838",
                          fontWeight: "bold",
                        }}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </Typography>
                    <Typography variant="h5" color="#7efff5" fontWeight="bold">
                      {symbol}
                      {numberWithCommas(coin.current_price.toFixed(2))}
                    </Typography>
                  </div>
                </Link>
              ))}
            </Carousel>
          )}
        </Container> }
      </Box>
    </>
  );
};

export default Banner;
