import ConversationsList from "@/components/sidebar/ConversationsList";
import { ImageViewer } from "@/components/avatar/ImageViewer";
import LogoutButton from "@/components/sidebar/LogoutButton";
import ToggleTheme from "@/components/sidebar/ToggleTheme";
// import SearchBar from "@/components/SearchBar";

import useUser from "@/hooks/useUser";
import NewChatDropdown from "@/components/new-conversation/NewChatDropdown";

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
          {user && <ImageViewer user={user} className="scale-150" />}
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

          <ToggleTheme />

          <div className="w-2" />

          <NewChatDropdown
            onNewChat={(conversationId) => setConversationId(conversationId)}
            onNewGroup={(conversationId) => setConversationId(conversationId)}
          />
        </div>
        {/* <div style={{ padding: 20 }}>
          <SearchBar />
        </div> */}
      </div>
      <div className="flex-1 overflow-y-auto">
        <ConversationsList setConversationId={setConversationId} />
      </div>
    </div>
  );
};

export default SideBar;
