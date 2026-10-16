import socket from "@/lib/socket";

export interface ServerResponse {
    success: boolean;
    data?: any;
    message?: string;
    errors?: any;
};

export type SocketCallback = (response: ServerResponse) => void;

export const conversationEmitters = {
    createGroup: (
        data: {
            participantIds: string[];
            groupName: string;
        },
        callback?: SocketCallback
    ) => {
        socket.emit("createGroup", data, callback);
    },

    createDM: (targetUserId: string, callback?: SocketCallback) => {
        socket.emit("createDM", { targetUserId }, callback)
    },

    joinConversation: (conversationId: string, callback?: SocketCallback) => {
        socket.emit("joinConversation", conversationId, callback);
    },

    sendMessage: (data: {
        conversationId: string;
        message: string;
    },
        callback?: SocketCallback
    ) => {
        socket.emit("sendMessage", data, callback);
    },
};