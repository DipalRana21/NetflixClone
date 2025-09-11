// import React from 'react'
// import {BsArrowLeft} from "react-icons/bs"
// import video from '../assets/video.mp4'
// import { useNavigate } from 'react-router-dom'
// const Player = () => {

//     const navigate = useNavigate();
//   return (
//     <div className='relative w-screen h-screen'>

//         <button onClick={()=>navigate(-1)} className='absolute top-8 left-8 z-10 text-white text-4xl'>
//             <BsArrowLeft />
//         </button>

//         <video src={video} autoPlay loop controls muted className='w-full h-full object-cover' />

//     </div>
//   )
// }

// export default Player

import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import video from '../assets/video.mp4'

const API_KEY = "880cba2b766de6617e34ec7cc1e58294"; 

const Player = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = location.state?.id; 
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();

        
        const trailer =
          data.results.find((vid) => vid.type === "Trailer" && vid.site === "YouTube") ||
          data.results[0];

        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.error("Error fetching trailer:", err);
      }
    };

    if (movieId) fetchTrailer();
  }, [movieId]);

  return (
    <div className="relative w-screen h-screen bg-black">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-10 text-white text-4xl"
      >
        <BsArrowLeft />
      </button>

      

      {trailerKey ? (
        <iframe
          className="w-full h-full object-cover"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1`}
          title="Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        // fallback placeholder video
        <video
          src={video}
          autoPlay
          loop
          controls
          muted
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default Player;
