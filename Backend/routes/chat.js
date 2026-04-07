import express from 'express';
import {Thread, User} from '../models/Thread.js';
import getOpenAPIResponse from '../utils/openai.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "testing New thread2",
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all thread route
router.get("/thread", async(req, res) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader) {
        return res.status(401).json({ error: "No authorization header provided" });
    }

    try {

        const token = authHeader.split(' ')[1]; 
        
        // 3. Verify the actual token string
        const decoded = jwt.verify(token, "parthkhandelwal");

        const user = await User.findOne({email: decoded.email});

        const sortedThreads = user.threads.sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        res.json(sortedThreads);
    } catch(err) {
        console.log(err);
        res.status(500).json("failed to fetch threads");
    }
});

//Get a specific thread
router.get("/thread/:threadId", async(req, res) => {
    let {threadId} = req.params;
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(400).json({error: "User not found"});
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "parthkhandelwal");
       
        const user = await User.findOne({email: decoded.email});

        if (!user) return res.status(404).json({ error: "User not found" });

        let thread = user.threads.find(t => t.threadId === threadId);
    
        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json("failed to fetch thread");
    }
});

//Delete a thread
router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(400).json({error: "User not found"});
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "parthkhandelwal");
       
        const user = await User.findOne({email: decoded.email});

        if (!user) return res.status(404).json({ error: "User not found" });

        const thread =  user.threads.find(t => t.threadId === threadId);

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        user.threads.splice(thread, 1);

        user.markModified('threads');
        await user.save();

        res.status(200).json({success: "Thread deleted successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to delete thread"});
    }
});  

//Get a reply from openai
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    const authHeader = req.headers.authorization;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required field" });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "parthkhandelwal");

        let user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // 1. Ensure the threads array exists
        if (!user.threads) user.threads = [];

        // 2. Look for existing thread
        let thread = user.threads.find(t => t.threadId === threadId);

        if (!thread) {
            // FIX 1: Push to user.threads (not user.messages)
            // FIX 2: Create a plain object for the subdocument array
            const newThread = {
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            };
            user.threads.push(newThread);
            
            // FIX 3: Assign the new thread to our 'thread' variable so the AI code below can find it
            thread = user.threads[user.threads.length - 1];
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // 3. Get AI Response
        const assistantReply = await getOpenAPIResponse(message);
        
        // 4. Push AI response to the thread we found/created above
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        // 5. Tell Mongoose the nested array changed
        user.markModified('threads');
        
        await user.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        console.log("Error in /chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;