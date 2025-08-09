// React & routing
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Theme & icons
import { Moon, Sun } from "lucide-react";

// UI Components
import { Avatar } from "@mui/material";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownmenu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import SearchBar from "@/components/searchbar";

// App Components
import ConversationsList from "../components/conversationslist";
import Messages from "../components/messages";

// Utils
import axios from "axios";
import { deepOrange } from "@mui/material/colors";
import useUser from "@/hooks/useUser";
import { useTheme } from "@/hooks/useTheme";

// Types
import type { Message } from "@/types/message";

const HomePage = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

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
              <Button
                variant={"secondary"}
                onClick={() => {
                  axios.get("http://localhost:3000/logout", {
                    withCredentials: true,
                  });
                  navigate("/login");
                }}
              >
                Logout
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <SearchBar setMessages={setMessages} setConversationId={setConversationId} />
          </div>
          <div style={{ flexDirection: "column" }}>
            <ConversationsList setConversationId={setConversationId}/>
          </div>
        </ResizablePanel>

        <ResizableHandle />
        {/* style={{ backgroundColor: "#374151" }}  */}
        <ResizablePanel>
          {/* style={{ backgroundColor: "#1f2937" }} */}
          <div>

            <Messages messages={messages} conversationId={conversationId}></Messages>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default HomePage;
