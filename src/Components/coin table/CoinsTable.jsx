import {
  Box,
  Container,
  LinearProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useCryptocontext } from "../../Context/CryptoContext";
import { numberWithCommas } from "../banner/Banner";
import { useNavigate } from "react-router-dom";

const CoinsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { currency, symbol, coins, loading, Allcoins } = useCryptocontext();
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    Allcoins(currency);
  }, [currency, Allcoins]);

  const handlePage = useCallback((event, value) => {
    setPage(value);
    window.scroll(0, 300);
  }, []);

  const filterData = () => {
    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    });
  };

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <Typography
          mt={3}
          variant={isMobile ? "h5" : "h4"}
          sx={{ marginBottom: "20px", color: "#2c2c54", textAlign: "center" }}
        >
          Crypto Prices By Market Price
        </Typography>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          label="Search for crypto"
          sx={{ width: "100%", marginBottom: "20px" }}
        />
      </Container>

      <Container
        py={3}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          overflowX: "auto", // Make table scrollable horizontally on mobile
        }}
      >
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ minWidth: isMobile ? "600px" : "100%" }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#00141d" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Coin
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white" }}
                      align="right"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white" }}
                      align="right"
                    >
                      Change
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white" }}
                      align="right"
                    >
                      Market Cap
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData()
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map((coin) => (
                      <TableRow
                        key={coin.id}
                        onClick={() => navigate(`coin/${coin.id}`)}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                        className="crypto_row"
                      >
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            <img
                              src={coin.image}
                              alt={coin.name}
                              style={{
                                width: isMobile ? "40px" : "80px",
                                height: isMobile ? "40px" : "80px",
                              }}
                            />
                            <Stack>
                              <Typography
                                sx={{ color: "#2c2c54" }}
                                fontWeight="bold"
                                variant={isMobile ? "subtitle2" : "h6"}
                              >
                                {coin.symbol.toUpperCase()}
                              </Typography>
                              <Typography variant="caption">
                                {coin.name}
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "14px" : "17px",
                            color: "#1e272e",
                          }}
                          align="right"
                        >
                          {symbol} {numberWithCommas(coin.current_price)}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "14px" : "17px",
                            color:
                              coin.price_change_percentage_24h > 0
                                ? "#05c46b"
                                : "#ff3838",
                          }}
                          align="right"
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "14px" : "17px",
                            color: "#1e272e",
                          }}
                          align="right"
                        >
                          {symbol}{" "}
                          {numberWithCommas(
                            coin.market_cap.toString().slice(0, -6)
                          )}{" "}
                          M
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Container sx={{ py: "20px" }}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Pagination
                  count={Math.ceil(coins.length / 10)}
                  page={page}
                  onChange={handlePage}
                  aria-label="Pagination"
                  size={isMobile ? "small" : "medium"}
                />
              </Stack>
            </Container>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CoinsTable;
