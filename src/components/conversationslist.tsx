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
  // console.log(conversations);
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Conversations</h2>
      {conversations.length === 0 ? (
        <div>No conversations found.</div>
      ) : (
        <ul className="space-y-2">
          {user &&
            (() => {
              const filteredConversations = conversations.filter((conv) => {
                if (!conv.messages?.length) return false;
                return (
                  conv.type === "group" ||
                  conv.participants.some((p) => p._id !== user._id)
                );
              });

              if (filteredConversations.length === 0) {
                return <div>No conversations found.</div>;
              }

              return (
                <ul className="space-y-2">
                  {filteredConversations.map((conv) => {
                    const lastMessage = conv.messages.at(-1);
                    const participants = conv.participants
                      .filter((p) => p._id !== user._id)
                      .map((p) => p.username);

                    return (
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
                            : participants.length > 0
                            ? participants.join(", ")
                            : "No participants"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {lastMessage?.body || "No messages yet"}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
        </ul>
      )}
    </div>
  );
};

export default ConversationsList;
