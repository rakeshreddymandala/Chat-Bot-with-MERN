const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// Route to save a chat message
router.post('/save-message', async (req, res) => {
    try {
        const { userMessage, botResponse } = req.body;
        const newMessage = new ChatMessage({ userMessage, botResponse });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message saved successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to retrieve all chat messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: -1 }); // Get messages in descending order
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
