import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";

export default function App() {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      // alert("Connected to the server!");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {true? <HomePage></HomePage>:<LoginPage></LoginPage>}
    </>
  );
}
