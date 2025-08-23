import React from "react";
import { useNavigate } from "react-router-dom";

import useConversations from "../hooks/useConversations";
import useUser from "@/hooks/useUser";

import ConversationTile from "./ConversationTile";

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
          theme="dark"
        />
      ))}
    </ul>
  );
};

export default ConversationsList;
