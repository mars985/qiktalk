import socket from "@/lib/socket";
import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { SocketCallback } from "./emit.events";

export type { ServerResponse, SocketCallback } from "./emit.events";

export const conversationEmitters = {
  createGroup: (
    data: {
      participantIds: string[];
      groupName: string;
    },
    callback?: SocketCallback<Conversation>,
  ) => {
    socket.emit("createGroup", data, callback);
  },

  createDM: (targetUserId: string, callback?: SocketCallback<Conversation>) => {
    socket.emit("createDM", { targetUserId }, callback);
  },

  joinConversation: (conversationId: string, callback?: SocketCallback) => {
    socket.emit("joinConversation", conversationId, callback);
  },

  sendMessage: (
    data: {
      conversationId: string;
      message: string;
    },
    callback?: SocketCallback<Message>,
  ) => {
    socket.emit("sendMessage", data, callback);
  },
};
