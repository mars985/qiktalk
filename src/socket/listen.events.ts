import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";

export interface PresenceUpdate {
  userId: string;
  online: boolean;
  lastSeen?: string | null;
}

export interface ListenEvents {
  newMessage: (data: { message: Message; conversationId: string }) => void;

  newGroup: (conversation: Conversation) => void;

  conversationUpdated: (data: {
    conversationId: string;
    groupAvatar: string | null;
  }) => void;

  "presence:snapshot": (onlineUserIds: string[]) => void;

  "presence:update": (update: PresenceUpdate) => void;
}

export type ListenEvent = keyof ListenEvents;
