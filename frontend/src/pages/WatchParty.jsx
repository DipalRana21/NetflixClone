// import React, { useState, useRef, useEffect } from "react";
// import ReactPlayer from "react-player";
// import { Users, MessageCircle, Share2, LogOut, X } from "lucide-react";
// import { io } from "socket.io-client";
// import { useNavigate, useParams } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import toast, { Toaster } from "react-hot-toast";


// const SOCKET_SERVER = "http://localhost:5000";

// export default function WatchParty() {
//   const [chatOpen, setChatOpen] = useState(true);
//   const [participantsOpen, setParticipantsOpen] = useState(true);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [username, setUsername] = useState("");

//   const [isHost, setIsHost] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const playerRef = useRef(null);
//   const socketRef = useRef(null);
//   const { roomId } = useParams();

//   const messageEndRef = useRef(null); //for auto-scroll
//   const navigate = useNavigate();

//   // Get real users from firebase
//   useEffect(() => {
//     const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
//       if (currentUser) {
//         setUsername(currentUser.displayName || currentUser.email);
//       }
//       else {
//         setUsername(`Guest${Math.floor(Math.random() * 1000)}`);
//       }
//     });
//     return () => unsub();
//   }, []);


//   // socket setup
//   useEffect(() => {

//     if (!username) return;

//     socketRef.current = io(SOCKET_SERVER, {
//       transports: ["websocket"],
//       // query: { roomId, userName },
//     });

//     //join the room
//     socketRef.current.emit("join-room", { roomId, username });

//     // Listen for participants update
//     socketRef.current.on("participants", (list) => {
//       setParticipants(list);
//     });

//     // Listen for new messages
//     socketRef.current.on("chat-message", ({ username: sender, message }) => {
//       setMessages((prev) => [...prev, { name: sender, text: message, align: sender === username ? "right" : "left" }]);
//     });

//     socketRef.current.on("user-joined", (name) => {
//       setMessages((prev) => [...prev, { name: "System", text: `${name} joined the chat`, align: "center" }]);

//       // setParticipants((prev) => [...prev, name]);
//       toast.success(`${name} joined the room 🎉`);
//     });

//     socketRef.current.on("user-left", (name) => {
//       setMessages((prev) => [...prev, { name: "System", text: `${name} left the chat`, align: "center" }]);

//       // setParticipants((prev) => prev.filter((p) => p !== name));
//       toast.error(`${name} left the room 👋`);
//     });


//     // Host info
//     socketRef.current.on("you-are-host", (val) => {
//       setIsHost(val);
//       if (val) toast.success("You are the host 🎬");
//     });

//     // Receive video state (url, time, playing)
//     socketRef.current.on("video-state", ({ url, time, playing }) => {
//       setVideoUrl(url);
//       if (!playerRef.current) return;

//       // Ensure seekTo exists before calling
//       if (time !== undefined && typeof playerRef.current.seekTo === "function") {
//         playerRef.current.seekTo(time, "seconds");
//       }

//       const internal = playerRef.current.getInternalPlayer?.();

//       if (playing) {
//       internal?.play?.() || internal?.playVideo?.();
//     } else {
//       internal?.pause?.() || internal?.pauseVideo?.();
//     }
//     });



//     // Listen for video sync events
//     socketRef.current.on("video-action", ({ action, time }) => {

//       if (!playerRef.current) return;

//       const player = playerRef.current;

//       if (action === "play") player.getInternalPlayer()?.play?.();
//       if (action === "pause") player.getInternalPlayer()?.pause?.();
//       if (action === "seek") player.seekTo(time, "seconds");


//     });

//     return () => {
//       socketRef.current.disconnect();
//     };

//   }, [roomId, username]);

//   // send chat message
//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     socketRef.current.emit("chat-message", { roomId, username, message: newMessage });

//     setNewMessage("");
//   };

//   // Handle video events
//   const handlePlay = () => {
//     socketRef.current.emit("video-action", { roomId, action: "play" });
//   }

//   const handlePause = () => {
//     socketRef.current.emit("video-action", { roomId, action: "pause" });
//   };

//   const handleSeek = (seconds) => {
//     socketRef.current.emit("video-action", { roomId, action: "seek", time: seconds });

//   };


//   // Auto-scroll
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const leaveChat = () => {
//     socketRef.current.emit("leave-room", { roomId, username });
//     navigate("/");
//   }

//   return (
//     <div className="flex h-screen bg-black text-white">
//       {/* Video Player + Floating Buttons */}
//       <Toaster position="top-right" />
//       <div className="flex-grow relative">
//         <ReactPlayer
//           ref={playerRef}
//           url={videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
//           controls={isHost}
//           width="100%"
//           height="100%"
//           onPlay={handlePlay}
//           onPause={handlePause}
//           onSeeked={handleSeek}
//         />

//         {/* Floating top-right buttons */}
//         <div className="absolute top-4 right-4 z-10 flex gap-3">
//           {isHost && (
//             <button
//               onClick={() => navigate("/movies?selectMode=true&roomId=" + roomId)}
//               className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
//             >
//               🎬 Select Video
//             </button>
//           )}

//           <button
//             onClick={() => setChatOpen(!chatOpen)}
//             className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2"
//           >
//             <MessageCircle className="w-4 h-4" /> Chat
//           </button>

//           <button
//             onClick={() => setParticipantsOpen(!participantsOpen)}
//             className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2"
//           >
//             <Users className="w-4 h-4" /> Participants
//           </button>

//           <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2">
//             <Share2 className="w-4 h-4" /> Invite
//           </button>

//           <button
//             onClick={leaveChat}
//             className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center gap-2"
//           >
//             <LogOut className="w-4 h-4" /> Leave
//           </button>
//         </div>

//         {/* Host badge */}
//         {isHost && <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-black rounded-lg font-semibold">Host</div>}
//       </div>

  
//       {/* Chat Panel */}
//       {chatOpen && (
//         <div className="w-96 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
//           {/* Header */}
//           <div className="p-4 border-b border-white/10 font-semibold flex justify-between items-center text-white">
//             <span>💬 Live Chat</span>
//             <button
//               onClick={() => setChatOpen(false)}
//               className="text-gray-400 hover:text-white transition"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex flex-col ${
//                   // msg.align === "right" ? "items-end" : "items-start"
//                   msg.align === "right"
//                     ? "items-end"
//                     : msg.align === "left"
//                       ? "items-start"
//                       : "items-center"
//                   }`}
//               >
//                 {/* <span className="text-xs text-gray-400 mb-1">{msg.name}</span> */}
//                 {msg.align !== "center" && (
//                   <span className="text-xs text-gray-400 mb-1">{msg.name}</span>
//                 )}

//                 <div
//                   className={`px-4 py-2 rounded-2xl text-white max-w-[80%] shadow-md ${
//                     // msg.align === "right"
//                     //   ? "bg-gradient-to-br from-purple-600 to-indigo-600"
//                     //   : "bg-gradient-to-br from-blue-600 to-cyan-500"

//                     msg.align === "right"
//                       ? "bg-gradient-to-br from-purple-600 to-indigo-600"
//                       : msg.align === "left"
//                         ? "bg-gradient-to-br from-blue-600 to-cyan-500"
//                         : "text-gray-400 text-sm italic"
//                     }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             <div ref={messageEndRef} />
//           </div>

//           {/* Chat Input */}
//           <div className="p-3 border-t border-white/10 flex items-center gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="w-full px-4 py-2 bg-white/10 text-white text-sm rounded-full outline-none placeholder-gray-400"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 hover:scale-105 transition"
//               title="Send"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Participants Panel */}
//       {participantsOpen && (
//         <div className="w-72 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
//           {/* Header */}
//           <div className="p-4 border-b border-white/10 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//               🧑‍🤝‍🧑 <span>Participants</span>
//             </h2>
//             <button
//               onClick={() => setParticipantsOpen(false)}
//               className="text-gray-400 hover:text-white transition"
//               title="Close"
//             >
//               ✕
//             </button>
//           </div>

//           {/* List */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
//             {participants.map((p, i) => {
//               const username = typeof p === "string" ? p : p?.username || "Unknown";

//               return (
//                 <div
//                   key={i}
//                   className="flex items-center gap-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition shadow-sm"
//                 >
//                   {/* Avatar with Gradient Border */}
//                   <div className="relative w-10 h-10">
//                     <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-blue-500 blur-sm"></div>
//                     <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 font-bold text-white border-2 border-white/10">
//                       {username.charAt(0).toUpperCase()}
//                     </div>
//                   </div>

//                   {/* Name */}
//                   <div className="text-white font-medium">{username}</div>
//                 </div>
//               );
//             })}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// work done

// import React, { useState, useRef, useEffect } from "react";
// import { Users, MessageCircle, Share2, LogOut } from "lucide-react";
// import { socket } from "../utils/socket";
// import { useNavigate, useParams } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import toast, { Toaster } from "react-hot-toast";

// const getYouTubeEmbedUrl = (watchUrl) => {
//     if (!watchUrl) return null;
//     try {
//         const url = new URL(watchUrl);
//         const videoId = url.searchParams.get('v');
//         if (videoId) {
//             return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
//         }
//     } catch (error) {
//         console.error("Invalid YouTube URL provided:", watchUrl, error);
//         return null;
//     }
//     return watchUrl;
// };

// export default function WatchParty() {
//     const [chatOpen, setChatOpen] = useState(true);
//     const [participantsOpen, setParticipantsOpen] = useState(true);
//     const [participants, setParticipants] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [username, setUsername] = useState("");
//     const [isHost, setIsHost] = useState(false);
//     const [videoUrl, setVideoUrl] = useState(null);

//     const { roomId } = useParams();
//     const navigate = useNavigate();
//     const messageEndRef = useRef(null);

//     // --- UPDATED AUTHENTICATION LOGIC ---
//     useEffect(() => {
//         const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
//             if (currentUser) {
//                 // If user is logged in, set their name and continue
//                 setUsername(currentUser.displayName || currentUser.email);
//             } else {
//                 // If user is NOT logged in, show an error and redirect to login
//                 toast.error("You must be logged in to join a watch party.");
//                 navigate("/login");
//             }
//         });
//         return () => unsub();
//     }, [navigate]); // Added navigate to the dependency array

//     useEffect(() => {
//         if (!username || !roomId) return; // This will now wait until a username is set

//         socket.connect();
//         socket.emit("join-room", { roomId, username });
//         socket.on("video-state", (data) => setVideoUrl(data.url));
//         socket.on("participants", (list) => setParticipants(list));
//         socket.on("you-are-host", (val) => {
//             setIsHost(val);
//             if (val) toast.success("You are the host 🎬");
//         });
//         socket.on("chat-message", ({ username: sender, message }) => {
//             setMessages((prev) => [...prev, { name: sender, text: message, align: sender === username ? "right" : "left" }]);
//         });
//         socket.on("user-joined", (name) => {
//             setMessages((prev) => [...prev, { name: "System", text: `${name} joined`, align: "center" }]);
//             toast.success(`${name} joined the room 🎉`);
//         });
//         socket.on("user-left", (name) => {
//             setMessages((prev) => [...prev, { name: "System", text: `${name} left`, align: "center" }]);
//             toast.error(`${name} left the room 👋`);
//         });
//         return () => {
//             socket.emit("leave-room", { roomId, username });
//             socket.off("participants");
//             socket.off("you-are-host");
//             socket.off("video-state");
//             socket.off("chat-message");
//             socket.off("user-joined");
//             socket.off("user-left");
//         };
//     }, [roomId, username]);

//     const sendMessage = () => {
//         if (!newMessage.trim()) return;
//         socket.emit("chat-message", { roomId, username, message: newMessage });
//         setMessages((prev) => [...prev, { name: username, text: newMessage, align: "right" }]);
//         setNewMessage("");
//     };
//     const leaveChat = () => {
//         socket.emit("leave-room", { roomId, username });
//         navigate("/");
//     };
//     const handleInvite = () => {
//         const inviteLink = window.location.href;
//         navigator.clipboard.writeText(inviteLink).then(() => {
//             toast.success("Invite link copied to clipboard!");
//         });
//     };
//     useEffect(() => {
//         messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const embedUrl = getYouTubeEmbedUrl(videoUrl);

//     // This guard clause prevents the page from rendering before the auth check is complete
//     if (!username) {
//         return <div className="w-screen h-screen bg-black" />; // Or a loading spinner
//     }

//     return (
//         <div className="flex h-screen bg-black text-white">
//             <Toaster position="top-right" />
//             <div className="flex-grow relative flex justify-center items-center bg-black">
//                 {embedUrl ? (
//                     <iframe
//                         key={embedUrl}
//                         className="w-full h-full"
//                         src={embedUrl}
//                         title="YouTube video player"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                     ></iframe>
//                 ) : (
//                     <div className="text-center p-4">
//                         <h2 className="text-2xl font-bold mb-4">Welcome to the Watch Party!</h2>
//                         <p className="text-gray-400 mb-2">
//                             {isHost ? "Click 'Select Video' to choose a movie." : "Waiting for the host to select a movie..."}
//                         </p>
//                         <p className="text-sm text-gray-500">Room ID: {roomId}</p>
//                     </div>
//                 )}
//                 <div className="absolute top-4 right-4 z-10 flex gap-3">
//                     {isHost && (
//                         <button onClick={() => navigate(`/movies?selectMode=true&roomId=${roomId}`)} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg">
//                             🎬 Select Video
//                         </button>
//                     )}
//                     <button onClick={() => setChatOpen(!chatOpen)} className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2">
//                         <MessageCircle className="w-4 h-4" /> Chat
//                     </button>
//                     <button onClick={() => setParticipantsOpen(!participantsOpen)} className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2">
//                         <Users className="w-4 h-4" /> Participants
//                     </button>
//                     <button onClick={handleInvite} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2">
//                         <Share2 className="w-4 h-4" /> Invite
//                     </button>
//                     <button onClick={leaveChat} className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center gap-2">
//                         <LogOut className="w-4 h-4" /> Leave
//                     </button>
//                 </div>
//                 {isHost && <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-black rounded-lg font-semibold">Host</div>}
//             </div>

//             {chatOpen && (
//             <div className="w-96 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
//                 <div className="p-4 border-b border-white/10 font-semibold flex justify-between items-center text-white">
//                     <span>💬 Live Chat</span>
//                     <button
//                         onClick={() => setChatOpen(false)}
//                         className="text-gray-400 hover:text-white transition"
//                     >
//                         ✕
//                     </button>
//                 </div>
//                 <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
//                     {messages.map((msg, i) => (
//                         <div
//                             key={i}
//                             className={`flex flex-col ${
//                                 msg.align === "right" ? "items-end" : msg.align === "left" ? "items-start" : "items-center"
//                             }`}
//                         >
//                             {msg.align !== "center" && (
//                                 <span className="text-xs text-gray-400 mb-1">{msg.name}</span>
//                             )}
//                             <div
//                                 className={`px-4 py-2 rounded-2xl text-white max-w-[80%] shadow-md ${
//                                     msg.align === "right"
//                                     ? "bg-gradient-to-br from-purple-600 to-indigo-600"
//                                     : msg.align === "left"
//                                         ? "bg-gradient-to-br from-blue-600 to-cyan-500"
//                                         : "text-gray-400 text-sm italic"
//                                 }`}
//                             >
//                                 {msg.text}
//                             </div>
//                         </div>
//                     ))}
//                     <div ref={messageEndRef} />
//                 </div>
//                 <div className="p-3 border-t border-white/10 flex items-center gap-2">
//                     <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type your message..."
//                         className="w-full px-4 py-2 bg-white/10 text-white text-sm rounded-full outline-none placeholder-gray-400"
//                         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 hover:scale-105 transition"
//                         title="Send"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//         )}

//         {participantsOpen && (
//             <div className="w-72 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
//                 <div className="p-4 border-b border-white/10 flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//                         🧑‍🤝‍🧑 <span>Participants</span>
//                     </h2>
//                     <button
//                         onClick={() => setParticipantsOpen(false)}
//                         className="text-gray-400 hover:text-white transition"
//                         title="Close"
//                     >
//                         ✕
//                     </button>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
//                     {participants.map((p, i) => {
//                         const username = typeof p === "string" ? p : p?.username || "Unknown";
//                         return (
//                             <div key={i} className="flex items-center gap-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition shadow-sm">
//                                 <div className="relative w-10 h-10">
//                                     <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-blue-500 blur-sm"></div>
//                                     <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 font-bold text-white border-2 border-white/10">
//                                         {username.charAt(0).toUpperCase()}
//                                     </div>
//                                 </div>
//                                 <div className="text-white font-medium">{username}</div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         )}
//         </div>
//     );
// }

// temp

import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Users, MessageCircle, Share2, LogOut } from "lucide-react";
import { socket } from "../utils/socket";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import toast, { Toaster } from "react-hot-toast";

const getYouTubeVideoId = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    } catch (e) { return null; }
};

export default function WatchParty() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [isHost, setIsHost] = useState(location.state?.isHost || false);
    const [chatOpen, setChatOpen] = useState(true);
    const [participantsOpen, setParticipantsOpen] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState("");
    const [videoUrl, setVideoUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playerRef = useRef(null);
    const isSyncing = useRef(false);
    const messageEndRef = useRef(null);
    
    useEffect(() => {
        if (location.state?.isHost) {
            toast.success("You have created the room. You are the host! 🎬");
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.isHost, navigate, location.pathname]);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                setUsername(currentUser.displayName || currentUser.email);
            } else {
                toast.error("You must be logged in to join a watch party.");
                navigate("/login");
            }
        });
        return () => unsub();
    }, [navigate]);

    const videoId = getYouTubeVideoId(videoUrl);

    useEffect(() => {
        if (!username || !roomId) return;
        
        const createPlayer = () => {
            if (playerRef.current || !videoId) return;
            playerRef.current = new window.YT.Player('youtube-player-container', {
                videoId: videoId,
                playerVars: { 'autoplay': 1, 'controls': 1, 'playsinline': 1 },
                events: { 'onStateChange': onPlayerStateChange }
            });
        };

        const onPlayerStateChange = (event) => {
            if (isSyncing.current) return;
            switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                    socket.emit("video-action", { roomId, action: "play" });
                    break;
                case window.YT.PlayerState.PAUSED:
                    socket.emit("video-action", { roomId, action: "pause" });
                    break;
            }
        };
        
        if (videoId) {
             if (window.YT && window.YT.Player) { createPlayer(); } 
             else { window.onYouTubeIframeAPIReady = createPlayer; }
        }
        
        socket.connect();
        socket.emit("join-room", { roomId, username });

        socket.on("video-state", (data) => {
            setVideoUrl(data.url);
            setIsPlaying(data.playing);
        });
        socket.on("chat-history", (history) => {
            setMessages(history.map(msg => ({...msg, align: msg.username === username ? 'right' : 'left'})));
        });

        // NEW SIMPLIFIED SYNC LISTENER
        socket.on("video-state-update", (state) => {
            if (playerRef.current) {
                isSyncing.current = true;
                setIsPlaying(state.isPlaying);
                if (state.isPlaying) {
                    playerRef.current.playVideo();
                } else {
                    playerRef.current.pauseVideo();
                }
                setTimeout(() => { isSyncing.current = false; }, 500);
            }
        });
        
        // NEW SIMPLIFIED CHAT LISTENER
        socket.on("chat-message", (msg) => {
            setMessages((prev) => [...prev, {
                name: msg.username,
                text: msg.message,
                align: msg.username === username ? 'right' : 'left'
            }]);
        });

        socket.on("participants", (list) => setParticipants(list));
        socket.on("host-update", ({ hostSocketId }) => {
            const amIHost = socket.id === hostSocketId;
            if (amIHost && !isHost) toast.success("You are now the host! 🎬");
            setIsHost(amIHost);
        });
        socket.on("user-joined", (name) => setMessages((prev) => [...prev, { name: "System", text: `${name} joined`, align: "center" }]));
        socket.on("user-left", (name) => setMessages((prev) => [...prev, { name: "System", text: `${name} left`, align: "center" }]));
        
        return () => {
            if (playerRef.current?.destroy) playerRef.current.destroy();
            playerRef.current = null;
            socket.off("video-state");
            socket.off("chat-history");
            socket.off("video-state-update");
            socket.off("chat-message");
            socket.off("participants");
            socket.off("host-update");
            socket.off("user-joined");
            socket.off("user-left");
        };
    }, [roomId, username, videoId, isHost]);

    // NEW SIMPLIFIED SEND MESSAGE FUNCTION
    const sendMessage = () => {
        if (!newMessage.trim()) return;
        // Only emit the message. The server will broadcast it back to us.
        socket.emit("chat-message", { roomId, username, message: newMessage });
        setNewMessage(""); // Clear the input
    };

    const handleSelectVideoNav = () => {
        socket.emit("leave-room", { roomId, isNavigating: true });
        navigate(`/movies?selectMode=true&roomId=${roomId}`);
    };
    const leaveChat = () => {
        socket.emit("leave-room", { roomId, username, isNavigating: false });
        navigate("/");
    };
    const handleInvite = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast.success("Invite link copied to clipboard!");
        });
    };
    
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!username) {
        return <div className="w-screen h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <Toaster position="top-right" />
            <div className="flex-grow relative flex justify-center items-center bg-black">
                {videoId ? (
                    <div id="youtube-player-container" className="w-full h-full"></div>
                ) : (
                    <div className="text-center p-4">
                       <h2 className="text-2xl font-bold mb-4">Welcome to the Watch Party!</h2>
                        <p className="text-gray-400 mb-2">
                            {isHost ? "Click 'Select Video' to choose a movie." : "Waiting for the host to select a movie..."}
                        </p>
                        <p className="text-sm text-gray-500">Room ID: {roomId}</p>
                    </div>
                )}
                <div className="absolute top-4 right-4 z-10 flex gap-3">
                    {isHost && (
                        <button onClick={handleSelectVideoNav} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg">
                            🎬 Select Video
                        </button>
                    )}
                    <button onClick={() => setChatOpen(!chatOpen)} className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                    <button onClick={() => setParticipantsOpen(!participantsOpen)} className="px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Participants
                    </button>
                    <button onClick={handleInvite} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Invite
                    </button>
                    <button onClick={leaveChat} className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Leave
                    </button>
                </div>
                {isHost && <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-black rounded-lg font-semibold">Host</div>}
            </div>

            {chatOpen && (
                <div className="w-96 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
                    <div className="p-4 border-b border-white/10 font-semibold flex justify-between items-center text-white">
                        <span>💬 Live Chat</span>
                        <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white transition">
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.align === "right" ? "items-end" : msg.align === "left" ? "items-start" : "items-center"}`}>
                                {msg.align !== "center" && (
                                    <span className="text-xs text-gray-400 mb-1">{msg.name}</span>
                                )}
                                <div className={`px-4 py-2 rounded-2xl text-white max-w-[80%] shadow-md ${msg.align === "right" ? "bg-gradient-to-br from-purple-600 to-indigo-600" : msg.align === "left" ? "bg-gradient-to-br from-blue-600 to-cyan-500" : "text-gray-400 text-sm italic"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                    <div className="p-3 border-t border-white/10 flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-2 bg-white/10 text-white text-sm rounded-full outline-none placeholder-gray-400"
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage} className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 hover:scale-105 transition" title="Send">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {participantsOpen && (
                <div className="w-72 backdrop-blur-lg bg-white/5 border-l border-white/10 shadow-lg flex flex-col relative">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            🧑‍🤝‍🧑 <span>Participants</span>
                        </h2>
                        <button onClick={() => setParticipantsOpen(false)} className="text-gray-400 hover:text-white transition" title="Close">
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {participants.map((p, i) => {
                            const username = typeof p === "string" ? p : p?.username || "Unknown";
                            return (
                                <div key={i} className="flex items-center gap-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition shadow-sm">
                                    <div className="relative w-10 h-10">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-blue-500 blur-sm"></div>
                                        <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 font-bold text-white border-2 border-white/10">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="text-white font-medium">{username}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}