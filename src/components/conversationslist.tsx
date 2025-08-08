import React from "react";
import useConversations from "../hooks/useConversations";

const ConversationsList: React.FC = () => {
  const { conversations, loading, error } = useConversations();

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Conversations</h2>
      {conversations.length === 0 ? (
        <div>No conversations found.</div>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li key={conv._id} className="p-4 rounded-md shadow bg-gray-100">
              <div className="font-medium">
                {conv.type === "group"
                  ? conv.groupName || "Unnamed Group"
                  : conv.participants
                      .filter((p) => p._id !== "CURRENT_USER_ID") // replace with auth ID
                      .map((p) => p.username)
                      .join(", ")}
              </div>
              <div className="text-sm text-gray-600">
                {conv.messages?.length > 0
                  ? conv.messages[conv.messages.length - 1]?.body ||
                    "No message text"
                  : "No messages yet"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationsList;
