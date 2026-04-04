import express from 'express';
import bcrypt from 'bcrypt';
import {User} from '../models/Thread.js'; // Ensure this points to your User model

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("user is watching");
})

router.post("/signin", async (req, res) => {
    // 1. Destructure data from request body
    const { username, email, password } = req.body;

    try {
        // 2. Check if the user already exists (prevent duplicates)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // 3. Hash the password
        // We 'await' the salt and the hash so the code doesn't move on 
        // until the password is fully encrypted.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and save the user
        const newUser = new User({
            username,
            email,
            password: hashedPassword // Save the hashed version, never the plain text!
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        res.status(201).json({ message: "User saved!", user: savedUser });

        // 5. Send success response
        // Don't send the password back in the response!

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;