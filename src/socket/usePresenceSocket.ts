import { useSocketEvent } from "./useSocketEvent";
import type { ListenEvents } from "./listen.events";

interface PresenceSocketCallbacks {
  onSnapshot?: ListenEvents["presence:snapshot"];
  onUpdate?: ListenEvents["presence:update"];
}

export const usePresenceSockets = ({
  onSnapshot,
  onUpdate,
}: PresenceSocketCallbacks) => {
  useSocketEvent("presence:snapshot", onSnapshot);
  useSocketEvent("presence:update", onUpdate);
};
