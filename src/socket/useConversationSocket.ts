import { useSocketEvent } from "./useSocketEvent";
import type { ListenEvents } from "./listen.events";

interface ConversationSocketCallbacks {
  onNewGroup?: ListenEvents["newGroup"];
  onNewMessage?: ListenEvents["newMessage"];
}

export const useConversationSockets = ({
  onNewGroup,
  onNewMessage,
}: ConversationSocketCallbacks) => {
  useSocketEvent("newGroup", onNewGroup);
  useSocketEvent("newMessage", onNewMessage);
};
