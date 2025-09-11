import { Route, Routes } from "react-router-dom";

// import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
    // </ThemeProvider>
  );
}
