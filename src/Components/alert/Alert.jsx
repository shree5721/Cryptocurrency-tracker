import { Snackbar } from "@mui/material";
import { useCryptocontext } from "../../Context/CryptoContext";
import Alertt from '@mui/material/Alert';


const Alert = () => {
  const { alert, setAlert } = useCryptocontext();

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
    >
      <Alertt
        onClose={handleCloseAlert}
        elevation={10}
        variant="filled"
        severity={alert.type}
      >
        {alert.message}
      </Alertt>
    </Snackbar>
  );
};

export default Alert;