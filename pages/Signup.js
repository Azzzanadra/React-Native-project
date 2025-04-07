import React, {useState} from 'react'
import '../app/globals.css';
import { FaRegEnvelope} from 'react-icons/fa';
import {MdLockOutline} from 'react-icons/md';
import { CgProfile } from "react-icons/cg";


function Signup() {
  const [regis,setRegis] = useState(
    {
      "username": "",
      "email": "",
      "password": ""
    }
  )
  const axios = require('axios');


  fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => console.log(data));
    

  return (
    <div className="flex items-center justify-items-center min-h-screen bg-gray-100 p-8 pb-20 gap-16 sm:p-20 text-black">
      <head>
        <title>
          NextJS Project
        </title>
      </head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          {/* Signup */}
          <div className="bg-blue-400 w-2/5 text-blue-700 rounded-tr-2xl rounded-2xl py-20 px-12">
            <h2 className='text-3xl font-bold mb-2'>Sign-up</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-5">
                <CgProfile className='text-gray-400 m-2'/>
                <input type="text" name='username' placeholder='User name' className='bg-gray-100 outline-none text-sm flex-1'/>
              </div>
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-5">
                <FaRegEnvelope className='text-gray-400 m-2'/>
                <input type="email" name='email' placeholder='Email' className='bg-gray-100 outline-none text-sm flex-1'/>
              </div>
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-5">
                <MdLockOutline className='text-gray-400 m-2'/>
                <input type="password" name='password' placeholder='Password' className='bg-gray-100 outline-none text-sm flex-1'/>
              </div>
            </div>
            <a  className='border-2 border-white text-white inline-block px-12 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-400'>Sign up</a>
          </div>          
      </main>      
    </div>
  )
}

export default Signup