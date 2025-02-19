import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { createContext } from 'react'
import { auth, db } from "../config/FirebaseConfif";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext()

const CryptoContext = ({children}) => {
   const [currency, setCurrency] =useState("INR")
   const [symbol, setSymbol] =useState("₹")
   const [coins, setCoins] = useState([]);
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState();
   const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: ""
   });
    const [opendrawer, setOpenDrawer] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
      if (user) {
        const coinRef = doc(db, "watchlist", user?.uid);
        var unsubscribe = onSnapshot(coinRef, (coin) => {
          if (coin.exists()) {
            setWatchlist(coin.data().coins);
          } else {
            console.log("No Items in Watchlist");
          }
        });
  
        return () => {
          unsubscribe();
        };
      }
    }, [user]);
   
    const toggleDrawer = useCallback((newOpen) => () => {
      setOpenDrawer(newOpen);
    }, []);

       const Allcoins = useCallback(async (currency) => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
          );
          const data = await response.json();
          setCoins(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }, []);

   useEffect(()=>{
    if(currency === "INR"){
        setSymbol("₹")
    }else if(currency === "USD"){
        setSymbol("$")
   }},[currency])

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User state changed:", user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    symbol,
    coins,
    loading,
    setLoading,
    setCoins,
    Allcoins,
    user,
    setUser,
    alert,
    setAlert,
    opendrawer,
    toggleDrawer,
    watchlist,
    setWatchlist,
  }), [currency, symbol, coins, loading, user, alert, opendrawer, watchlist]);

  return (
    <Crypto.Provider value={contextValue}>
        {children}
    </Crypto.Provider>
  )
}

export const useCryptocontext =()=>{
    return useContext(Crypto)
}

export default CryptoContext