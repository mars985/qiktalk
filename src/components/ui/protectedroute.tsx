import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/verify", { withCredentials: true }) // your backend auth check
      .then(() => setLoading(false))
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
