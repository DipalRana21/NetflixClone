// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import userRoute from "./routes/user.route.js";
// import http from "http";
// import { Server } from "socket.io";
// import { v4 as uuidv4 } from "uuid";


// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {})
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err.message));

// app.use("/api/user", userRoute);

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });



// const roomParticipants = {}; // { roomId: { socketId: username } }
// const roomStates = {};       // { roomId: { url, time, playing, hostSocketId } }
// const roomChats = {};    

// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   socket.on("create-room", ({ username }, callback) => {
//     const roomId = uuidv4(); // generate unique roomId
//     socket.join(roomId);

//     // Initialize room participants & state
//     roomParticipants[roomId] = { [socket.id]: username };
//     roomStates[roomId] = { url: null, time: 0, playing: false, hostSocketId: socket.id };

//     socket.emit("you-are-host", true);

//     console.log(`🎉 Room created: ${roomId} by ${username}`);

//     // return roomId to frontend
//     if (callback) callback({ roomId });
//   });

//   // User joins a room
//   socket.on("join-room", ({ roomId, username }) => {
//     socket.join(roomId);

//     if (!roomParticipants[roomId]) roomParticipants[roomId] = {};

//     // Remove old entries if same username exists
//     for (const id in roomParticipants[roomId]) {
//       if (roomParticipants[roomId][id] === username) {
//         delete roomParticipants[roomId][id];
//       }
//     }

//     roomParticipants[roomId][socket.id] = username;

//     // Initialize room state if not present
//     if (!roomStates[roomId]) {
//       roomStates[roomId] = { url: null, time: 0, playing: false, hostSocketId: socket.id };
//       socket.emit("you-are-host", true); // first joiner becomes host
//     } else {
//       // Reassign host if none exists or previous host left
//       if (!roomStates[roomId].hostSocketId || !io.sockets.sockets.get(roomStates[roomId].hostSocketId)) {
//         roomStates[roomId].hostSocketId = socket.id;
//         socket.emit("you-are-host", true);
//       } else {
//         socket.emit("you-are-host", roomStates[roomId].hostSocketId === socket.id);
//       }
//     }

//     console.log(`${username} joined room: ${roomId}`);

//     // Send current video state to new user
//     // socket.emit("video-state", roomStates[roomId]);

//     // Send current video state to new user
//     socket.emit("video-state", {
//       url: roomStates[roomId].url,
//       time: roomStates[roomId].time,
//       playing: roomStates[roomId].playing,
//     });


//     // Notify participants
//     io.to(roomId).emit("participants", Object.values(roomParticipants[roomId]));
//     socket.to(roomId).emit("user-joined", username);
//   });

//   // Host selects video
//   socket.on("select-video", ({ roomId, url }) => {
//     if (!roomStates[roomId]) roomStates[roomId] = { url: null, time: 0, playing: false, hostSocketId: socket.id };

//     if (roomStates[roomId].hostSocketId === socket.id) {
//       roomStates[roomId].url = url;
//       roomStates[roomId].time = 0;
//       roomStates[roomId].playing = false;
//       io.to(roomId).emit("video-state", roomStates[roomId]);
//       console.log(`Room ${roomId} selected video: ${url}`);
//     } else {
//       socket.emit("error-message", "Only the host can select the video");
//     }
//   });

//   // Chat message
//   socket.on("chat-message", ({ roomId, username, message }) => {
//     socket.to(roomId).emit("chat-message", { username, message });
//   });

//   // Video actions (play/pause/seek) — only host can control
//   // socket.on("video-action", ({ roomId, action, time }) => {
//   //   if (!roomStates[roomId]) roomStates[roomId] = { url: null, time: 0, playing: false, hostSocketId: socket.id };

//   //   if (roomStates[roomId].hostSocketId === socket.id) {
//   //     if (typeof time === "number") roomStates[roomId].time = time;
//   //     roomStates[roomId].playing = action === "play";
//   //     socket.to(roomId).emit("video-action", { action, time });
//   //   } else {
//   //     socket.emit("error-message", "Only the host can control video");
//   //   }
//   // });

//   // Video actions (play/pause/seek) — ANYONE can control
//   socket.on("video-action", ({ roomId, action, time }) => {
//     if (!roomStates[roomId]) return;

//     if (typeof time === "number") roomStates[roomId].time = time;
//     roomStates[roomId].playing = action === "play";

//     // broadcast to everyone except sender
//     socket.to(roomId).emit("video-action", { action, time });

//     console.log(`Room ${roomId} ${action} at ${time}`);
//   });


//   // User leaves the room explicitly
//   socket.on("leave-room", ({ roomId }) => {
//     handleUserLeave(roomId, socket);
//   });

//   // User disconnects (tab close / network)
//   socket.on("disconnect", () => {
//     for (const roomId in roomParticipants) {
//       if (roomParticipants[roomId][socket.id]) {
//         handleUserLeave(roomId, socket);
//       }
//     }
//   });

//   // Helper function to handle leaving & host reassignment
//   function handleUserLeave(roomId, socket) {
//     if (roomParticipants[roomId] && roomParticipants[roomId][socket.id]) {
//       const username = roomParticipants[roomId][socket.id];
//       delete roomParticipants[roomId][socket.id];
//       socket.leave(roomId);
//       console.log(`${username} left room: ${roomId}`);

//       // Reassign host if the leaving user was the host
//       if (roomStates[roomId] && roomStates[roomId].hostSocketId === socket.id) {
//         const remaining = Object.keys(roomParticipants[roomId] || {});
//         if (remaining.length) {
//           const newHostSocketId = remaining[0];
//           roomStates[roomId].hostSocketId = newHostSocketId;
//           io.to(newHostSocketId).emit("you-are-host", true);
//         } else {
//           delete roomStates[roomId]; // no participants left, cleanup
//         }
//       }

//       io.to(roomId).emit("participants", Object.values(roomParticipants[roomId]));
//       socket.to(roomId).emit("user-left", username);
//     }
//   }
// });



// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use("/api/user", userRoute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] } });

const roomParticipants = {};
const roomStates = {};
const roomChats = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("create-room", ({ username }, callback) => {
    const roomId = uuidv4();
    socket.join(roomId);
    roomParticipants[roomId] = { [socket.id]: username };
    roomStates[roomId] = { url: null, time: 0, playing: false, hostSocketId: socket.id };
    roomChats[roomId] = [];
    console.log(`🎉 Room created: ${roomId} by ${username}. Host is ${socket.id}`);
    if (callback) callback({ roomId });
  });

  socket.on("join-room", ({ roomId, username }) => {
    if (!roomStates[roomId]) return;
    socket.join(roomId);
    if (!roomParticipants[roomId]) roomParticipants[roomId] = {};
    roomParticipants[roomId][socket.id] = username;

    if (!roomStates[roomId].hostSocketId || !io.sockets.sockets.get(roomStates[roomId].hostSocketId)) {
        roomStates[roomId].hostSocketId = socket.id;
    }
    
    console.log(`${username} joined room: ${roomId}`);
    socket.emit("video-state", roomStates[roomId]);
    if (roomChats[roomId]) {
      socket.emit("chat-history", roomChats[roomId]);
    }
    io.to(roomId).emit("host-update", { hostSocketId: roomStates[roomId].hostSocketId });
    io.to(roomId).emit("participants", Object.values(roomParticipants[roomId]));
    socket.to(roomId).emit("user-joined", username);
  });

  socket.on("select-video", ({ roomId, url }) => {
    if (roomStates[roomId] && roomStates[roomId].hostSocketId === socket.id) {
      roomStates[roomId].url = url;
      roomStates[roomId].playing = true;
      io.to(roomId).emit("video-state", roomStates[roomId]);
    }
  });

  // NEW SIMPLIFIED CHAT LOGIC
  socket.on("chat-message", ({ roomId, username, message }) => {
    const messageData = { username, message };
    if (roomChats[roomId]) roomChats[roomId].push(messageData);
    // Broadcast to EVERYONE (including sender) to ensure reliability
    io.to(roomId).emit("chat-message", messageData);
  });
  
  // NEW SIMPLIFIED SYNC LOGIC
  socket.on("video-action", ({ roomId, action }) => {
      if (roomStates[roomId]) {
        const isPlaying = action === 'play';
        roomStates[roomId].playing = isPlaying;
        // Broadcast the new definitive state to EVERYONE
        io.to(roomId).emit("video-state-update", { isPlaying });
      }
  });

  socket.on("leave-room", ({ roomId, isNavigating }) => {
      if (isNavigating) {
          socket.leave(roomId);
      } else {
          handleUserLeave(roomId, socket);
      }
  });

  socket.on("disconnect", () => {
    for (const roomId in roomParticipants) {
      if (roomParticipants[roomId]?.[socket.id]) {
        handleUserLeave(roomId, socket);
      }
    }
  });

  function handleUserLeave(roomId, socket) {
    if (roomParticipants[roomId]?.[socket.id]) {
      const username = roomParticipants[roomId][socket.id];
      delete roomParticipants[roomId][socket.id];
      socket.leave(roomId);
      console.log(`${username} left room: ${roomId}`);

      if (roomStates[roomId] && roomStates[roomId].hostSocketId === socket.id) {
        const remaining = Object.keys(roomParticipants[roomId] || {});
        if (remaining.length) {
          const newHostSocketId = remaining[0];
          roomStates[roomId].hostSocketId = newHostSocketId;
          io.to(roomId).emit("host-update", { hostSocketId: newHostSocketId });
        } else {
          delete roomStates[roomId];
          delete roomChats[roomId];
          delete roomParticipants[roomId];
          return;
        }
      }
      if(roomParticipants[roomId]) {
        io.to(roomId).emit("participants", Object.values(roomParticipants[roomId]));
        socket.to(roomId).emit("user-left", username);
      }
    }
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});