import { useEffect, useMemo, useState } from "react";

import ConversationAvatar from "./ConversationAvatar";

import api from "@/lib/axios";
import useUser from "@/hooks/useUser";
import type { Conversation } from "@/types/conversation";

const ChatHeader: React.FC<{ conversationId: string | null }> = ({
  conversationId,
}) => {
  const { user } = useUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<string | null>(null);

  // Fetch conversation details
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

  // Determine other users in the conversation
  const otherUsers = useMemo(() => {
    return conversation?.participants.filter((u) => u._id !== user?._id) ?? [];
  }, [conversation, user?._id]);

  // Fetch online status for DM conversations
  // Fetch online status for DM conversations
  useEffect(() => {
    if (conversation?.type !== "dm" || otherUsers.length === 0) return;

    const formatLastSeen = (timestamp: string) => {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "unknown";

      // "1970..." means user is online (epoch)
      if (timestamp === "1970-01-01T00:00:00.000Z") return "online";

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

      // If older than a day, show date and time
      return `on ${date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`;
    };

    const fetchOnlineStatus = async () => {
      try {
        const res = await api.get(`/getOnlineStatus/${otherUsers[0]._id}`);
        if (res.data.success) {
          const timestamp = res.data.data;
          const status = formatLastSeen(timestamp);
          setOnlineStatus(status);
        } else {
          setOnlineStatus("unknown");
        }
      } catch (err) {
        console.error("Failed to fetch online status:", err);
        setOnlineStatus("unknown");
      }
    };

    fetchOnlineStatus();
  }, [conversation, otherUsers]);

  // Render functions
  const renderGroupHeader = () => (
    <div className="flex flex-col justify-center">
      <span className="font-semibold">{conversation?.groupName}</span>
      <span className="text-sm text-base-content/60">
        {otherUsers.map((u) => u.username).join(", ") + ", You"}
      </span>
    </div>
  );

  const renderDMHeader = () => (
    <div className="flex flex-col justify-center">
      <span className="font-medium text-base">
        {otherUsers[0]?.username || "Unknown User"}
      </span>
      <span
        className={`text-sm ${
          onlineStatus === "online" ? "text-success" : "text-base-content/60"
        }`}
      >
        {onlineStatus || "loading..."}
      </span>
    </div>
  );

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
            renderGroupHeader()
          ) : conversation.type === "dm" ? (
            renderDMHeader()
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
