import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useCryptocontext } from "../../Context/CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/FirebaseConfif";
import { numberWithCommas } from "../banner/Banner";
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, setDoc } from "firebase/firestore";

const Drawer = () => {
  const { toggleDrawer, user, setAlert, watchlist, coins, symbol } = useCryptocontext();

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });
    toggleDrawer();
  };
  const removeFromWatchlist = async (coin) => {
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

  return (
    <Box sx={{ width: 350, height: "100vh", display: "flex", flexDirection: "column" }} role="presentation" onClick={toggleDrawer(false)}>
      <Stack py={3} spacing={2} alignItems="center">
        <Avatar
          src={user?.photoURL ? user?.photoURL.replace("=s96-c", "") : ""}
          alt={user?.displayName || user?.email || "User Avatar"}
          sx={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {!user?.photoURL && <PersonIcon fontSize="large" />}
        </Avatar>

        <Typography variant="h4" sx={{ fontSize: "25px", fontWeight: "600", color: "#1d1a1a" }}>
          {user.displayName ? user.displayName : user?.email}
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column" }}>
        <Typography sx={{ color: "brown", textAlign: "center", mb: 1 }} variant="h6">
          Watchlist
        </Typography>

        <Box sx={{ flex: 1, overflowY: "scroll", backgroundColor: "#dfe6e9", px: 2, py: 1 }}>
        {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <DeleteIcon
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
        </Box>
      </Box>

      <Button
        sx={{ mx: 2, backgroundColor: "#ffd32a", color: "black", px: 2, fontWeight: 500, width: "90%", mb: 2 }}
        variant="contained"
        onClick={logOut}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Drawer;
