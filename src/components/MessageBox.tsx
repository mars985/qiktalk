import React, { useRef, useState } from "react";
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
    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
      <div
        className="
          flex items-end gap-2 px-3 py-2 rounded-md shadow 
          bg-gray-100 dark:bg-gray-800
          focus-within:ring-2 focus-within:ring-blue-500
        "
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
          className="
            flex-1 resize-none outline-none bg-transparent
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            text-sm leading-relaxed
            max-h-32 min-h-[72px] overflow-hidden
          "
        />
      </div>
      {/* <button
        onClick={sendMessage}
        disabled={!text.trim()}
        className="
            w-16 h-[42px] flex items-center justify-center
            rounded-md text-sm font-medium transition-colors
            bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50
          "
      >
        Send
      </button> */}
    </div>
  );
};

export default MessageBox;
