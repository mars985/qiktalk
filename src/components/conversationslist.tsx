import React from "react";
import useConversations from "../hooks/useConversations";
import useUser from "@/hooks/useUser";

const ConversationsList: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const { conversations, loading, error } = useConversations();
  const { user } = useUser();

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Conversations</h2>
      {conversations.length === 0 ? (
        <div>No conversations found.</div>
      ) : (
        <ul className="space-y-2">
          {user &&
            conversations
              .filter((conv) =>
                conv.type === "group"
                  ? true
                  : conv.participants.some((p) => p._id !== user._id)
              )
              .map((conv) => (
                <li
                  key={conv._id}
                  className="
                    p-4 rounded-md shadow 
                    bg-gray-100 dark:bg-gray-800 
                    cursor-pointer 
                    hover:bg-gray-200 dark:hover:bg-gray-700 
                    hover:shadow-md 
                    transition-all duration-200 
                    sm:p-3 md:p-4
                  "
                  onClick={() => setConversationId(conv._id)}
                >
                  <div className="font-medium">
                    {conv.type === "group"
                      ? conv.groupName || "Unnamed Group"
                      : conv.participants
                          .filter((p) => p._id !== user._id)
                          .map((p) => p.username)
                          .join(", ") || "Unnamed"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
