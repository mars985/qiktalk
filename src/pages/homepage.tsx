import { useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

import MessagePanel from "@/components/MessagePanel";
import SideBar from "@/components/SideBar";

const HomePage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel minSize={20} maxSize={50} defaultSize={25}>
          <SideBar setConversationId={setConversationId} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
            <MessagePanel conversationId={conversationId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default HomePage;
