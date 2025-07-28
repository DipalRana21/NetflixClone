import React from 'react'
import {BsArrowLeft} from "react-icons/bs"
import video from '../assets/video.mp4'
import { useNavigate } from 'react-router-dom'
const Player = () => {

    const navigate = useNavigate();
  return (
    <div className='relative w-screen h-screen'>

        <button onClick={()=>navigate(-1)} className='absolute top-8 left-8 z-10 text-white text-4xl'>
            <BsArrowLeft />
        </button>

        <video src={video} autoPlay loop controls muted className='w-full h-full object-cover' />

    </div>
  )
}

export default Player