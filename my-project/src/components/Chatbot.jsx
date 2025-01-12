import React, { useState } from "react";
import ChatArea from "./ChatArea";
import InputArea from "./InputArea";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (input) => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Fetch bot response
    try {
      const response = await fetch("https://api.example.com/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_GEMINI_API_KEY`, // Replace with your API key
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white text-center py-4 text-xl font-bold">
        ChatGPT-like Bot
      </header>
      <ChatArea messages={messages} />
      <InputArea onSend={handleSend} />
    </div>
  );
}
