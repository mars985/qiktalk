import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import useUser from "@/hooks/useUser";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser();

  useEffect(() => {
    api
      .get("/verify")
      .then((res) => {
        if (res.data.verified) {
          setUser(res.data.user);
          setLoading(false);
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, setUser]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
