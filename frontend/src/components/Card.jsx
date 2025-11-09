
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HoverPreview from "./HoverPreview";
// import { io } from "socket.io-client";

// const SOCKET_SERVER = "http://localhost:5000";

// const Card = ({ movieData, isLiked = false }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
//   const navigate = useNavigate();

//   const location = useLocation();

//    const params = new URLSearchParams(location.search);
//   const selectMode = params.get("selectMode");
//   const roomId = params.get("roomId");

//   const handleMouseEnter = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHoverPosition({ top: rect.top - 90, left: rect.left });
//     setIsHovered(true);
//   };

//   const handleClick = () => {
//     if (selectMode && roomId) {
//       // Host selecting a video
//       const socket = io(SOCKET_SERVER, { transports: ["websocket"] });
//       // Here I assume movieData has a trailer or video link; fallback if not
//       const videoUrl =
//         movieData.trailerLink ||
//         movieData.video ||
//         "https://www.w3schools.com/html/mov_bbb.mp4";

//       socket.emit("select-video", { roomId, url: videoUrl });
//       socket.disconnect();

//       navigate(`/watch/${roomId}`);
//     } else {
//       // Normal flow: open player
//       navigate("/player", { state: { id: movieData.id } });
//     }
//   };

//   return (
//     <div
//       className="relative w-[220px] flex-shrink-0 cursor-pointer"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handleClick}
//     >
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
//         alt="movie"
//         className="w-full h-full rounded"
//         // onClick={() => navigate("/player", { state: { id: movieData.id } })}
//       />
//       {isHovered && (
//         <HoverPreview
//           movieData={movieData}
//           isLiked={isLiked}
//           position={hoverPosition}
//           onClose={() => setIsHovered(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Card;


//imp


// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HoverPreview from "./HoverPreview";
// import { socket } from "../utils/socket"; // Import our shared socket

// const API_KEY = "880cba2b766de6617e34ec7cc1e58294"; 

// const Card = ({ movieData, isLiked = false }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
//   const navigate = useNavigate();
//   const location = useLocation();

//   const params = new URLSearchParams(location.search);
//   const selectMode = params.get("selectMode");
//   const roomId = params.get("roomId");

//   const handleMouseEnter = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHoverPosition({ top: rect.top - 50, left: rect.left - 50 }); 
//     setIsHovered(true);
//   };

//   const handleClick = () => {
//     if (selectMode && roomId) {
//       // DO NOT create a new socket here. Use the imported one.
      
//       fetch(`https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${API_KEY}`)
//         .then(res => res.json())
//         .then(data => {
//           const trailer = data.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube") || data.results[0];
//           if (trailer && trailer.key) {
//             const videoUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
            
//             // Use the shared socket to emit the event
//             socket.emit("select-video", { roomId, url: videoUrl });
            
//             // DO NOT disconnect the socket here.
//             navigate(`/watchparty/${roomId}`);
//           } else {
//             alert("No trailer found for this movie.");
//           }
//         })
//         .catch(err => {
//             console.error("Error fetching trailer for watch party:", err);
//             alert("Could not fetch video for this movie.");
//         });
//     } else {
//       navigate("/player", { state: { id: movieData.id } });
//     }
//   };

//   return (
//     <div
//       className="relative w-[220px] flex-shrink-0 cursor-pointer"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handleClick}
//     >
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
//         alt="movie"
//         className="w-full h-full rounded"
//       />
//       {isHovered && (
//         <HoverPreview
//           movieData={movieData}
//           isLiked={isLiked}
//           position={hoverPosition}
//           onClose={() => setIsHovered(false)}
        
//         />
//       )}
//     </div>
//   );
// };

// export default Card;


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HoverPreview from "./HoverPreview";
import { socket } from "../utils/socket"; 

const API_KEY = "880cba2b766de6617e34ec7cc1e58294"; 

const Card = ({ movieData, isLiked = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectMode = params.get("selectMode");
  const roomId = params.get("roomId");

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ top: rect.top - 50, left: rect.left - 50 }); 
    setIsHovered(true);
  };

  // This function now handles clicks ONLY on the image,
  // when the card is not hovered.
  const handleClick = () => {
    const mediaType = movieData.media_type || "movie";

    if (selectMode && roomId) {
      // Watch party selection logic
      fetch(`https://api.themoviedb.org/3/${mediaType}/${movieData.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const trailer = data.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube") || data.results[0];
          if (trailer && trailer.key) {
            const videoUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
            socket.emit("select-video", { roomId, url: videoUrl });
            navigate(`/watchparty/${roomId}`);
          } else {
            alert("No trailer found for this movie.");
          }
        })
        .catch(err => {
            console.error("Error fetching trailer for watch party:", err);
            alert("Could not fetch video for this movie.");
        });
    } else {
      // Normal play logic
      navigate("/player", { state: { id: movieData.id, type: mediaType } });
    }
  };

  return (
    <div
      className="relative w-[220px] flex-shrink-0 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      // onClick has been removed from this parent div
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie"
        className="w-full h-full rounded"
        onClick={handleClick} // The click is now only on the image
      />
      {isHovered && (
        <HoverPreview
          movieData={movieData}
          isLiked={isLiked}
          position={hoverPosition}
          onClose={() => setIsHovered(false)}
          // Pass the crucial watch party info to the preview
          selectMode={selectMode}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default Card;