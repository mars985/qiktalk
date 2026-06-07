import { useEffect, useMemo, useState } from "react";

import ConversationAvatar from "./ConversationAvatar";

import api from "@/lib/axios";
import useUser from "@/hooks/useUser";
import usePresence from "@/hooks/usePresence";
import type { Conversation } from "@/types/conversation";
import type { PresenceInfo } from "@/contexts/PresenceContext";

import { ChevronLeft } from "lucide-react";

// Human-friendly "last seen" string for an offline user.
function formatLastSeen(value: string | null): string {
  if (!value) return "Offline";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "Offline";

  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return "last seen just now";
  if (diffMins < 60) return `last seen ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  return `last seen ${date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

const ChatHeader: React.FC<{
  conversationId: string | null;
  onBack?: () => void;
}> = ({ conversationId, onBack }) => {
  const { user } = useUser();
  const { getStatus } = usePresence();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  // Authoritative status fetched once when the conversation opens; live socket
  // updates from the presence context take precedence over it.
  const [seedStatus, setSeedStatus] = useState<PresenceInfo | null>(null);

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

  const partner = conversation?.type === "dm" ? otherUsers[0] : undefined;

  // Seed the DM partner's status from the API when the conversation opens.
  useEffect(() => {
    if (!partner?._id) {
      setSeedStatus(null);
      return;
    }

    let cancelled = false;
    api
      .get(`/getOnlineStatus/${partner._id}`)
      .then((res) => {
        if (!cancelled && res.data.success) setSeedStatus(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch online status:", err));

    return () => {
      cancelled = true;
    };
  }, [partner?._id]);

  // Live presence wins over the initial seed.
  const status = getStatus(partner?._id) ?? seedStatus;
  const isOnline = status?.online ?? false;
  const statusText = status
    ? status.online
      ? "Online"
      : formatLastSeen(status.lastSeen)
    : "…";

  // Render functions
  const renderGroupHeader = () => (
    <div className="flex flex-col justify-center min-w-0">
      <span className="font-semibold truncate">{conversation?.groupName}</span>
      <span className="text-sm text-base-content/60 truncate">
        {otherUsers.map((u) => u.username).join(", ") + ", You"}
      </span>
    </div>
  );

  const renderDMHeader = () => (
    <div className="flex flex-col justify-center min-w-0">
      <span className="font-medium text-base truncate">
        {partner?.username || "Unknown User"}
      </span>
      <span
        className={`flex items-center gap-1.5 text-xs ${
          isOnline ? "text-success" : "text-base-content/60"
        }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            isOnline ? "bg-success" : "bg-base-content/30"
          }`}
        />
        {statusText}
      </span>
    </div>
  );

  return (
    <div className="flex flex-row items-center px-4 gap-3 h-16 w-full border-b border-base-300">
      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 hover:bg-base-300 rounded-full transition-colors"
          aria-label="Back to conversations"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {loading ? (
        <span className="text-base-content/60">Loading...</span>
      ) : conversation ? (
        <>
          <ConversationAvatar
            type={conversation.type}
            otherUsers={otherUsers}
            online={conversation.type === "dm" ? isOnline : undefined}
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
