import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Netflix from './pages/Netflix'
import Player from './pages/Player'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import UserLiked from './pages/UserLiked'
import WatchPartyRoom from './pages/WatchPartyRoom'
import WatchParty from './pages/WatchParty'



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/player' element={<Player />} />
        <Route path='/' element={<Netflix />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/tv' element={<TVShows />} />
        <Route path='/watchlist' element={<UserLiked />} />
       
        <Route path='/watchparty' element={<WatchParty />} />
      </Routes>




    </BrowserRouter>

    
  )
}

export default App
