import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Users, MessageCircle, Share2 } from "lucide-react";

export default function WatchParty() {
  const [chatOpen, setChatOpen] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(true);

  const participants = ["Alex", "Jordan"];
  const messages = [
    { name: "Alex", text: "This part is awesome!", align: "left" },
    { name: "Jordan", text: "Love the scene 🔥", align: "right" },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Video Player + Floating Buttons */}
      <div className="flex-grow relative">
        <ReactPlayer
          url="https://www.w3schools.com/html/mov_bbb.mp4"
          controls
          width="100%"
          height="100%"
        />

        {/* Floating top-right buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-3">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Chat
          </button>
          <button
            onClick={() => setParticipantsOpen(!participantsOpen)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Participants
          </button>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Invite
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="w-96 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
          {/* Header */}
          <div className="p-4 border-b border-white/10 font-semibold flex justify-between items-center text-white">
            <span>💬 Live Chat</span>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.align === "right" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-gray-400 mb-1">{msg.name}</span>
                <div
                  className={`px-4 py-2 rounded-2xl text-white max-w-[80%] shadow-md ${
                    msg.align === "right"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                      : "bg-gradient-to-br from-blue-600 to-cyan-500"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-4 py-2 bg-white/10 text-white text-sm rounded-full outline-none placeholder-gray-400"
            />
            <button
              className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 hover:scale-105 transition"
              title="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {participantsOpen && (
        <div className="w-72 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🧑‍🤝‍🧑 <span>Participants</span>
            </h2>
            <button
              onClick={() => setParticipantsOpen(false)}
              className="text-gray-400 hover:text-white transition"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {participants.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition shadow-sm"
              >
                {/* Avatar with Gradient Border */}
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-blue-500 blur-sm"></div>
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 font-bold text-white border-2 border-white/10">
                    {name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name */}
                <div className="text-white font-medium">{name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

