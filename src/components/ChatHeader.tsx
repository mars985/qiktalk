import { useEffect, useState } from "react";

import ConversationAvatar from "./ConversationAvatar";

import api from "@/lib/axios";
import useUser from "@/hooks/useUser";
import type { User } from "@/types/user";

interface Conversation {
  _id: string;
  type: "dm" | "group";
  groupName: string | null;
  participants: User[];
}

const ChatHeader: React.FC<{ conversationId: string | null }> = ({
  conversationId,
}) => {
  const { user } = useUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/${conversationId}`);
        setConversation(res.data.data);
      } catch (err) {
        console.error("Failed to fetch conversation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  const otherUsers =
    conversation?.participants.filter((u) => u._id !== user?._id) ?? [];

  return (
    <div className="flex flex-row items-center px-4 gap-3 h-16 w-full border-b border-base-300">
      {loading ? (
        <span className="text-base-content/60">Loading...</span>
      ) : conversation ? (
        <>
          <ConversationAvatar
            type={conversation.type}
            otherUsers={otherUsers}
          />

          {conversation.type === "group" ? (
            <div className="flex flex-col justify-center">
              <span className="font-semibold">
                {otherUsers.map((u) => u.username).join(", ")}
              </span>
              <span className="text-sm text-base-content/60">Group chat</span>
            </div>
          ) : conversation.type === "dm" ? (
            <div className="flex flex-col justify-center">
              <span className="font-medium">{otherUsers[0]?.username}</span>
              <span className="text-sm text-base-content/60">
                last seen yesterday
              </span>
            </div>
          ) : (
            <span className="text-base-content/60">No users</span>
          )}
        </>
      ) : (
        <span className="text-base-content/60">No conversation</span>
      )}
    </div>
  );
};

export default ChatHeader;
