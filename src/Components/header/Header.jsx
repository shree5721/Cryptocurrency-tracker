import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GoogleButton from "react-google-button";
import { auth } from "../../config/FirebaseConfif";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCryptocontext } from "../../Context/CryptoContext";
import DrawerComponent from "../drawer/Drawer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  backgroundColor: "#00141d",
  color: "white",
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupemail, setsignupEmail] = useState("");
  const [signuppassword, setsignupPassword] = useState("");
  const [signupconfirmpassword, setsignupConfirmPassword] = useState("");

  const { currency, setCurrency, user, setUser, setAlert, toggleDrawer, opendrawer } = useCryptocontext();

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSignup = async () => {
    if (!signupemail || !signuppassword || !signupconfirmpassword) {
      setAlert({
        open: true,
        message: "Please fill in all fields",
        type: "error",
      });
    } else if (signuppassword !== signupconfirmpassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
    } else if (signuppassword.length < 8) {
      setAlert({
        open: true,
        message: "Password must be at least 8 characters",
        type: "error",
      });
    } else {
      try {
        const result = await createUserWithEmailAndPassword(auth, signupemail, signuppassword);
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${result.user.email}`,
          type: "success",
        });
        handleClose();
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill in all fields",
        type: "error",
      });
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
        setAlert({
          open: true,
          message: `Login Successful. Welcome ${result.user.email}`,
          type: "success",
        });
        handleClose();
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });
        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#00141d",
      },
      secondary: {
        main: "#fff",
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&.Mui-focused": {
              color: "#fff",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            color: "#fff",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fill: "white",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
              py: isMobile ? 2 : 0,
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h5" fontWeight="bold" color="#ecf0f1">
                <span style={{ color: "#ffd32a" }}>Crypto</span> Tracker
              </Typography>
            </Link>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small">
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  labelId="currency-select-label"
                  label="Currency"
                  sx={{ width: 100 }}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>

              {user ? (
                <>
                  <Avatar
                    src={user?.photoURL ? user?.photoURL.replace("=s96-c", "") : undefined}
                    sx={{ cursor: "pointer" }}
                    onClick={toggleDrawer(true)}
                  >
                    {!user?.photoURL && <PersonIcon />}
                  </Avatar>
                  <Drawer anchor="right" open={opendrawer} onClose={toggleDrawer(false)}>
                    {DrawerComponent()}
                  </Drawer>
                </>
              ) : (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#ffd32a", color: "black", px: 4, fontWeight: "500" }}
                  onClick={handleOpen}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                },
              }}
            >
              <TabList
                onChange={handleChange}
                variant="fullWidth"
                textColor="inherit"
              >
                <Tab label="Login" value="1" />
                <Tab label="Signup" value="2" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#ffd32a", color: "black" }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Box textAlign="center">Or</Box>
                <GoogleButton style={{ width: "100%" }} onClick={signInWithGoogle} />
              </Stack>
            </TabPanel>

            <TabPanel value="2">
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={signupemail}
                  onChange={(e) => setsignupEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={signuppassword}
                  onChange={(e) => setsignupPassword(e.target.value)}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={signupconfirmpassword}
                  onChange={(e) => setsignupConfirmPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#ffd32a", color: "black" }}
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Header;
