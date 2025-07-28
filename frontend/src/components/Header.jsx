import React from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'

const Header = (props) => {

  const navigate= useNavigate();

  return (
    <header className="flex items-center justify-between px-16">

      <div className='logo'>
      <img src={logo} alt="logo" className="h-20"  />
    </div>

    <button onClick={()=>navigate(props.login ? "/login" : "/signup")}
      className="py-2 px-4 bg-[#e50914] text-white rounded font-bold text-lg cursor-pointer">
      {props.login ? "Login" : "Signup"}
      </button>

    </header>
    
  )
}

export default Header