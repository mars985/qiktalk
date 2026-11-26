import { useNavigate } from "react-router-dom";

import { UserRequest } from "@/api/user.api";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className="btn"
      onClick={async () => {
        try {
          await UserRequest.logout();
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
