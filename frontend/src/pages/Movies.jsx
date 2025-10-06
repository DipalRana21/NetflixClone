import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, getGenres } from '../store';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import NotAvailable from '../components/NotAvailable';
import SelectGenre from '../components/SelectGenre';

const Movies = () => {
    const [isScrolled, setIsScrolled] = useState(false);



    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset !== 0)
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    const genresLoaded = useSelector((state) => state.netflix.genresLoaded)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const movies = useSelector((state) => state.netflix.movies)
    const genres = useSelector((state) => state.netflix.genres)

    useEffect(() => {
        dispatch(getGenres());
    }, [])


    useEffect(() => {
        if (genresLoaded) dispatch(fetchMovies({ type: "movies" }))
    },[genresLoaded])

    return (
        <div className='bg-black text-white'>
            <div >
                <Navbar isScrolled={isScrolled} forceBlack={true}  />
            </div>
            
            <div className='mt-20'>
             <SelectGenre genres={genres} type="movie"/>
                {
                    movies.length ? <Slider movies={movies} /> : <NotAvailable />
                }
            </div>

        </div>

    )
}

export default Movies


// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { fetchMovies, getGenres } from '../store';
// import Navbar from '../components/Navbar';
// import Slider from '../components/Slider';
// import NotAvailable from '../components/NotAvailable';
// import SelectGenre from '../components/SelectGenre';

// const Movies = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const movies = useSelector((state) => state.netflix.movies);
//   const genres = useSelector((state) => state.netflix.genres);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.pageYOffset !== 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     dispatch(getGenres());
//   }, []);

//   useEffect(() => {
//     if (genresLoaded) dispatch(fetchMovies({ type: "movies" }));
//   }, [genresLoaded]);

//   // Detect if we are in select mode
//   const params = new URLSearchParams(location.search);
//   const selectMode = params.get("selectMode");
//   const roomId = params.get("roomId");

//   return (
//     <div className="bg-black text-white">
//       <Navbar isScrolled={isScrolled} forceBlack={true} />

//       <div className="mt-20">
//         <SelectGenre genres={genres} type="movie" />
//         {movies.length ? (
//           <Slider movies={movies} selectMode={selectMode} roomId={roomId} />
//         ) : (
//           <NotAvailable />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Movies;

