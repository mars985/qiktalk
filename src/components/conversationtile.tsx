import React from "react";
import type { User } from "@/types/user";

const ConversationTile: React.FC<{ user: User; onClick?: () => void }> = ({
  user,
  onClick,
}) => (
  <div
    className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer transition"
    onClick={onClick}
  >
    <img
      src={
        user.avatarUrl ||
        "https://ui-avatars.com/api/?username=" + encodeURIComponent(user.username)
      }
      alt={user.username}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        marginRight: 12,
        objectFit: "cover",
        background: "#f0f0f0",
      }}
    />
    <div>
      <div className="font-medium">{user.username}</div>
      {user.username && <div className="text-sm text-gray-500">{user.username}</div>}
    </div>
  </div>
);

export default ConversationTile;
