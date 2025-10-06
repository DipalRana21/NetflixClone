import React, { useState } from 'react'
import Header from '../components/Header'
import BackgroundImage from '../components/BackgroundImage'
import {firebaseAuth} from '../utils/firebase-config'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formValues,setFormValues] = useState({
    email:"",
    password:"",
  });
  const navigate=useNavigate();

  const handleSignIn = async()=>{
    try {
      const {email,password} = formValues;
      await createUserWithEmailAndPassword(firebaseAuth,email,password)
    } catch (error) {
      console.log(error);
    }
  }

  onAuthStateChanged(firebaseAuth,(currentUser)=>{
    if(currentUser) navigate("/")
  })

  return (
    <div className='relative'>
      <BackgroundImage />

      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50 h-screen w-screen grid grid-rows-[15vh_85vh]">

        <div>
          <Header login />
        </div>

        {/* body */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col gap-4 text-center   text-white">
            <h1 className="px-[25rem] text-5xl font-bold " >Unlimited movies, TV shows and more.</h1>
            <h4 className='text-xl font-bold'>Watch anywhere. Cancel anytime.</h4>
            <h6 className='text-base font-bold'>
              Ready to watch? Enter your email to create or restart membership.
            </h6>
          </div>

          <div className={`grid ${showPassword ? "grid-cols-2" : "grid-cols-[2fr_1fr]"} w-3/5`} >
            <input
              type="email"
              placeholder='Email address'
              name="email"
              value={formValues.email}
              onChange={(e)=>setFormValues({...formValues, [e.target.name]:e.target.value})}
              className="text-black border border-black p-6 text-lg focus:outline-none" />

            {
              showPassword ? (
                <input
                  type="password"
                  placeholder='Password'
                  name="password"
                  value={formValues.password}
              onChange={(e)=>setFormValues({...formValues, [e.target.name]:e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  className="text-black border border-black p-6 text-lg focus:outline-none" />
              ) : (
                <button onClick={() => setShowPassword(true)} className="p-2 bg-[#e50914] text-white font-bold text-lg">Get Started</button>
              )
            }

          </div>

          {
            showPassword && (
              <button onClick={handleSignIn} className="p-2 bg-[#e50914] text-white font-bold text-lg rounded">Sign Up</button>
            )
          }


        </div>
      </div>

    </div>


  )
}

export default SignUp