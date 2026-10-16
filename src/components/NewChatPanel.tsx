import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, X } from "lucide-react";

import SearchBar from "./SearchUsers";
import type { User } from "@/types/user";
import { ConversationRequest } from "@/api/conversation.api";

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

  const handleSelectUser = async (targetUser: User) => {
    setError(null);

    try {
      const response = await ConversationRequest.createDM(targetUser._id);

      onNewChat(response.data.data._id);
      onClose();
    } catch (error) {
      setError(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          "Couldn't start chat. Try again.",
      );
    }
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

      <SearchBar
        placeholder="Search by username..."
        onSelectUser={handleSelectUser}
      />

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
};

export default NewChatPanel;
