import React, { Suspense } from "react";
import Header from "../Components/header/Header";
import { LinearProgress } from "@mui/material";
const CoinsTable = React.lazy(() =>
  import("../Components/coin table/CoinsTable")
);
const Banner = React.lazy(() => import("../Components/banner/Banner"));

const Home = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<LinearProgress sx={{width:"70%", margin:"50px auto"}} />} >
      <Banner />
      </Suspense>
      <Suspense
        fallback={
          <>
           <div>
           <LinearProgress sx={{mt:"50px"}} color="secondary" />
            <LinearProgress sx={{mt:"15px"}} color="success" />
            <LinearProgress sx={{mt:"15px"}} color="inherit" />
           </div>
          </>
        }
      >
        <CoinsTable />
      </Suspense>
    </>
  );
};

export default Home;
