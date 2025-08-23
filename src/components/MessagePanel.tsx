import React, { useEffect, useRef, useState } from "react";
import MessageTile from "./MessageTile";
import MessageBox from "./MessageBox";
import DateDivider from "./DateDivider";

import useUser from "@/hooks/useUser";
import type { Message } from "@/types/message";
import api from "@/lib/axios";
import socket from "@/lib/socket";

// --- helpers ---
function getTimestampFromObjectId(objectId: string) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

function formatDate(objectId: string) {
  return getTimestampFromObjectId(objectId).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --- component ---
const MessagePanel: React.FC<{ conversationId: string | null }> = ({
  conversationId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // join + listen for new messages
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinConversation", conversationId);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  // fetch conversation history
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(res.data.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    })();
  }, [conversationId]);

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // --- rendering ---
  const renderMessages = () => {
    if (!messages.length)
      return (
        <div className="text-center text-gray-500 py-6">No messages found.</div>
      );

    let lastDate: string | null = null;

    return messages.map((message, idx) => {
      const messageDate = formatDate(message._id);
      const showDate = lastDate !== messageDate;
      const isOwn = user?._id === message.sender._id;
      lastDate = messageDate;

      return (
        <React.Fragment key={message._id}>
          {showDate && <DateDivider date={messageDate} />}

          <div
            data-date={messageDate}
            className={`message-wrapper flex ${
              isOwn ? "justify-end" : "justify-start"
            } ${idx === messages.length - 1 ? "pb-6" : ""}`}
          >
            <MessageTile message={message} isOwn={isOwn} />
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col relative">
      <div
        ref={containerRef}
        className="messages-list h-[80vh] overflow-y-auto px-4 flex flex-col gap-2"
      >
        {renderMessages()}
      </div>

      <MessageBox conversationId={conversationId} />
    </div>
  );
};

export default MessagePanel;
