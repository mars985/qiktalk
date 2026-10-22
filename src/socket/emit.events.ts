import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";

export type ServerResponse<T = unknown> =
  | { success: true; statusCode: number; data: T; message: string }
  | { success: false; statusCode: number; message: string; errors: unknown[] };

export type SocketCallback<T = unknown> = (response: ServerResponse<T>) => void;

export interface EmitEvents {
  createGroup: (
    data: { participantIds: string[]; groupName: string },
    callback?: SocketCallback<Conversation>,
  ) => void;

  createDM: (
    data: { targetUserId: string },
    callback?: SocketCallback<Conversation>,
  ) => void;

  joinConversation: (conversationId: string, callback?: SocketCallback) => void;

  sendMessage: (
    data: { conversationId: string; message: string },
    callback?: SocketCallback<Message>,
  ) => void;

  "presence:request": () => void;
}
