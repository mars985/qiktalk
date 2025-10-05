import React from "react";
import SearchBar from "./SearchUsers";
import api from "@/lib/axios";
import type { User } from "@/types/user";

interface NewChatPanelProps {
  onNewChat: (conversationId: string) => void;
  onClose: () => void;
}

const NewChatPanel: React.FC<NewChatPanelProps> = ({ onNewChat, onClose }) => {
  const handleSelectUser = async (targetUser: User) => {
    try {
      const convRes = await api.post("/createDM", {
        targetUserId: targetUser._id,
      });
      onNewChat(convRes.data.data._id);
      onClose();
    } catch (err) {
      console.error("Error creating DM:", err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-md shadow-lg p-3 z-50">
      <SearchBar
        placeholder="Search username..."
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default NewChatPanel;
