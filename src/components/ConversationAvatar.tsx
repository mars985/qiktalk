import React from "react";
import type { User } from "@/types/user";

interface ConversationAvatarProps {
  type: "dm" | "group";
  otherUsers: User[];
  /** Presence dot for DMs: true = online, false = offline, undefined = hidden. */
  online?: boolean;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({
  type,
  otherUsers,
  online,
}) => {
  if (type === "group") {
    return (
      <div className="avatar-group -space-x-4">
        {otherUsers.slice(0, 3).map((u) => (
          <div key={u._id} className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {u.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        ))}

        {otherUsers.length > 3 && (
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12 flex items-center justify-center">
              <span className="text-lg font-semibold">
                +{otherUsers.length - 3}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DM case
  if (type === "dm" && otherUsers.length > 0) {
    const user = otherUsers[0];
    return (
      <div className="avatar avatar-placeholder relative">
        <div className="bg-neutral text-neutral-content w-12 rounded-full flex items-center justify-center">
          <span className="text-xl">
            {user.username.charAt(0).toUpperCase()}
          </span>
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
