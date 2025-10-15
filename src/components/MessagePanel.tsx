import React, { useEffect, useRef, useState } from "react";

import MessageTile from "./MessageTile";
import MessageBox from "./MessageBox";
import DateDivider from "./DateDivider";
import ChatHeader from "./ChatHeader";

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

  // listen for new messages
  useEffect(() => {
    if (!conversationId) return;
    
    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  // initial fetch
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(res.data.data);

        requestAnimationFrame(() => {
          containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "auto",
          });
        });
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // scroll to bottom on new message
  useEffect(() => {
    if (!messages.length) return;

    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const renderMessages = () => {
    if (!messages.length)
      return (
        <div className="text-center text-base-content/60 py-6">No messages found.</div>
      );

    // newest -> oldest (so first DOM child is the newest)
    const reversed = [...messages].reverse();

    return reversed.map((message, idx) => {
      const messageDate = formatDate(message._id);
      const isOwn = user?._id === message.sender._id;

      // in reversed order, the "next" item is older
      const next = reversed[idx + 1];
      const nextDate = next ? formatDate(next._id) : null;

      // render the divider AFTER the last message of this date
      const showDividerAfter = messageDate !== nextDate;

      return (
        <React.Fragment key={message._id}>
          <div
            data-date={messageDate}
            className={`message-wrapper flex ${
              isOwn ? "justify-end" : "justify-start"
            } ${idx === 0 ? "pb-6" : ""}`} // bottom padding for the very bottom-most (newest) item
          >
            <MessageTile message={message} isOwn={isOwn} />
          </div>

          {showDividerAfter && <DateDivider date={messageDate} />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col relative">
      <ChatHeader conversationId={conversationId} />
      <div
        ref={containerRef}
        className="h-[80vh] overflow-y-auto px-4 flex flex-col-reverse gap-2"
      >
        {renderMessages()}
      </div>

      <MessageBox conversationId={conversationId} />
    </div>
  );
};

export default MessagePanel;
