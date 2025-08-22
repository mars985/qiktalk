import React from "react";
import useConversations from "../hooks/useConversations";
import useUser from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";

// Define conversation item style recipe
const conversationItem = tv({
  base: `
    p-4 rounded-md shadow cursor-pointer 
    transition-all duration-200 sm:p-3 md:p-4
  `,
  variants: {
    theme: {
      light: "bg-gray-100 hover:bg-gray-200",
      dark: "dark:bg-gray-800 dark:hover:bg-gray-700",
    },
    active: {
      true: "ring-2 ring-blue-500", // optional: highlight active conversation
      false: "",
    },
  },
  defaultVariants: {
    theme: "light",
    active: false,
  },
});

const ConversationsList: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const { conversations, loading, error } = useConversations();
  const { user } = useUser();
  const navigate = useNavigate();

  if (user === null) {
    navigate("/login");
    return null;
  }
  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredConversations = conversations.filter((conv) => {
    if (!conv.messages?.length) return false;
    return (
      conv.type === "group" || conv.participants.some((p) => p._id !== user._id)
    );
  });

  if (filteredConversations.length === 0) {
    return <div>No conversations found.</div>;
  }

  return (
    <ul className="space-y-2" style={{
      width:"95%",
      margin:"0 auto"
    }}>
      {filteredConversations.map((conv) => {
        const lastMessage = conv.messages.at(-1);
        const participants = conv.participants
          .filter((p) => p._id !== user._id)
          .map((p) => p.username);

        return (
          <li
            key={conv._id}
            className={conversationItem({ theme: "dark" })}
            // 👆 you can switch theme: "light" | "dark"
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
};

export default ConversationsList;
