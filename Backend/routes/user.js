import express from 'express';
import bcrypt from 'bcrypt';
import {User} from '../models/Thread.js'; // Ensure this points to your User model
import jwt from 'jsonwebtoken';

const router = express.Router();

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

        res.status(201).json({ message: "User saved!", user: savedUser });

        // 5. Send success response
        // Don't send the password back in the response!

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        console.log(email);
        console.log(user);
        console.log(password);

        if(!user) {
            return res.status(400).json("Invalid email or password");
        }
        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            return res.status(400).json("Invalid email or password");
        }

        const token = jwt.sign({email}, "parthkhandelwal");
        res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;