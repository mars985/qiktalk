import React, { useEffect, useRef } from "react";
import MessageTile from "./messagetile";
import MessageBox from "./messagebox";
import type { Message } from "../../types/message";

interface MessagesProps {
  messages: Message[];
}

const thisUser = "1"; // Replace with actual logic to get current user ID

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div
        ref={containerRef}
        className="messages-list h-[80vh] overflow-y-auto px-4 mt-4 flex flex-col-reverse gap-2"
      >
        {[...messages].reverse().map((message) => {
          const isOwn = message.sender === thisUser;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <MessageTile message={message} isOwn={isOwn} />
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No messages found.
          </div>
        )}
      </div>
      <MessageBox />
    </div>
  );
};

export default Messages;
