// import React, { use, useState } from 'react'
// import logo from "../assets/logo.png"
// import { Link, useNavigate } from 'react-router-dom';
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import { FaPowerOff, FaSearch } from "react-icons/fa";
// import clsx from "clsx";



// const Navbar = ({ isScrolled , forceBlack = false}) => {

//     const navigate = useNavigate();
//     const links = [
//         { name: "Home", link: "/" },
//         { name: "TV Shows", link: "/tv" },
//         { name: "Movies", link: "/movies" },
//         { name: "Watchlist", link: "/watchlist" },
//         { name: "Watch Party", link: "/watchparty" },
//     ];

//     onAuthStateChanged(firebaseAuth, (currentUser) => {
//         if (!currentUser) navigate("/login")
//     })

//     const [showSearch, setShowSearch] = useState(false);
//     const [inputHover, setInputHover] = useState(false);


//     return (

//         <nav
//             className={clsx(
//                 "flex justify-between items-center fixed top-0 w-full z-10 transition duration-300 px-16 h-24",
//                 (isScrolled || forceBlack) ? "bg-black" : "bg-transparent"
//             )}
//         >


//             <div className='flex items-center gap-8 '>

//                 <div>
//                     <img src={logo} alt="logo" className='h-16' />
//                 </div>

//                 <ul className='flex gap-8 list-none'>
//                     {
//                         links.map(({ name, link }) => {
//                             return (
//                                 <li key={name}>
//                                     <Link to={link} className='text-white no-underline hover:underline'>{name}</Link>
//                                 </li>
//                             )
//                         })
//                     }
//                 </ul>
//             </div>

//             <div className=' flex items-center gap-4'>

//                 <div className={`flex items-center gap-2 transition-all duration-300
//                         ${showSearch ? "border border-white bg-black/60" : ""}`}
//                 >

//                     <button
//                         onFocus={() => setShowSearch(true)}
//                         onBlur={() => {
//                             if (!inputHover) setShowSearch(false);
//                         }} className='p-2'>
//                         <FaSearch className='text-white text-lg' />
//                     </button>

//                     <input type="text"
//                         placeholder='Search'
//                         onMouseEnter={() => setInputHover(true)}
//                         onMouseLeave={() => setInputHover(false)}
//                         onBlur={() => {
//                             setShowSearch(false);
//                             setInputHover(false);
//                         }}
//                         className={`bg-transparent border-none tetx-white transition-all duration-300 focus:outline-none
//                         ${showSearch ? "w-48 opacity-100 visible p-1"
//                                 : "w-0 opacity-0 invisible"
//                             }`} />

//                 </div>

//                 {/* Sign Out */}
//                 <button
//                     onClick={() => signOut(firebaseAuth)}>
//                     <FaPowerOff className='text-red-500 text-lg' />
//                 </button>

//             </div>
//         </nav>


//     )
// }

// export default Navbar

// import React, { useState } from 'react';
// import logo from "../assets/logo.png";
// import { Link, useNavigate } from 'react-router-dom';
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import { FaPowerOff, FaSearch } from "react-icons/fa";
// import clsx from "clsx";
// import { io } from "socket.io-client";

// const SOCKET_SERVER = "http://localhost:5000";

// const Navbar = ({ isScrolled, forceBlack = false }) => {
//     const navigate = useNavigate();
//     const [showSearch, setShowSearch] = useState(false);
//     const [inputHover, setInputHover] = useState(false);

//     const links = [
//         { name: "Home", link: "/" },
//         { name: "TV Shows", link: "/tv" },
//         { name: "Movies", link: "/movies" },
//         { name: "Watchlist", link: "/watchlist" },
//     ];

//     onAuthStateChanged(firebaseAuth, (currentUser) => {
//         if (!currentUser) navigate("/login");
//     });

//     const handleCreateWatchParty = () => {
//         const currentUser = firebaseAuth.currentUser;
//         if (!currentUser) {
//             alert("Please log in to start a watch party.");
//             return;
//         }
//         const username = currentUser.displayName || currentUser.email;

//         const socket = io(SOCKET_SERVER, { transports: ["websocket"] });

//         socket.emit("create-room", { username }, ({ roomId }) => {
//             if (roomId) {
//                 navigate(`/watchparty/${roomId}`);
//             }
//             socket.disconnect();
//         });
//     };

//     return (
//         <nav className={clsx("flex justify-between items-center fixed top-0 w-full z-10 transition duration-300 px-16 h-24", (isScrolled || forceBlack) ? "bg-black" : "bg-transparent")}>
//             <div className='flex items-center gap-8'>
//                 <div>
//                     <img src={logo} alt="logo" className='h-16' />
//                 </div>
//                 <ul className='flex gap-8 list-none'>
//                     {links.map(({ name, link }) => (
//                         <li key={name}>
//                             <Link to={link} className='text-white no-underline hover:underline'>{name}</Link>
//                         </li>
//                     ))}
//                     <li>
//                         <button onClick={handleCreateWatchParty} className='text-white no-underline hover:underline bg-transparent border-none cursor-pointer p-0 text-base font-sans'>
//                             Watch Party
//                         </button>
//                     </li>
//                 </ul>
//             </div>

//             <div className='flex items-center gap-4'>
//                 <div className={`flex items-center gap-2 transition-all duration-300 ${showSearch ? "border border-white bg-black/60" : ""}`}>
//                     <button onFocus={() => setShowSearch(true)} onBlur={() => { if (!inputHover) setShowSearch(false); }} className='p-2 bg-transparent border-none'>
//                         <FaSearch className='text-white text-lg' />
//                     </button>
//                     <input type="text" placeholder='Search' onMouseEnter={() => setInputHover(true)} onMouseLeave={() => setInputHover(false)} onBlur={() => { setShowSearch(false); setInputHover(false); }} className={`bg-transparent border-none text-white transition-all duration-300 focus:outline-none ${showSearch ? "w-48 opacity-100 visible p-1" : "w-0 opacity-0 invisible"}`} />
//                 </div>
//                 <button onClick={() => signOut(firebaseAuth)} className="bg-transparent border-none">
//                     <FaPowerOff className='text-red-500 text-lg' />
//                 </button>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import clsx from "clsx";
import { socket } from "../utils/socket"; // Use the shared socket

const Navbar = ({ isScrolled, forceBlack = false }) => {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [inputHover, setInputHover] = useState(false);

    const links = [
        { name: "Home", link: "/" },
        { name: "TV Shows", link: "/tv" },
        { name: "Movies", link: "/movies" },
        { name: "Watchlist", link: "/watchlist" },
    ];

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (!currentUser) navigate("/login");
    });

    const handleCreateWatchParty = () => {
        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) return;
        const username = currentUser.displayName || currentUser.email;

        socket.connect();
        socket.emit("create-room", { username }, ({ roomId }) => {
            if (roomId) {
                // --- THIS IS THE FIX ---
                // We now pass a state flag to the new page, telling it we are the host.
                // This is instant and reliable.
                navigate(`/watchparty/${roomId}`, { state: { isHost: true } });
            }
        });
    };

    return (
        <nav className={clsx("flex justify-between items-center fixed top-0 w-full z-10 transition duration-300 px-16 h-24", (isScrolled || forceBlack) ? "bg-black" : "bg-transparent")}>
            <div className='flex items-center gap-8'>
                <img src={logo} alt="logo" className='h-16' />
                <ul className='flex gap-8 list-none'>
                    {links.map(({ name, link }) => (
                        <li key={name}>
                            <Link to={link} className='text-white no-underline hover:underline'>{name}</Link>
                        </li>
                    ))}
                    <li>
                        <button onClick={handleCreateWatchParty} className='text-white no-underline hover:underline bg-transparent border-none cursor-pointer p-0 text-base font-sans'>
                            Watch Party
                        </button>
                    </li>
                </ul>
            </div>
            <div className='flex items-center gap-4'>
                <div className={`flex items-center gap-2 transition-all duration-300 ${showSearch ? "border border-white bg-black/60" : ""}`}>
                    <button onFocus={() => setShowSearch(true)} onBlur={() => { if (!inputHover) setShowSearch(false); }} className='p-2 bg-transparent border-none'>
                        <FaSearch className='text-white text-lg' />
                    </button>
                    <input type="text" placeholder='Search' onMouseEnter={() => setInputHover(true)} onMouseLeave={() => setInputHover(false)} onBlur={() => { setShowSearch(false); setInputHover(false); }} className={`bg-transparent border-none text-white transition-all duration-300 focus:outline-none ${showSearch ? "w-48 opacity-100 visible p-1" : "w-0 opacity-0 invisible"}`} />
                </div>
                <button onClick={() => signOut(firebaseAuth)} className="bg-transparent border-none">
                    <FaPowerOff className='text-red-500 text-lg' />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;