import { Route, Routes } from "react-router-dom";

import { UserProvider } from "@/contexts/UserContext";
import { PresenceProvider } from "@/contexts/PresenceContext";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "@/pages/guards/ProtectedRoute";
import PublicRoute from "@/pages/guards/PublicRoute";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PresenceProvider>
                <HomePage />
              </PresenceProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}
