import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

import ConversationsList from "@/components/ConversationsList";
import LogoutButton from "@/components/LogoutButton";
// import ToggleTheme from "@/components/ToggleTheme";
import SearchBar from "@/components/SearchBar";

import useUser from "@/hooks/useUser";

const SideBar: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-screen">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            alignContent: "center",
            height: 120,
          }}
        >
          <Avatar sx={{ bgcolor: deepOrange[500], scale: 2 }}>M</Avatar>
        </div>
        <h1 className="text-xl">{user?.username || "Welcome"}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            padding: 20,
          }}
        >
          <LogoutButton />
          <div className="w-2" />
          {/* <ToggleTheme /> */}
        </div>
        <div style={{ padding: 20 }}>
          <SearchBar setConversationId={setConversationId} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ConversationsList setConversationId={setConversationId} />
      </div>
    </div>
  );
};

export default SideBar;
