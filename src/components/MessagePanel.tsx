import React, { useEffect, useRef, useState } from "react";
import MessageTile from "./MessageTile";
import MessageBox from "./MessageBox";

import useUser from "@/hooks/useUser";
import type { Message } from "@/types/message";
import api from "@/lib/axios";
import socket from "@/lib/socket";

const MessagePanel: React.FC<{
  conversationId: string | null;
}> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if(!conversationId) return;
    
    socket.emit("joinConversation", conversationId);

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("newMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(res.data.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="messages-list h-[80vh] overflow-y-auto px-4 flex flex-col-reverse gap-2"
        style={
          {
            // marginBottom: "2px",
            // backgroundColor: "red",
          }
        }
      >
        {(messages ?? []).length > 0 ? (
          [...messages].reverse().map((message) => {
            const isOwn = user ? message.sender._id === user._id : false;
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <MessageTile message={message} isOwn={isOwn} />
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-6">
            No messages found.
            <h1>{conversationId ? conversationId : "no conversation id"}</h1>
          </div>
        )}
      </div>
      <MessageBox conversationId={conversationId} />
    </div>
  );
};

export default MessagePanel;

// TODO: add padding to bottom most message, beautify message box
