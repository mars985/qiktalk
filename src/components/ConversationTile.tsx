import React from "react";

import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

interface ConversationTileProps {
  conv: Conversation;
  user: User;
  onSelect: (id: string) => void;
}

const ConversationTile: React.FC<ConversationTileProps> = ({ conv, user, onSelect }) => {
  const lastMessage = conv.messages.at(-1);
  const participants = conv.participants
    .filter((p) => p._id !== user._id)
    .map((p) => p.username);

  return (
    <li
      className="
        p-4 sm:p-3 md:p-4 rounded-md shadow cursor-pointer 
        transition-all duration-200 
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700"
      onClick={() => onSelect(conv._id)}
    >
      <div className="font-medium">
        {conv.type === "group"
          ? conv.groupName || "Unnamed Group"
          : participants.length > 0
          ? participants.join(", ")
          : "No participants"}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
        {lastMessage?.body || "No messages yet"}
      </div>
    </li>
  );
};

export default ConversationTile;
