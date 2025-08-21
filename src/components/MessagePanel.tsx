import React, { useEffect, useRef } from "react";
import MessageTile from "./MessageTile";
import MessageBox from "./MessageBox";

import useUser from "@/hooks/useUser";
import type { Message } from "@/types/message";

const MessagePanel: React.FC<{
  messages: Message[];
  conversationId: string | null;
}> = ({ messages, conversationId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

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
                key={message._id} // use _id instead of id if that’s what your backend sends
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
