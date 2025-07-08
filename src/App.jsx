import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
import AppRoutes from "./routers/AppRoutes";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom"; 
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
function App() {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App
