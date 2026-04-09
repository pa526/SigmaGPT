import express from 'express';
import { Thread, User } from '../models/Thread.js';
import getOpenAPIResponse from '../utils/openai.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Helper to handle JWT verification consistently
const verifyToken = (authHeader) => {
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, "parthkhandelwal");
};

// --- Sarvam AI Speech-to-Text Route ---
router.post("/transcribe", upload.single('audio'), async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "No authorization header provided" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    try {
        console.log(req.file);
        // Verify user before spending API credits
        verifyToken(authHeader);

        // Prepare the form data for Sarvam AI
        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path));
        form.append('model', 'saaras:v3'); 
        form.append('language_code', 'en-IN'); 

        const sarvamResponse = await axios.post('https://api.sarvam.ai/speech-to-text', form, {
            headers: {
                ...form.getHeaders(),
                'api-subscription-key': process.env.SARVAM_API_KEY, 
            },
        });

        // Delete the temporary file
        fs.unlinkSync(req.file.path);

        res.json({ transcript: sarvamResponse.data.transcript });
    } catch (err) {
        // Cleanup file on error
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        console.error("Sarvam AI Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to transcribe audio" });
    }
});

// --- Chat & Thread Management ---

// Get all threads for the user
router.get("/thread", async (req, res) => {
    const authHeader = req.headers.authorization;
    try {
        const decoded = verifyToken(authHeader);
        if (!decoded) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ email: decoded.email });
        const sortedThreads = user.threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        res.json(sortedThreads);
    } catch (err) {
        res.status(500).json("failed to fetch threads");
    }
});

// Get specific thread history
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    const authHeader = req.headers.authorization;

    try {
        const decoded = verifyToken(authHeader);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(404).json({ error: "User not found" });
        let thread = user.threads.find(t => t.threadId === threadId);

        if (!thread) return res.status(404).json({ error: "Thread not found" });
        res.json(thread.messages);
    } catch (err) {
        res.status(500).json("failed to fetch thread");
    }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    const authHeader = req.headers.authorization;

    try {
        const decoded = verifyToken(authHeader);
        const user = await User.findOne({ email: decoded.email });

        const threadIndex = user.threads.findIndex(t => t.threadId === threadId);
        if (threadIndex === -1) return res.status(404).json({ error: "Thread not found" });

        user.threads.splice(threadIndex, 1);
        user.markModified('threads');
        await user.save();

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "failed to delete thread" });
    }
});

// OpenAI Chat Interaction
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    const authHeader = req.headers.authorization;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required field" });
    }

    try {
        const decoded = verifyToken(authHeader);
        let user = await User.findOne({ email: decoded.email });

        if (!user.threads) user.threads = [];
        let thread = user.threads.find(t => t.threadId === threadId);

        if (!thread) {
            const newThread = {
                threadId,
                title: message.substring(0, 30) + "...", // Better title preview
                messages: [{ role: "user", content: message }]
            };
            user.threads.push(newThread);
            thread = user.threads[user.threads.length - 1];
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Get Response from OpenAI
        const assistantReply = await getOpenAPIResponse(message);
        
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        user.markModified('threads');
        await user.save();
        
        res.json({ reply: assistantReply });

    } catch (err) {
        console.error("Error in /chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;