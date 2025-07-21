import React from "react";
import type { User } from "../../types/user";

type UsersListViewProps = {
  users: User[];
  onUserClick?: (user: User) => void;
};

const UserTile: React.FC<{ user: User; onClick?: () => void }> = ({
  user,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      cursor: onClick ? "pointer" : "default",
      borderBottom: "1px solid #eee",
    }}
  >
    <img
      src={
        user.avatarUrl ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
      }
      alt={user.name}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        marginRight: 12,
        objectFit: "cover",
        background: "#f0f0f0",
      }}
    />
    <span style={{ fontSize: 16 }}>{user.name}</span>
  </div>
);

const UsersListView: React.FC<UsersListViewProps> = ({
  users,
  onUserClick,
}) => (
  <div
    className="w-full"
    style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}
  >
    {users.map((user) => (
      <UserTile
        key={user.id}
        user={user}
        onClick={onUserClick ? () => onUserClick(user) : undefined}
      />
    ))}
    {users.length === 0 && (
      <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
        No users found.
      </div>
    )}
  </div>
);

export default UsersListView;
