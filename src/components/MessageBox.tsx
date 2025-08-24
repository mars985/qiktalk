import React, { useRef, useState } from "react";

import { Button } from "./ui/button";

import useUser from "@/hooks/useUser";
import socket from "@/lib/socket";

const MessageBox: React.FC<{ conversationId: string | null }> = ({
  conversationId,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const { user } = useUser();

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 5 * 24; // up to 5 rows
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversationId || !user) return;

    try {
      if (!text.replace(/\s/g, "").length) return;
      socket.emit("sendMessage", {
        message: text,
        conversationId,
        senderId: user._id,
      });

      setText("");
      handleInput();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div
      className="border-t border-gray-200 dark:border-neutral-700"
      style={{
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        gap: "8px",
        padding: "12px",
        justifyContent:"center"
      }}
    >
      <textarea
        ref={textareaRef}
        name="sendMessage"
        placeholder="Type a message..."
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          width: "90%",
          minHeight: "72px",
          maxHeight: "120px",
          padding: "12px",
          resize: "none",
          lineHeight: "1.5",
          overflow: "hidden",
        }}
        className="
          outline-none
          bg-gray-100 dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          rounded-md
          text-sm
        "
      />
      <Button variant={text.trim() ? "default" : "ghost"} onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default MessageBox;
