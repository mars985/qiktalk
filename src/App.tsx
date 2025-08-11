import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

import ProtectedRoute from "./components/ui/protectedroute";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <UserProvider>
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            </UserProvider>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
