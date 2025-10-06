// import React, { useState } from 'react'
// import Header from '../components/Header'
// import BackgroundImage from '../components/BackgroundImage'
// import { firebaseAuth } from '../utils/firebase-config'
// import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {


//   const [formValues, setFormValues] = useState({
//     email: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const handleLogIn = async () => {
//     try {
//       const { email, password } = formValues;
//       await signInWithEmailAndPassword(firebaseAuth, email, password)
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   onAuthStateChanged(firebaseAuth, (currentUser) => {
//     if (currentUser) navigate("/")
//   })

//   return (
//     <div className='relative'>
//       <BackgroundImage />

//       {/* Background overlay */}
//       <div className="fixed inset-0 bg-black/50 h-screen w-screen grid grid-rows-[15vh_85vh]">

//         <div>
//           <Header />
//         </div>

//   <div className="flex flex-col items-center justify-center gap-8 h-[85vh]">
//     <div className="flex flex-col items-center justify-center gap-8 p-8 bg-black/70 w-[25vw] text-white ">
//        <div className='text-2xl font-bold'>
//         <h3>Login</h3>
//        </div>

//         <div className={`flex flex-col gap-8`} >
//           <input
//             type="email"
//             placeholder='Email address'
//             name="email"
//             value={formValues.email}
//             onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
//             className="text-black border border-black p-5 text-lg focus:outline-none" />


//           <input
//             type="password"
//             placeholder='Password'
//             name="password"
//             value={formValues.password}
//             onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
//             className="text-black border border-black p-5 text-lg focus:outline-none" />

//           <button onClick={handleLogIn} className="p-2 bg-[#e50914] text-white font-bold text-lg">Log In</button>



//         </div>
//       </div>

//         </div>



//       </div>

//     </div>


//   )
// }

// export default Login


import React, { useState } from 'react'
import Header from '../components/Header'
import BackgroundImage from '../components/BackgroundImage'
import { firebaseAuth } from '../utils/firebase-config'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // UPDATED: The handler now accepts an 'event' to prevent page reload
  const handleLogIn = async (event) => {
    event.preventDefault(); // Prevents the browser from refreshing the page
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.log(error);
    }
  }

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  })

  return (
    <div className='relative'>
      <BackgroundImage />
      <div className="fixed inset-0 bg-black/50 h-screen w-screen grid grid-rows-[15vh_85vh]">
        <div>
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center gap-8 h-[85vh]">
          {/* UPDATED: Changed the div to a form and added onSubmit */}
          <form onSubmit={handleLogIn} className="flex flex-col items-center justify-center gap-8 p-8 bg-black/70 w-[25vw] text-white ">
            <div className='text-2xl font-bold'>
              <h3>Login</h3>
            </div>
            <div className={`flex flex-col gap-8 w-full`} >
              <input
                type="email"
                placeholder='Email address'
                name="email"
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                className="text-black border border-black p-5 text-lg focus:outline-none" />
              <input
                type="password"
                placeholder='Password'
                name="password"
                value={formValues.password}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                className="text-black border border-black p-5 text-lg focus:outline-none" />
              {/* UPDATED: Changed button type to "submit" and removed onClick */}
              <button type="submit" className="p-2 bg-[#e50914] text-white font-bold text-lg">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;