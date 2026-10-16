import React from "react";
import { useNavigate } from "react-router-dom";

import useConversations from "@/hooks/useConversations";
import useUser from "@/hooks/useUser";

import ConversationTile from "./ConversationTile";
import { useConversationSockets } from "@/socket/useConversationSocket";

const ConversationsList: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const { conversations, loading, error, fetchConversations } =
    useConversations();
  const { user } = useUser();
  const navigate = useNavigate();

  useConversationSockets({
    onNewGroup: fetchConversations,
    onNewMessage: fetchConversations,
  });

  if (user === null) {
    navigate("/login");
    return null;
  }
  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredConversations = conversations.filter((conv) => {
    if (conv.type === "dm" && (!conv.messages || conv.messages.length === 0)) {
      return false;
    }
    return true;
  });

  if (filteredConversations.length === 0) {
    return <div>No conversations found.</div>;
  }

  return (
    <ul
      className="space-y-2"
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      {filteredConversations.map((conv) => (
        <ConversationTile
          key={conv._id}
          conv={conv}
          user={user}
          onSelect={setConversationId}
        />
      ))}
    </ul>
  );
};

export default ConversationsList;
