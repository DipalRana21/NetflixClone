import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  getUserLikedMovies } from '../store';
import Navbar from '../components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';
import Card from '../components/Card';


 

const UserLiked = () => {

    const [isScrolled, setIsScrolled] = useState(false);

    
    
    onAuthStateChanged(firebaseAuth, (currentUSer)=>{
            if(currentUSer) setEmail(currentUSer.email)
                else navigate("/login")
    })


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset !== 0)
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const movies = useSelector((state) => state.netflix.movies)
   

    const [email,setEmail] = useState();
    useEffect(() => {
      if(email) {
        dispatch(getUserLikedMovies(email))
      }
    }, [email])



  return (

    <div className="bg-black min-h-screen pt-32">
      <Navbar isScrolled={isScrolled} forceBlack={true} />
      <div className="flex flex-col gap-12  px-10 ">
        <h1 className="ml-12 text-2xl font-bold text-white">My List</h1>
        <div className="flex flex-wrap gap-4">
          {/* {movies.map((movie, index) => (
            <Card
              movieData={movie}
              index={index}
              key={movie.id}
              isLiked={true}
       
            />
          ))} */}

  {Array.isArray(movies) && movies.length > 0 ? (
    movies.map((movie, index) => (
      <Card
        movieData={movie}
        index={index}
        key={movie.id}
        isLiked={true}
      />
    ))
  ) : (
    <p className="text-white ml-12">No movies in your list.</p>
  )}
        </div>
      </div>
    </div>
  );
};

export default UserLiked