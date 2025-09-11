// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { IoPlayCircleSharp } from "react-icons/io5"
// import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri"
// import { BsCheck } from "react-icons/bs"
// import { AiOutlinePlus } from "react-icons/ai"
// import { BiChevronDown } from "react-icons/bi"
// import video from '../assets/video.mp4'
// const Card = ({ movieData, isLiked = false }) => {

//     const [isHovered, setIsHovered] = useState(false)
//     const navigate = useNavigate();
//     return (
//         <div
//             className='relative w-[220px]  flex-shrink-0 cursor-pointer '
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`} alt="movie"
//                 className='w-full h-full rounded '
//                 onClick={() => navigate("/player")} />

//             {isHovered && (
//                 <div className='absolute -top-[18vh] left-0 w-80 bg-[#181818] rounded shadow-lg z-50 transition duration-300'>
//                     <div className='relative h-[140px]'>
//                         <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`} alt="card"
//                             className='absolute top-0 left-0 w-full h-full object-cover rounded'
//                             onClick={() => navigate("/player")} />

//                         <video src={video}
//                             autoPlay loop muted
//                             className='absolute top-0 left-0 w-full h-full object-cover rounded'
//                             onClick={() => navigate("/player")} />
//                     </div>

//                     <div className='flex flex-col gap-2 p-4'>
//                         <h3 className='text-white font-semibold text-lg'
//                             onClick={() => navigate("/player")}>
//                             {movieData.name}
//                         </h3>

//                         <div className='flex justify-between items-center'>
//                             <div className='flex gap-3 text-white'>

//                                 <IoPlayCircleSharp 
//                                 title="Play"
//                                 size={24}
//                                 className='hover:text-gray-400'
//                                 onClick={()=>navigate("/player")} 
//                                 />

//                                 <RiThumbUpFill 
//                                 title="Like"
//                                 size={20}
//                                 className='hover:text-gray-400'
//                                 />

//                                  <RiThumbDownFill 
//                                 title="Dislike"
//                                 size={20}
//                                 className='hover:text-gray-400'
//                                 />
                                
//                                 {isLiked ? (
//                                     <BsCheck 
//                                     title="Remove from List"
//                                     className='hover:text-gray-400'
//                                     />
//                                 ) : (
//                                     <AiOutlinePlus 
//                                     title="Add to My List"
//                                     size={20}
//                                     className='hover:text-gray-400'
//                                     />
//                                 )}
//                             </div>

//                                 <BiChevronDown 
//                                 title="More Info"
//                                 size={24}
//                                 className='text-white hover:text-gray-400'
//                                 />
//                         </div>

//                         <div className='flex flex-wrap gap-2 text-xs text-gray-400 mt-1'>
//                             {movieData.genres.map((genre,index)=>(
//                                 <span key={index}>{genre}</span>
//                            ) )}

//                         </div>

//                     </div>

//                 </div>
//             )}

//         </div>


//     )
// }

// export default Card

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
// import { IoPlayCircleSharp } from "react-icons/io5"
// import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri"
// import { BsCheck } from "react-icons/bs"
// import { AiOutlinePlus } from "react-icons/ai"
// import { BiChevronDown } from "react-icons/bi"
// import video from "../assets/video.mp4";
// import HoverPreview from "./HoverPreview";
// import { onAuthStateChanged } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import axios from "axios";


// const TMDB_API_KEY="880cba2b766de6617e34ec7cc1e58294";

// const Card = ({ movieData, isLiked = false }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [email,setEmail]=useState(undefined);
//   const navigate = useNavigate();

//   const [trailerKey,setTrailerKey]= useState(null);

//    onAuthStateChanged(firebaseAuth, (currentUser) => {
//       if (currentUser) setEmail(currentUser.email);
//       else navigate("/login");
//     })
  
//     useEffect(()=>{
//       if(isHovered && movieData?.id){
//         const fetchTrailer=async()=>{
//           try {
//             const {data}= await axios.get( `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${TMDB_API_KEY}`);

//             const trailer= data.results.find(
//               (vid)=> vid.site === "YouTube" && vid.type==="Trailer"
//             );

            
//           if (trailer) {
//             setTrailerKey(trailer.key);
//           } else {
//             setTrailerKey(null);
//           }
            
//           } catch (error) {
//             console.error("Error fetching trailer:", error);
//           }
//         };

//         fetchTrailer();
//       }
//     },[isHovered,movieData]);


//   const HoverCard = () =>
//     createPortal(
//       <div
//         className="absolute z-[9999] w-80 bg-[#181818] rounded shadow-lg transition-all duration-300"
//         style={{
//           top: `${hoverPosition.top - 240}px`,
//           left: `${hoverPosition.left}px`,
//         }}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="relative h-[140px]">
//           <img
//             src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
//             className="absolute top-0 left-0 w-full h-full object-cover rounded"
//             onClick={() => navigate("/player")}
//           />
        
//          <video
//             src={video}
//             autoPlay
//             loop
//             muted
//             className="absolute top-0 left-0 w-full h-full object-cover rounded"
//             onClick={() => navigate("/player")}
//           />
          
//           {trailerKey && (
//             <iframe 
//             className="absolute top-0 left-0 w-full h-full object-cover rounded"
//             src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
//             allow="autoplay; encrypted-media"
//             allowFullScreen
//             title="Movie Trailer"
//             onClick={()=>navigate("/player")}
//             />
//           )}

          
//         </div>

//         <div className="flex flex-col gap-2 p-4">
//           <h3
//             className="text-white font-semibold text-lg cursor-pointer"
//             onClick={() => navigate("/player")}
//           >
//             {movieData.name}
//           </h3>

//           <div className="flex justify-between items-center">
//             <div className="flex gap-3 text-white">
//               <IoPlayCircleSharp
//                 size={24}
//                 title="Play"
//                 className="hover:text-gray-400 cursor-pointer"
//                 onClick={() => navigate("/player")}
//               />
//               <RiThumbUpFill size={20} className="hover:text-gray-400" />
//               <RiThumbDownFill size={20} className="hover:text-gray-400" />
//               {isLiked ? (
//                 <BsCheck className="hover:text-gray-400" title="Remove" />
//               ) : (
//                 <AiOutlinePlus
//                   size={20}
//                   className="hover:text-gray-400"
//                   title="Add"
//                 />
//               )}
//             </div>
//             <BiChevronDown
//               size={24}
//               title="More Info"
//               className="text-white hover:text-gray-400 cursor-pointer"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1">
//             {movieData.genres.map((genre, index) => (
//               <span key={index}>{genre}</span>
//             ))}
//           </div>
//         </div>
//       </div>,
//       document.body
//     );

//   const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

//   const handleMouseEnter = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHoverPosition({ top: rect.top, left: rect.left });
//     setIsHovered(true);
//   };

//   return (
//     <div
//       className="relative w-[220px] flex-shrink-0 cursor-pointer"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
//         alt="movie"
//         className="w-full h-full rounded"
//         onClick={() => navigate("/player")}
//       />
//       {isHovered && <HoverPreview  movieData={movieData}
//           isLiked={isLiked}
//           position={{
//             top: hoverPosition.top - 90,
//             left: hoverPosition.left,
//           }}
//           onClose={() => setIsHovered(false)} />}
//     </div>
//   );
// };

// export default Card;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HoverPreview from "./HoverPreview";

const Card = ({ movieData, isLiked = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ top: rect.top - 90, left: rect.left });
    setIsHovered(true);
  };

  return (
    <div
      className="relative w-[220px] flex-shrink-0 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie"
        className="w-full h-full rounded"
        onClick={() => navigate("/player", { state: { id: movieData.id } })}
      />
      {isHovered && (
        <HoverPreview
          movieData={movieData}
          isLiked={isLiked}
          position={hoverPosition}
          onClose={() => setIsHovered(false)}
        />
      )}
    </div>
  );
};

export default Card;
