import React from "react";

export default function ChatArea({ messages }) {
  return (
    <div className="flex-grow p-4 overflow-y-auto space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-xs ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}
