import React, { useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Chat messages
  const [userMessage, setUserMessage] = useState(""); // Current user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error messages

  const handleSend = async () => {
    if (!userMessage.trim()) {
      setError("Please type a message.");
      return;
    }

    setError(""); // Clear previous errors
    setIsLoading(true);

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
        const genAI = new GoogleGenerativeAI("AIzaSyCFVbuqVM4uAGlPZK3Bvn6pnD7xHneLqqU");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = userMessage;

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
      // Make a request to the backend (replace with your actual API endpoint)
      const response = await axios.post("http://localhost:5000/api/chat/save-message", {
        userMessage,
        botResponse: result.response.text(),
      });

      // Add the bot response to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: result.response.text() || "No response from the bot." },
      ]);
    } catch (err) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
      setUserMessage(""); // Clear input field
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white text-center py-4 text-xl font-bold">
        ChatGPT-like Bot
      </header>

      {/* Chat Area */}
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

      {/* Input Area */}
      <div className="p-4 flex items-center gap-4 bg-white border-t border-gray-300">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 border border-gray-300 rounded-md"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading ? "bg-gray-500" : "bg-blue-500"
          }`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
