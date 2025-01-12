import React, { useState } from 'react';
import axios from 'axios';

const InputArea = () => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const sendMessage = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/chat', { userMessage });
            const botResponse = response.data.botResponse;

            // Update chat history
            setChatHistory([...chatHistory, { user: userMessage, bot: botResponse }]);
            setUserMessage(''); // Clear input
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div>
            <div>
                {chatHistory.map((chat, index) => (
                    <div key={index}>
                        <p><strong>User:</strong> {chat.user}</p>
                        <p><strong>Bot:</strong> {chat.bot}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default InputArea;
