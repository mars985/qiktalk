import { useContext } from "react";
import { PresenceContext } from "@/contexts/PresenceContext";
import type { PresenceContextType } from "@/contexts/PresenceContext";

const usePresence = (): PresenceContextType => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
};

export default usePresence;
