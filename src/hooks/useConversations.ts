import { useEffect, useState } from "react";
import type { Conversation } from "@/types/conversation";
import { ConversationRequest } from "@/api/conversation.api";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    ConversationRequest.getConversations()
      .then((res) => {
        if (res.data.success) {
          setConversations(res.data.data);
          setLoading(false);
        } else throw new Error();
      })
      .catch((err) => {
        setError(err.message || "Failed to load conversations");
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    setConversations,
    loading,
    error,
    fetchConversations,
  };
}

export default useConversations;
