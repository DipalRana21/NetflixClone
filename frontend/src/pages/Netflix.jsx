import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/home.jpg';
import MovieLogo from '../assets/homeTitle.webp';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, getGenres } from '../store';
import Slider from '../components/Slider';

const Netflix = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  // window.onscroll = () => {
  //   setIsScrolled(window.pageYOffset === 0 ? false : true);
  //   return () => (window.onscroll = null);
  // };

  useEffect(()=>{
    const handleScroll = ()=>{
      setIsScrolled(window.pageYOffset !== 0)
    };

    window.addEventListener("scroll",handleScroll);

    return ()=> window.removeEventListener("scroll",handleScroll);
  },[])

  const genresLoaded = useSelector((state)=> state.netflix.genresLoaded)
  const dispatch = useDispatch();
   const navigate=useNavigate();
   const movies = useSelector((state)=> state.netflix.movies)

  useEffect(()=>{
    dispatch(getGenres());
  },[])


  useEffect(()=>{
    if(genresLoaded) dispatch(fetchMovies({type:"all"}))
  },[genresLoaded])
 
  // console.log(movies);


  return (
    <div className='relative min-h-screen bg-black'>
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <div className='relative'>
        {/* for balck nav remove h-screen from below */}
        <img src={backgroundImage} alt="bg" className='h-screen w-screen object-cover brightness-60' />

        <div className='absolute bottom-20 left-20 flex flex-col gap-8'>
          {/* Movie Logo */}
          <div className='w-[35vw]'>
            <img src={MovieLogo} alt="Movie Logo" className='w-full h-full' />
          </div>

          <div className='flex gap-4 ml-20'>
            <button
              onClick={() => navigate("/player")}
              className='flex items-center gap-2 rounded px-6 py-2 bg-white text-black font-semibold text-lg hover:opacity-80 transition'>
              <FaPlay />
              play
            </button>

            <button className='flex items-center gap-2 rounded px-6 py-2 bg-gray-600/70 text-white font-semibold text-lg hover:opacity-80 transition'>
              <AiOutlineInfoCircle className='text-xl' />
              More Info
            </button>
          </div>
        </div>
  
      </div>

      <Slider movies={movies} />
    </div>
  )
}

export default Netflix

