// import React, { useRef, useState } from 'react'
// import Card from './Card'

// const CardSlider = ({ data, title }) => {

//     const [showControls,setShowControls]=useState(false);

//     const [sliderPosition,setSliderPosition]= useState(0);
//     const listRef= useRef();


//     return (
//         <div onMouseEnter={()=>setShowControls(true)} 
//         onMouseLeave={()=>setShowControls(false)}  
//         className="flex flex-wrap gap-4">

//             <h1 className='text-white text-2xl font-bold'>{title}</h1>
            
//             {
//                 data.map((movie, index) => {
//                     return <Card movieData={movie} index={index} key={movie.id} />
//                 })
//             }
//         </div>
//     )
// }

// export default CardSlider

// import React, { useRef, useState } from 'react'
// import Card from './Card'
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

// const CardSlider = ({ data, title }) => {

//     const [showControls, setShowControls] = useState(false);

//     const [sliderPosition, setSliderPosition] = useState(0);
//     const listRef = useRef();

//     // const handleDirection = (direction) => {
//     //     let distance = listRef.current.getBoundingClientRect().x - 70;

//     //     if (direction == "left" && sliderPosition > 0) {
//     //         listRef.current.style.transform = `translateX(${230 + distance}px)`;
//     //         setSliderPosition(sliderPosition - 1);
//     //     }

//     //     if (direction == "right" && sliderPosition < 4) {
//     //         listRef.current.style.transform = `translateX(${-230 + distance}px)`;
//     //         setSliderPosition(sliderPosition + 1);
//     //     }
//     // }

//     const handleDirection = (direction) => {
//   const cardWidth = 220;
//   const gap = 16;
//   const visibleCount = 5; // Number of cards visible at once
//   const maxIndex = data.length - visibleCount;

//   let newPos = sliderPosition;
//   if (direction === "left") {
//     newPos = Math.max(0, sliderPosition - 1);
//   } else if (direction === "right") {
//     newPos = Math.min(maxIndex, sliderPosition + 1);
//   }

//   setSliderPosition(newPos);
//   listRef.current.style.transform = `translateX(${-newPos * (cardWidth + gap)}px)`;
// };



//     return (
//         <div onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//             className="flex flex-wrap py-8 relative gap-4 ">
            

//             <h1 className='text-white text-xl ml-12 font-bold'>{title}</h1>

//             <div className='relative overflow-hidden'>
//                 {
//                     showControls && (
//                         <button onClick={() => handleDirection("left")}
//                             className='absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center z-20 bg-black/50 hover:bg-black/70 transition'>
//                             <AiOutlineLeft className='text-2xl text-white' />
//                         </button>
//                     )
//                 }

//                 <div
//                     ref={listRef}
//                     className='flex gap-5 ml-12 transition-transform duration-300 ease-in-out '
//                     style={{ transform: 'translateX(0px)' }}
//                 >


//                     {
//                         data.map((movie, index) =>
//                             <Card movieData={movie} index={index} key={movie.id} />
//                         )
//                     }

//                 </div>

//                 {showControls && (
//                     <button onClick={() => handleDirection("right")}
//                         className='absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center z-20 bg-black/50 hover:bg-black/70 transition'>
//                         <AiOutlineRight className='text-2xl text-white' />
//                     </button>
//                 )}
//             </div>


//         </div>
//     )
// }

// export default CardSlider

import React, { useRef, useState } from "react";
import Card from "./Card";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const CardSlider = ({ data, title }) => {
  const [showControls, setShowControls] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const listRef = useRef();

  const handleDirection = (direction) => {
    const cardWidth = 220;
    const gap = 16;
    const visibleCount = 5;
    const maxIndex = data.length - visibleCount;

    let newPos = sliderPosition;
    if (direction === "left") {
      newPos = Math.max(0, sliderPosition - 1);
    } else if (direction === "right") {
      newPos = Math.min(maxIndex, sliderPosition + 1);
    }

    setSliderPosition(newPos);
    listRef.current.style.transform = `translateX(${
      -newPos * (cardWidth + gap)
    }px)`;
  };

  return (
    <div
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="py-8 relative"
    >
      <h1 className="text-white text-xl ml-12 font-bold">{title}</h1>

      <div className="relative overflow-hidden">
        {showControls && (
          <button
            onClick={() => handleDirection("left")}
            className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center z-20 bg-black/50 hover:bg-black/70 transition"
          >
            <AiOutlineLeft className="text-2xl text-white" />
          </button>
        )}

        <div
          ref={listRef}
          className="flex gap-5 ml-12 transition-transform duration-300 ease-in-out"
          style={{ transform: "translateX(0px)" }}
        >
          {data.map((movie, index) => (
            <Card movieData={movie} index={index} key={movie.id} />
          ))}
        </div>

        {showControls && (
          <button
            onClick={() => handleDirection("right")}
            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center z-20 bg-black/50 hover:bg-black/70 transition"
          >
            <AiOutlineRight className="text-2xl text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardSlider;
