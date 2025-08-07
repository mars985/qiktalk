import { useEffect } from "react";
import { io } from "socket.io-client";

import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ui/protectedroute";
import SignupPage from "./pages/signuppage";
import { ThemeProvider } from "./components/providers/theme-provider";
import { UserProvider } from "./contexts/UserContext";

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
              </ProtectedRoute>{" "}
            </UserProvider>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
