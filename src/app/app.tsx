import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/nav-bar";
import Home from "./components/home";
import Animations from "./components/animations";
import About from "./components/about";
import * as swUtils from "./utils/service-worker-utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const App = () => {
  let nwOfflineStatus = useRef(false).current;

  useEffect(() => {
    setInterval(() => {
      const isOffline = !swUtils.checkOnline();

      if (isOffline != nwOfflineStatus) {
        nwOfflineStatus = isOffline;
        if (isOffline) {
          toast("You're offline right now. Check your connection.");
        } else {
          toast("You're online right now.");
        }
      }
    }, 1000);
  });

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animations" element={<Animations />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
