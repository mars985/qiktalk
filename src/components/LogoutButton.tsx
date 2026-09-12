import { useNavigate } from "react-router-dom";

import api from "@/lib/axios";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-xs sm:btn-sm md:btn-md"
      onClick={async () => {
        try {
          await api.get("/logout");
        } finally {
          navigate("/login");
        }
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
