import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/verify")
      .then((res) => {
        if (res.data.verified) {
          setLoading(false);
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
