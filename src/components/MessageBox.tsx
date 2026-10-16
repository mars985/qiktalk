import React, { useRef, useState } from "react";

import useUser from "@/hooks/useUser";
import { conversationEmitters } from "@/socket/conversation.socket";

const MessageBox: React.FC<{ conversationId: string | null }> = ({
  conversationId,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const { user } = useUser();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversationId || !user) return;

    conversationEmitters.sendMessage(
      {
        message: text,
        conversationId,
      },
      (response) => {
        if (!response.success) {
          console.error(response.message, response.errors);
        } else {
          // TODO: push new message to existing cached conversation instead of refetching all conversations
        }
      },
    );

    setText("");
  };

  return (
    <div className="border-t border-base-300 flex flex-row items-center gap-2 p-3">
      <textarea
        ref={textareaRef}
        name="sendMessage"
        placeholder="Type a message..."
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: "90%",
          lineHeight: "1.5",
          overflow: "hidden",
        }}
        className="
          outline-none
          bg-base-200
          text-base-content
          placeholder:text-base-content/50
          rounded-lg
          text-sm
          p-3
          resize-none
        "
      />
      <button
        className="btn btn-outline btn-primary"
        disabled={text.trim() ? false : true}
      >
        Send
      </button>
    </div>
  );
};

export default MessageBox;
