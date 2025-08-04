import React from "react";
import type { Message } from "../types/message";

const MessageTile: React.FC<{ message: Message; isOwn: boolean }> = ({
  message,
  isOwn,
}) => (
  <div
    style={{
      padding: "8px 12px",
      borderBottom: "1px solid #eee",
      display: "flex",
      flexDirection: "column",
      background: isOwn ? "#dcf8c6" : "#f1f0f0", // WhatsApp-style colors
      maxWidth: "75%",
      borderRadius: "12px",
      boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
      wordBreak: "break-word",
      alignItems: isOwn ? "flex-end" : "flex-start",
    }}
  >
    {isOwn ? (
      <span style={{ fontSize: 12, color: "#555" }}>You</span>
    ) : (
      <span style={{ fontSize: 14, color: "#555" }}>{message.sender}</span>
    )}
    <span style={{ fontSize: 16 }}>{message.body}</span>
  </div>
);

export default MessageTile;
