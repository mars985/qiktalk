import { useNavigate } from "react-router-dom";

import api from "@/lib/axios";
import { Button } from "./ui/button";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant={"secondary"}
      onClick={() => {
        api.get("/logout");
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
