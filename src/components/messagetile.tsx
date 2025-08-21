import React from "react";
import type { Message } from "../types/message";

const MessageTile: React.FC<{ message: Message; isOwn: boolean }> = ({
  message,
  isOwn,
}) => (
  <div
    className={`${
      isOwn
        ? "bg-[#dcf8c6] dark:bg-[#056162]"
        : "bg-[#f1f0f0] dark:bg-[#262d31]"
    } text-black dark:text-gray-200 
    border-b border-[#eee] dark:border-[#1f1f1f]
    shadow-[0_2px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}
    style={{
      padding: "8px 12px",
      display: "flex",
      flexDirection: "column",
      maxWidth: "75%",
      borderRadius: "12px",
      wordBreak: "break-word",
      alignItems: isOwn ? "flex-end" : "flex-start",
      whiteSpace: "pre-wrap",
      // fontFamily: "monospace",
    }}
  >
    {isOwn ? (
      <span className="text-xs text-[#555] dark:text-gray-400">You</span>
    ) : (
      <span className="text-sm text-[#555] dark:text-gray-400">
        {message.sender.username}
      </span>
    )}
    <span className="text-base">{message.body}</span>
  </div>
);

export default MessageTile;
