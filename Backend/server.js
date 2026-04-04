import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/api", chatRoutes);

// app.post("/test", async (req, res) => {
//     let response = getOpenAPIResponse(req.body.message);
//     res.send(response);
// });

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with database");
    } catch(err) {
        console.log(err);
        console.log("Failed to connect with database", err);
    }
}

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
    connectDB();
});