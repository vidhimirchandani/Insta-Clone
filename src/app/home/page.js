"use client"

import { useContext, useState } from "react";
import Feed from "../components/feed";
import Login from "../components/login";
import { GlobalContext } from "../state/context/GlobalContext";

const Home=()=>{
     
   const {isAuthenticated, isOnboarded}=useContext(GlobalContext);

    // const[isAuthenticated,setIsAuthenticated]=useState(true);

    return(
    (isAuthenticated && isOnboarded) ? <Feed/>:<Login/>
    )
}

export default Home;

