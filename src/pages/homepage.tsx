import Messages from "../components/messages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import Conversations from "../components/conversations";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownmenu";
import { useTheme } from "@/components/providers/theme-provider";

import { useNavigate } from "react-router-dom";

import type { User } from "../types/user";
import type { Message } from "../types/message";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  const { setTheme } = useTheme();

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-gray-500 h-full"
      >
        <ResizablePanel
          className="items-center justify-center"
          style={{ backgroundColor: "#111827" }}
          minSize={20}
          maxSize={50}
          defaultSize={25}
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

          <div style={{ flexDirection: "column" }}>
            <Conversations users={userArr}></Conversations>
          </div>
        </ResizablePanel>

        <ResizableHandle style={{ backgroundColor: "#374151" }} />

        <ResizablePanel style={{ backgroundColor: "#1f2937" }}>
          <Messages messages={messagesArr}></Messages>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default HomePage;

const userArr = [
  {
    id: "1",
    name: "Alice",
    avatarUrl: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "2",
    name: "Bob",
    avatarUrl: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "3",
    name: "Charlie",
    avatarUrl: "https://i.pravatar.cc/40?img=3",
  },
] as const satisfies User[];

const messagesArr: Message[] = [
  {
    id: "1",
    body: "Hello, how are you?",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    body: "I'm good, thanks! And you?",
    sender: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    body: "Doing well, just working on a project.",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    body: "Hello, how are you?",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    body: "I'm good, thanks! And you?",
    sender: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    body: "Doing well, just working on a project.",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    body: "Hello, how are you?",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    body: "I'm good, thanks! And you?",
    sender: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    body: "Doing well, just working on a project.",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    body: "Hello, how are you?",
    sender: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    body: "I'm good, thanks! And you?",
    sender: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    body: "Doing well, just working on a project.",
    sender: "1",
    timestamp: new Date(),
  },
];
