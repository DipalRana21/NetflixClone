// import dotenv from "dotenv"
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import userRoute from "./routes/user.route.js"
// import http from "http";
// import { Server } from "socket.io";


// const app=express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI,{}).then(()=>{
//     console.log("MongoDB connected");
// }).catch((err)=>{
// console.error("MongoDB connection error:", err.message);
// })

// app.use("/api/user", userRoute);

// const server= http.createServer(app);

// const io= new Server(server,{
//     cors:{
//         origin:"http://localhost:5173",
//         methods:["GET","POST"],
//     },
// });

// io.on("connection", (socket)=>{
//     console.log("User connected:", socket.id);

//     socket.on("disconnect",()=>{
//         console.log("User disconnected:", socket.id);
//     });
// });

// server.listen(5000, ()=>{
//     console.log("Server running on port 5000");
// })


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use("/api/user", userRoute);

const server = http.createServer(app);

const roomUsers = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId, username) => {
    socket.join(roomId);

    // Track users
    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push({ id: socket.id, username });

    // Notify others
    socket.to(roomId).emit("user-joined", username);

    // Send updated user list to all
    io.to(roomId).emit("room-users", roomUsers[roomId].map(u => u.username));
  });

  socket.on("send-message", ({ roomId, username, message }) => {
    io.to(roomId).emit("receive-message", { username, message });
  });

  socket.on("play", (roomId) => {
    socket.to(roomId).emit("play");
  });

  socket.on("pause", (roomId) => {
    socket.to(roomId).emit("pause");
  });

  socket.on("disconnect", () => {
    // Remove user from room
    for (const roomId in roomUsers) {
      const users = roomUsers[roomId];
      const index = users.findIndex(u => u.id === socket.id);
      if (index !== -1) {
        const username = users[index].username;
        users.splice(index, 1);
        io.to(roomId).emit("room-users", users.map(u => u.username));
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});
