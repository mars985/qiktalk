import React, { useState, useRef, useEffect } from "react";
import { Plus, MessageSquarePlus, Users } from "lucide-react";
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

  const closeAll = () => {
    setOpen(false);
    setMode(null);
  };

  // Close on outside click or Escape — only while open.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        className="btn btn-primary btn-sm gap-1"
        onClick={() => (open ? closeAll() : setOpen(true))}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Plus size={16} />
        New
      </button>

      {open && !mode && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-base-200"
            onClick={() => setMode("chat")}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <MessageSquarePlus size={18} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">New chat</span>
              <span className="text-xs text-base-content/60">
                Message one person directly
              </span>
            </span>
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-base-200"
            onClick={() => setMode("group")}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
              <Users size={18} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">New group</span>
              <span className="text-xs text-base-content/60">
                Chat with several people
              </span>
            </span>
          </button>
        </div>
      )}

      {open && mode === "chat" && (
        <NewChatPanel
          onNewChat={onNewChat}
          onClose={closeAll}
          onBack={() => setMode(null)}
        />
      )}

      {open && mode === "group" && (
        <NewGroupPanel
          onNewGroup={onNewGroup}
          onClose={closeAll}
          onBack={() => setMode(null)}
        />
      )}
    </div>
  );
};

export default NewChatDropdown;
