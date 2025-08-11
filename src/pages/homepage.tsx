// React
import { useEffect, useState } from "react";

// UI Components
import { Avatar } from "@mui/material";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import SearchBar from "@/components/SearchBar";

// App Components
import ConversationsList from "../components/ConversationsList";
import MessagePanel from "../components/MessagePanel";

// Utils
import { deepOrange } from "@mui/material/colors";
import useUser from "@/hooks/useUser";
import api from "@/lib/axios";

// Types
import type { Message } from "@/types/message";
import ToggleTheme from "@/components/ToggleTheme";
import LogoutButton from "@/components/LogoutButton";

const HomePage = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(res.data); // make sure to use res.data
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          // className="items-center justify-center"
          // style={{ backgroundColor: "#111827" }}
          minSize={20}
          maxSize={50}
          defaultSize={25}
        >
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
            <div className="text-xl">
              <h1>{user?.username || "Welcome"}</h1>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 20,
              }}
            >
              <LogoutButton/>
              <ToggleTheme/>
            </div>
            <SearchBar
              setMessages={setMessages}
              setConversationId={setConversationId}
            />
          </div>
          <div style={{ flexDirection: "column" }}>
            <ConversationsList setConversationId={setConversationId} />
          </div>
        </ResizablePanel>

        <ResizableHandle />
        {/* style={{ backgroundColor: "#374151" }}  */}
        <ResizablePanel>
          {/* style={{ backgroundColor: "#1f2937" }} */}
          <div>
            <MessagePanel
              messages={messages}
              conversationId={conversationId}
            ></MessagePanel>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default HomePage;
