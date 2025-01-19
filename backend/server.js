const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const ChatMessage = require('./models/ChatMessage'); // Import the model
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Chatbot API!');
});


app.post('/api/chat/save-message', async (req, res) => {
    try {
        const { userMessage, botResponse } = req.body;

        // Validate input data
        if (!userMessage || !botResponse) {
            return res.status(400).json({ success: false, error: 'Both userMessage and botResponse are required.' });
        }

        // Save message to database
        const newMessage = new ChatMessage({ userMessage, botResponse });
        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message saved successfully!' });
    } catch (err) {
        console.error('Error saving message:', err); // Log error to terminal
        res.status(500).json({ success: false, error: err.message });
    }
});

// API Route to Retrieve Messages
app.get('/api/chat/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: -1 }); // Fetch messages in descending order
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
