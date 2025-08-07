import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Conversation } from "../types/conversation";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/getConversations")
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load conversations");
        setLoading(false);
      });
  }, []);

  return { conversations, loading, error };
}

export default useConversations;
