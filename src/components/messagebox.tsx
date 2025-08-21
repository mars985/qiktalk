import React, { useRef, useState } from "react";
import api from "@/lib/axios";
import useUser from "@/hooks/useUser";

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
      const maxHeight = 5 * 24;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) {
      console.log("trimmed");
      return;
    }

    try {
      if (!text.replace(/\s/g, "").length) return;
      const res = await api.post("/sendMessage", {
        conversationId,
        senderId: user?._id,
      });

      console.log("Message sent:", res.data);
      setText("");
      handleInput();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="messagebox flex justify-center"
      style={{
        padding: "12px",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <textarea
        className="bg-zinc-200 dark:bg-zinc-800"
        ref={textareaRef}
        name="sendMessage"
        placeholder="Type here"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          outline: "none",
          width: "80%",
          padding: "12px",
          // background: "#374151",
          borderRadius: "8px",
          resize: "none",
          wordBreak: "break-word",
          lineHeight: "1.5",
          overflow: "hidden",
          minHeight: "72px", // 3 rows * ~24px
          maxHeight: "120px", // 5 rows * ~24px
        }}
      ></textarea>
    </div>
  );
};

export default MessageBox;
