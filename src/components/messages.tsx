import React, { useEffect, useRef } from "react";
import MessageTile from "./messagetile";
import MessageBox from "./messagebox";

import useUser from "@/hooks/useUser";
import type { Message } from "@/types/message";

const Messages: React.FC<{
  messages: Message[];
  conversationId: string | null;
}> = ({ messages, conversationId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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
          const isOwn = user ? message.sender._id === user._id : false;
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
            <h1>{conversationId ? conversationId : "no conversation id"}</h1>
          </div>
        )}
      </div>
      <MessageBox conversationId={conversationId} />
    </div>
  );
};

export default Messages;
