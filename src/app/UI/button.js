"use client"
import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../lib/firebase';

const Button=({children})=>{
    return(
        <button className='bg-[#4CB4F8] px-5 py-2 text-white rounded-lg w-full items-center hover:bg-blue-300' onClick={()=>{signOut(auth)}}>
            {children}
        </button>
    )
}


export default Button;