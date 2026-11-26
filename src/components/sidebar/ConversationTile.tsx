import React from "react";
import Avatar from "@/components/avatar/Avatar";
import usePresence from "@/hooks/usePresence";

import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

interface ConversationTileProps {
  conv: Conversation;
  user: User;
  onSelect: (id: string) => void;
}

const ConversationTile: React.FC<ConversationTileProps> = ({
  conv,
  user,
  onSelect,
}) => {
  const { getStatus } = usePresence();
  const lastMessage = conv.messages.at(-1);
  const otherUsers = conv.participants.filter((p) => p._id !== user._id);
  const dmPartnerOnline =
    conv.type === "dm"
      ? (getStatus(otherUsers[0]?._id)?.online ?? false)
      : undefined;

  const senderName =
    lastMessage?.sender?._id === user._id
      ? "You"
      : (lastMessage?.sender?.username ?? "Unknown User");
  const preview = !lastMessage
    ? "No messages yet"
    : conv.type === "group"
      ? `${senderName}: ${lastMessage.body}`
      : lastMessage.body;

  return (
    <li
      className="
        flex items-center gap-3
        p-4 sm:p-3 md:p-4 rounded-lg shadow cursor-pointer
        transition-all duration-200
        bg-base-200 hover:bg-base-300
      "
      onClick={() => onSelect(conv._id)}
    >
      {conv.type === "dm" ? (
        <Avatar
          name={otherUsers[0]?.username ?? "?"}
          src={otherUsers[0]?.avatar}
          online={dmPartnerOnline}
        />
      ) : (
        <Avatar
          name={conv.groupName || "Unnamed Group"}
          src={conv.groupAvatar}
          isGroup
        />
      )}

      <div className="flex flex-col overflow-hidden">
        <div className="font-medium truncate">
          {conv.type === "group"
            ? conv.groupName || "Unnamed Group"
            : otherUsers.length > 0
              ? otherUsers.map((p) => p.username).join(", ")
              : "No participants"}
        </div>
        <div className="text-sm text-base-content/70 truncate">{preview}</div>
      </div>
    </li>
  );
};

export default ConversationTile;
