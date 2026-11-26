import React from "react";
import type { User } from "@/types/user";

interface ConversationAvatarProps {
  otherUsers: User[];
  /** Presence dot for DMs: true = online, false = offline, undefined = hidden. */
  online?: boolean;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({
  otherUsers,
  online,
}) => {
  if (otherUsers.length > 0) {
    const user = otherUsers[0];
    return (
      <div className="avatar avatar-placeholder relative">
        <div className="bg-neutral text-neutral-content w-12 h-12 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="size-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {typeof online === "boolean" && (
          <span
            aria-label={online ? "online" : "offline"}
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-base-100 ${
              online ? "bg-success" : "bg-base-content/30"
            }`}
          />
        )}
      </div>
    );
  }

  return null;
};

export default ConversationAvatar;
