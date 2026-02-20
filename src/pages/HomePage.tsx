import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

import MessagePanel from "@/components/MessagePanel";
import SideBar from "@/components/SideBar";

const HomePage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resizing to detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="h-full w-full">
        {!conversationId ? (
          <SideBar setConversationId={setConversationId} />
        ) : (
          <MessagePanel 
            conversationId={conversationId} 
            onBack={() => setConversationId(null)}
          />
        )}
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel minSize={20} maxSize={50} defaultSize={25}>
        <SideBar setConversationId={setConversationId} />
      </ResizablePanel>

      <ResizableHandle className="bg-base-300" />

      <ResizablePanel>
        <MessagePanel conversationId={conversationId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default HomePage;