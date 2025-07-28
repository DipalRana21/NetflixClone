import React from "react";
import { createPortal } from "react-dom";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import video from "../assets/video.mp4";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeMovieFromLiked } from "../store";

const HoverPreview = ({ movieData, isLiked, position, onClose }) => {
  const navigate = useNavigate();
  const [email,setEmail]=useState(undefined);

     onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) setEmail(currentUser.email);
        else navigate("/login");
      })
    
  const dispatch=useDispatch();

      const addToList = async()=>{
        try {
          await axios.post("http://localhost:5000/api/user/add", {email, data:movieData})
        } catch (error) {
          console.log(error);
        }
      }

  return createPortal(
    <div
      className="fixed w-80 bg-[#181818] rounded shadow-lg z-[9999] transition duration-300"
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseLeave={onClose}
      onMouseEnter={() => {}}
    >
      <div className="relative h-[140px]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
          alt="card"
          className="absolute top-0 left-0 w-full h-full object-cover rounded"
          onClick={() => navigate("/player")}
        />

        <video
          src={video}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover rounded"
          onClick={() => navigate("/player")}
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3
          className="text-white font-semibold text-lg"
          onClick={() => navigate("/player")}
        >
          {movieData.name}
        </h3>

        <div className="flex justify-between items-center">
          <div className="flex gap-3 text-white">
            <IoPlayCircleSharp
              title="Play"
              size={24}
              className="hover:text-gray-400"
              onClick={() => navigate("/player")}
            />
            <RiThumbUpFill
              title="Like"
              size={20}
              className="hover:text-gray-400"
            />
            <RiThumbDownFill
              title="Dislike"
              size={20}
              className="hover:text-gray-400"
            />
            {isLiked ? (
              <BsCheck title="Remove from List" className="hover:text-gray-400" onClick={()=>dispatch( removeMovieFromLiked({movieId:movieData.id,email}))} />
            ) : (                                                                            
              <AiOutlinePlus
                title="Add to My List"
                size={20}
                className="hover:text-gray-400"
                onClick={addToList}/>
            )}
          </div>
          <BiChevronDown
            title="More Info"
            size={24}
            className="text-white hover:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1">
          {movieData.genres.map((genre, index) => (
            <span key={index}>{genre}</span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HoverPreview;
