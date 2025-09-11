import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Initialize socket outside the component to avoid multiple instances
const socket = io("http://localhost:5000");

const WatchPartyRoom = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState("room123"); // Can be made dynamic
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
  const videoRef = useRef();

  // Join the room and get user list
  useEffect(() => {
    socket.emit("join-room", roomId, username);

    socket.on("room-users", (userList) => {
      setUsers(userList);
    });
  }, [roomId, username]);

  // Socket listeners
  useEffect(() => {
    const handleReceiveMessage = ({ username, message }) => {
      setChat((prev) => [...prev, { username, message }]);
    };

    const handleUserJoined = (newUser) => {
      setUsers((prev) => [...prev, newUser]);
      setChat((prev) => [...prev, { username: "System", message: `${newUser} joined the room.` }]);
    };

    const handlePlay = () => {
      videoRef.current?.play();
    };

    const handlePause = () => {
      videoRef.current?.pause();
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("user-joined", handleUserJoined);
    socket.on("play", handlePlay);
    socket.on("pause", handlePause);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("user-joined", handleUserJoined);
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.disconnect(); // Optional: disconnect on unmount
    };
  }, []);

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit("send-message", { roomId, username, message });
      setChat((prev) => [...prev, { username, message }]); // Show own message
      setMessage("");
    }
  };

  const handlePlay = () => {
    socket.emit("play", roomId);
  };

  const handlePause = () => {
    socket.emit("pause", roomId);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">🎥 Watch Party Room</h2>

      <video
        ref={videoRef}
        controls
        width="600"
        onPlay={handlePlay}
        onPause={handlePause}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="flex w-full mt-4 gap-6">
        {/* Chat section */}
        <div className="w-2/3 border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">💬 Chat</h3>
          <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded">
            {chat.map((c, index) => (
              <div key={index}>
                <strong>{c.username}</strong>: {c.message}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              className="flex-1 p-2 border rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={message.trim() === ""}
            >
              Send
            </button>
          </div>
        </div>

        {/* Users list */}
        <div className="w-1/3 border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">👥 Participants</h3>
          <ul className="list-disc list-inside">
            {users.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchPartyRoom;
