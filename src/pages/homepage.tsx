import Messages from "../components/ui/messages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import UsersListView from "../components/ui/users";

import type { User } from "../types/user";
import type { Message } from "../types/message";

const HomePage = () => {
  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-gray-500 h-full"
      >
        <ResizablePanel
          className="w-full items-center justify-center bg-red-300"
          minSize={20}
          maxSize={50}
          defaultSize={25}
        >
          <div className="flex flex-col justify-top h-full">
            <div className="h-16 flex items-center justify-center">
              <h1 className="text-2xl font-bold">User</h1>
            </div>
            <hr />
            <UsersListView users={userArr} />
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-gray-400" />

        <ResizablePanel className="w-full bg-blue-300">
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
    content: "Hello, how are you?",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "I'm good, thanks! And you?",
    senderId: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Doing well, just working on a project.",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    content: "Hello, how are you?",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "I'm good, thanks! And you?",
    senderId: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Doing well, just working on a project.",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    content: "Hello, how are you?",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "I'm good, thanks! And you?",
    senderId: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Doing well, just working on a project.",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "1",
    content: "Hello, how are you?",
    senderId: "1",
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "I'm good, thanks! And you?",
    senderId: "2",
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Doing well, just working on a project.",
    senderId: "1",
    timestamp: new Date(),
  },
];
