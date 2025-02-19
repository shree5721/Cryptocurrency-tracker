import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import {
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
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import { ThemeProvider } from "@emotion/react";
import { useCryptocontext } from "../../Context/CryptoContext";
import { Link } from "react-router-dom";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import GoogleButton from "react-google-button";
import { auth } from "../../config/FirebaseConfif";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import DrawerComponent from "../drawer/Drawer";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  const { currency, setCurrency, user,setUser, setAlert, toggleDrawer, opendrawer } = useCryptocontext();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSignup=async()=>{
    if( !signupemail || !signuppassword || !signupconfirmpassword ){
      setAlert({
        open: true,
        message: "Please fill in all fields",
        type: "error",
      })
    }
    else if(signuppassword !== signupconfirmpassword){
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
        })
    }
    else if( signuppassword.length < 8 ){
      setAlert({
        open: true,
        message: "Password must be at least 8 characters",
        type: "error",
        })
    }
    else{
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          signupemail,
          signuppassword
        );
        
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
        return;
      }
    }

  }
  const handleLogin=async()=>{
    if(!email || !password){
      setAlert({
        open: true,
        message: "Please fill in all fields",
        type: "error",
      })
    }
    else{
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser( result.user);
        console.log(result);
        
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
  }
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth,provider)
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
      return;
    });
  };
  

  const theme = createTheme({
    palette: {
      primary: {
        main: "#00141d", // Dark gray/blackish background for AppBar
      },
      secondary: {
        main: "#fff", // White color for text and icons
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
              borderColor: "#fff", // Border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff", // Border color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff", // Border color when focused
            },
            color: "#fff", // Text color
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fill: "white", // Dropdown arrow color
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        color="primary"
        sx={{
          paddingBlock: "8px",
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to="/">
              <Typography fontWeight="bolder" variant="h5" color="#ecf0f1">
                <span style={{ color: "#ffd32a", fontWeight: "bolder" }}>
                  {" "}
                  Crypto{" "}
                </span>{" "}
                Tracker
              </Typography>
            </Link>
            <Box sx={{ display: "flex", alignItems: "center", columnGap:"30px" }}>
              <FormControl size="small">
                <InputLabel id="demo-select-small-label">Currency</InputLabel>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  labelId="demo-select-small-label"
                  label="Currency"
                  sx={{ width: "120px" }}
                  id="demo-select-small"
                >
                  <MenuItem value={"INR"}>INR</MenuItem>
                  <MenuItem value={"USD"}>USD</MenuItem>
                </Select>
              </FormControl>
              {user ? (
                <>
                <Avatar src={user?.photoURL ? user?.photoURL.replace("=s96-c", "")  : <PersonIcon />} sx={{cursor:"pointer"}} onClick={toggleDrawer(true)} />
                <Drawer sx={{width:350}} anchor="right" open={opendrawer} onClose={toggleDrawer(false)}>
                {DrawerComponent()}
              </Drawer>
              </>
              ) : (
                <Button
                  onClick={handleOpen}
                  sx={{
                    ml: "20px",
                    backgroundColor: "#ffd32a",
                    color: "black",
                    px: "30px",
                    fontWeight: "500",
                  }}
                  variant="contained"
                >
                  Login
                </Button>
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "white", // Sets bottom border to white
                  },
                  "& .Mui-selected": {
                    color: "white", // Ensures selected tab text is white
                  },
                }}
              >
                <TabList
                  sx={{ justifyContent: "space-around" }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  textColor="inherit"
                >
                  <Tab label="Login" value="1" />
                  <Tab label="Signup" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Stack spacing={2}>
                  <FormControlContext>
                    <TextField
                     
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      
                      type="password"
                      label="Password"
                      variant="outlined"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                    />
                  </FormControlContext>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#ffd32a", color: "black" }}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Box textAlign="center">Or</Box>
                  <GoogleButton
                    style={{width:"100%"}}
                    onClick={signInWithGoogle}
                  />
                </Stack>
              </TabPanel>
              <TabPanel value="2">
                <Stack spacing={2}>
                  <FormControlContext>
                    <TextField
                      id="outlined-basic"
                      type="email"
                      label="Email"
                      variant="outlined"
                      value={signupemail}
                      onChange={(e) => setsignupEmail(e.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Password"
                      type="password"
                      variant="outlined"
                      value={signuppassword}
                      onChange={e => setsignupPassword(e.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      type="password"
                      label="Confirm Password"
                      variant="outlined"
                      value={signupconfirmpassword}
                      onChange={e => setsignupConfirmPassword(e.target.value)}
                    />
                  </FormControlContext>
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
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Header;
