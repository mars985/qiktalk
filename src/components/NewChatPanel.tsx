import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import SearchBar from "./SearchUsers";
import socket from "@/lib/socket";
import type { User } from "@/types/user";
import type { Conversation } from "@/types/conversation";

interface NewChatPanelProps {
  onNewChat: (conversationId: string) => void;
  onClose: () => void;
  onBack: () => void;
}

const NewChatPanel: React.FC<NewChatPanelProps> = ({
  onNewChat,
  onClose,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  // Create (or reuse) a DM over the socket so both participants are notified in
  // real time — same path the group flow uses.
  const handleSelectUser = (targetUser: User) => {
    setError(null);
    socket.emit(
      "createConversation",
      { conversationType: "dm", targetUserId: targetUser._id },
      (response: {
        success: boolean;
        data?: Conversation;
        message?: string;
      }) => {
        if (response.success && response.data) {
          onNewChat(response.data._id);
          onClose();
        } else {
          setError(response.message || "Couldn't start chat. Try again.");
        }
      }
    );
  };

  return (
    <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="rounded-lg p-1 transition-colors hover:bg-base-200"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="flex-1 text-sm font-semibold">New chat</span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 transition-colors hover:bg-base-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <SearchBar placeholder="Search by username..." onSelectUser={handleSelectUser} />

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
};

export default NewChatPanel;
