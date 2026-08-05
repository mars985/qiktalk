import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/lib/axios";
import useUser from "@/hooks/useUser";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/verify")
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
          navigate("/", { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [navigate, setUser]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default PublicRoute;