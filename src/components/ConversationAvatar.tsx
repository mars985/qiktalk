import React from "react";
import type { User } from "@/types/user";

interface ConversationAvatarProps {
  type: "dm" | "group";
  otherUsers: User[];
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({
  type,
  otherUsers,
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
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full flex items-center justify-center">
          <span className="text-xl">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default ConversationAvatar;
