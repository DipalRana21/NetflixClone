import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js"
import http from "http";
import { Server } from "socket.io";


const app=express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{}).then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
console.error("MongoDB connection error:", err.message);
})

app.use("/api/user", userRoute);

const server= http.createServer(app);

const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173", "http://127.0.0.1:5500"],
        methods:["GET","POST"],
    },
});

io.on("connection", (socket)=>{
    console.log("User connected:", socket.id);

    socket.on("disconnect",()=>{
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, ()=>{
    console.log("Server running on port 5000");
})