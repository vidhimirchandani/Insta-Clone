"use client"
import {BsSearch} from 'react-icons/bs';
import {
    Add,Home,Heart,Cross,Compass,Search,Messenger,Profile,

} from './headericons';

import IconDisplay from './IconDisplay';
import Button from '../UI/button';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';


const Header=()=>{

const HEADER_ICONS=[
    {
        icon:Home,
        key:1,
        url:'/',
        name: 'Home',
    },
    {
        icon:Messenger,
        key:2,
        url:'/',
        name: 'Messenger',
    },
    {
        icon:Add,
        key:3,
        url:'/',
        name: 'Add',
    },
    {
        icon:Compass,
        key:4,
        url:'/',
        name: 'Compass',
    },
    {
        icon:Heart,
        key:5,
        url:'/',
        name: 'Heart',
    },
    {
        icon:Profile,
        key:6,
        url:'/',
        name: 'Profile',
    },
    ]


    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();
      };

   return (
    <header className="w-full h-16 flex items-center justify-around bg-white shadow-md">
            <div className="text-xl font-semibold tracking-wider">Instagram</div>
            <div className='flex items-center bg-[#FAFBFB] rounded-sm 
            outline-gray-300 hover:bg-gray-100 px-2 space-x-4'>
                <label htmlFor='search'>
                <BsSearch className='bg-[#FAFBFB]'/>
                </label>
                
                <input 
                    type='Search' 
                    name='search' 
                    id='search' 
                    placeholder='Search'
                    className='bg-[#FAFBFB] hover:bg-gray-100  
                    text-[#727376] w-full px-2 py-2 my-1 rounded-sm outline-none'>

                    </input></div>
            <div className='flex space-x-5 justify-around'>
                {HEADER_ICONS.map((item) =><IconDisplay Icon={item.icon} key={item.key} name={item.name} />
                )};
                <button className='bg-[#4CB4F8] px-5 py-2 text-white rounded-lg w-full items-center hover:bg-blue-300' onClick = {handleLogout}>Log Out</button>
            </div>
        </header>
   ) 

}


export default Header;