import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "@/hooks/useUser";
import socket from "@/lib/socket";
import { UserRequest } from "@/api/user.api";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    UserRequest.verify()
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
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
