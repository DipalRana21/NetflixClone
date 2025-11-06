// import React, { useEffect, useState } from 'react'
// import Navbar from '../components/Navbar';
// import backgroundImage from '../assets/home.jpg';
// import MovieLogo from '../assets/homeTitle.webp';
// import { FaPlay } from 'react-icons/fa';
// import { AiOutlineInfoCircle } from 'react-icons/ai';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMovies, getGenres } from '../store';
// import Slider from '../components/Slider';

// const Netflix = () => {

//   const [isScrolled, setIsScrolled] = useState(false);

//   // window.onscroll = () => {
//   //   setIsScrolled(window.pageYOffset === 0 ? false : true);
//   //   return () => (window.onscroll = null);
//   // };

//   useEffect(()=>{
//     const handleScroll = ()=>{
//       setIsScrolled(window.pageYOffset !== 0)
//     };

//     window.addEventListener("scroll",handleScroll);

//     return ()=> window.removeEventListener("scroll",handleScroll);
//   },[])

//   const genresLoaded = useSelector((state)=> state.netflix.genresLoaded)
//   const dispatch = useDispatch();
//    const navigate=useNavigate();
//    const movies = useSelector((state)=> state.netflix.movies)

//   useEffect(()=>{
//     dispatch(getGenres());
//   },[])


//   useEffect(()=>{
//     if(genresLoaded) dispatch(fetchMovies({type:"all"}))
//   },[genresLoaded])
 
//   // console.log(movies);


//   return (
//     <div className='relative min-h-screen bg-black'>
//       <Navbar isScrolled={isScrolled} />

//       {/* Hero Section */}
//       <div className='relative'>
//         {/* for balck nav remove h-screen from below */}
//         <img src={backgroundImage} alt="bg" className='h-screen w-screen object-cover brightness-60' />

//         <div className='absolute bottom-20 left-20 flex flex-col gap-8'>
//           {/* Movie Logo */}
//           <div className='w-[35vw]'>
//             <img src={MovieLogo} alt="Movie Logo" className='w-full h-full' />
//           </div>

//           <div className='flex gap-4 ml-20'>
//             <button
//               onClick={() => navigate("/player")}
//               className='flex items-center gap-2 rounded px-6 py-2 bg-white text-black font-semibold text-lg hover:opacity-80 transition'>
//               <FaPlay />
//               play
//             </button>

//             <button className='flex items-center gap-2 rounded px-6 py-2 bg-gray-600/70 text-white font-semibold text-lg hover:opacity-80 transition'>
//               <AiOutlineInfoCircle className='text-xl' />
//               More Info
//             </button>
//           </div>
//         </div>
  
//       </div>

//       <Slider movies={movies} />
//     </div>
//   )
// }

// export default Netflix




import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
// REMOVED: No longer using the static background image
// import backgroundImage from '../assets/home.jpg';
// REMOVED: No longer using the static movie logo
// import MovieLogo from '../assets/homeTitle.webp';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, getGenres } from '../store';
import Slider from '../components/Slider';

const Netflix = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // NEW: State to hold the movie featured in the hero section
  const [featuredMovie, setFeaturedMovie] = useState(null);

  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const movies = useSelector((state) => state.netflix.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "all" }));
  }, [genresLoaded, dispatch]);

  // NEW: useEffect to pick a random movie for the hero section once movies are loaded
  useEffect(() => {
    if (movies.length) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setFeaturedMovie(randomMovie);
    }
  }, [movies]);

  return (
    <div className='relative min-h-screen bg-black'>
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      {/* We add a check to make sure we have a featured movie before rendering */}
      {featuredMovie && (
        <div className='relative'>
          {/* UPDATED: Use the dynamic background image from the featured movie */}
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.image}`}
            alt="bg"
            className='h-screen w-screen object-cover brightness-60'
          />
          <div className='absolute bottom-20 left-20 flex flex-col gap-8'>
            {/* UPDATED: Use the dynamic movie name instead of a static logo */}
            <div className='w-[45vw]'>
              <h1 className='text-6xl font-extrabold text-white drop-shadow-lg'>{featuredMovie.name}</h1>
            </div>
            {/* You can also add the movie's genres here if you want */}
            <div className='flex gap-2 text-white font-semibold'>
              {featuredMovie.genres.join(" • ")}
            </div>
            <div className='flex gap-4'>
              {/* UPDATED: Make the Play button navigate to the correct movie's player */}
              <button
                onClick={() => navigate("/player", { state: { id: featuredMovie.id, type: featuredMovie.media_type } })}
                className='flex items-center justify-center gap-2 rounded px-6 py-2 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition w-32'
              >
                <FaPlay />
                Play
              </button>
              <button className='flex items-center justify-center gap-2 rounded px-6 py-2 bg-gray-600/70 text-white font-semibold text-lg hover:bg-gray-500/70 transition w-40'>
                <AiOutlineInfoCircle className='text-2xl' />
                More Info
              </button>
            </div>
          </div>
        </div>
      )}
      <Slider movies={movies} />
    </div>
  );
}

export default Netflix;