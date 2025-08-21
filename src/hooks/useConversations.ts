import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Conversation } from "@/types/conversation";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/getConversations")
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
  }, []);

  return { conversations, loading, error };
}

export default useConversations;
