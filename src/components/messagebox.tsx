import React, { useRef } from "react";

const MessageBox: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset to auto to shrink if needed
      const maxHeight = 5 * 24; // Approx. 5 rows (24px line height)
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  return (
    <div
      className="messagebox flex justify-center"
      style={{
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <textarea
        ref={textareaRef}
        name="sendMessage"
        placeholder="Type here"
        rows={3}
        className="text-white"
        onInput={handleInput}
        style={{
          outline: "none",
          width: "100%",
          padding: "12px",
          background: "#374151",
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
