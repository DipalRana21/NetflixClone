import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, getGenres } from '../store';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import NotAvailable from '../components/NotAvailable';
import SelectGenre from '../components/SelectGenre';

const TVShows = () => {
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
        if (genresLoaded) dispatch(fetchMovies({ type: "tv" }))
    },[genresLoaded])

    return (
        <div className='bg-black text-white'>
            <div >
                <Navbar isScrolled={isScrolled} forceBlack={true}  />
            </div>
            
            <div className='mt-20'>
             <SelectGenre genres={genres} type="tv"/>
                {
                    movies.length ? <Slider movies={movies} /> : <NotAvailable />
                }
            </div>

        </div>

    )
}

export default TVShows