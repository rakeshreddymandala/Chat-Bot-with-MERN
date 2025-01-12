import React, { useState } from 'react';
import axios from 'axios';

const InputArea = () => {
    const [userMessage, setUserMessage] = useState(''); // Tracks user input
    const [chatHistory, setChatHistory] = useState([]); // Tracks chat conversation
    const [isLoading, setIsLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(''); // Tracks error messages

    const sendMessage = async () => {
        if (!userMessage.trim()) {
            setError('Please type a message.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // Define the default bot response for testing purposes
            const defaultBotResponse = 'This is a default response for testing purposes.';

            // Send the user message and default bot response to the backend
            const response = await axios.post('http://localhost:5000/api/chat/save-message', {
                userMessage,
                botResponse: defaultBotResponse, // Include the default bot response in the payload
            });

            // Use the bot response from the server if available, otherwise fall back to the default
            const botResponse = response.data.botResponse || defaultBotResponse;

            // Update chat history
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { user: userMessage, bot: botResponse },
            ]);

            setUserMessage(''); // Clear input
        } catch (err) {
            console.error('Error sending message:', err);

            // Display a default error response in the chat
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { user: userMessage, bot: 'Failed to send your message. Please try again later.' },
            ]);

            setError('Failed to send message. Please try again later.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ marginBottom: '20px' }}>
                {chatHistory.map((chat, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <p>
                            <strong>User:</strong> {chat.user}
                        </p>
                        <p>
                            <strong>Bot:</strong> {chat.bot}
                        </p>
                    </div>
                ))}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message"
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    disabled={isLoading}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default InputArea;
