import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/header/Header";
import Alert from "./Components/alert/Alert";
import React, { Suspense } from "react";
import { LinearProgress } from "@mui/material";
const Home = React.lazy(()=>import("./Pages/Home"))
const Crypto = React.lazy(()=>import("./Pages/Crypto"))

function App() {
  return (
    <>
      <BrowserRouter>
        <div style={{ backgroundColor: "#f7f1e3", height: "100%" }}>
          <Header />
            <Suspense fallback={<div><LinearProgress sx={{mt:"30px"}} /></div>}>
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="coin/:id" element={<Crypto />} />
          </Routes>
            </Suspense>
        </div>
        <Alert />
      </BrowserRouter>
    </>
  );
}

export default App;
