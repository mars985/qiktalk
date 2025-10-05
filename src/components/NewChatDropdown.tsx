import React, { useState, useRef, useEffect } from "react";
import NewChatPanel from "./NewChatPanel";
import NewGroupPanel from "./NewGroupPanel";

interface Props {
  onNewChat: (conversationId: string) => void;
  onNewGroup: (conversationId: string) => void;
}

const NewChatDropdown: React.FC<Props> = ({ onNewChat, onNewGroup }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "group" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setMode(null);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button className="btn btn-secondary" onClick={() => setOpen((o) => !o)}>
        + New
      </button>

      {open && !mode && (
        <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded-md shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-base-200"
            onClick={() => setMode("chat")}
          >
            New Chat
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-base-200"
            onClick={() => setMode("group")}
          >
            New Group
          </button>
        </div>
      )}

      {open && mode === "chat" && (
        <NewChatPanel onNewChat={onNewChat} onClose={closeAll} />
      )}

      {open && mode === "group" && (
        <NewGroupPanel onNewGroup={onNewGroup} onClose={closeAll} />
      )}
    </div>
  );
};

export default NewChatDropdown;
