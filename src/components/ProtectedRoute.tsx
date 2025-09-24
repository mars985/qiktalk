import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "@/hooks/useUser";
import api from "@/lib/axios";
import socket from "@/lib/socket";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user) {
      socket.connect();

      socket.on("connect", () => {
        socket.emit("userlogin", user._id.toString());
      });

      return () => {
        socket.off("connect");
        socket.disconnect();
      };
    }
  }, [user]);

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
