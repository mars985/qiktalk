import { useSocketEvent } from "./useSocketEvent";
import type { ListenEvents } from "./listen.events";

interface ConversationSocketCallbacks {
  onNewGroup?: ListenEvents["newGroup"];
  onNewMessage?: ListenEvents["newMessage"];
  onConversationUpdated?: ListenEvents["conversationUpdated"];
}

export const useConversationSockets = ({
  onNewGroup,
  onNewMessage,
  onConversationUpdated,
}: ConversationSocketCallbacks) => {
  useSocketEvent("newGroup", onNewGroup);
  useSocketEvent("newMessage", onNewMessage);
  useSocketEvent("conversationUpdated", onConversationUpdated);
};
