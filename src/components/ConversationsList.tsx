import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useConversations from "@/hooks/useConversations";
import useUser from "@/hooks/useUser";

import socket from "@/lib/socket";

import ConversationTile from "./ConversationTile";

const ConversationsList: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const { conversations, loading, error, refetchConversations } =
    useConversations();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const refetch = () => {
      refetchConversations();
    };

    socket.on("newMessage", refetch);
    socket.on("newGroup", refetch);

    return () => {
      socket.off("newMessage", refetch);
      socket.off("newGroup", refetch);
    };
  }, [refetchConversations]);

  if (user === null) {
    navigate("/login");
    return null;
  }
  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredConversations = conversations.filter((conv) => {
    if (!conv.messages?.length && conv.type=="dm") return false;
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
        />
      ))}
    </ul>
  );
};

export default ConversationsList;
