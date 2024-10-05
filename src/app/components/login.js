"use client"
import React, { useState } from 'react'
import Lottie from 'react-lottie-player'
import authJson from '../../../public/animation.json'
import Button from '../UI/button';
import { AiFillFacebook } from 'react-icons/ai';
import { useContext } from 'react';
import {GlobalContext, GlobalDispatchContext} from '../state/context/GlobalContext';
import { auth,db } from '../lib/firebase';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDocs, setDoc, collection, query, where, serverTimestamp } from "firebase/firestore";
import {BiLoaderCircle} from 'react-icons/bi';
import {handlePromise} from '../utils/handlePromise';
import toast, { Toaster } from 'react-hot-toast';

const Login=()=>{

   const {isAuthenticated, isOnboarded, user, isLoading}=useContext(GlobalContext);

   const dispatch=useContext(GlobalDispatchContext);

   
   const [isLoginForm,setIsLoginForm]=useState(true);

   const [isDisabled,setIsDisabled]=useState(false);

   
   let err=null;
   const [form,setForm]=useState({
      email:'',
      password:'',
   });

   const [onboardingForm,setOnboardingForm]=useState({
      username:'',
      fullname:'',
   });

   const onChangeHandler=(e)=>{

      setForm((prevState)=>({
         ...prevState,
         [e.target.name]:e.target.value
      }));

      // console.log(form);

   }

   const onOnboardingChangeHandler=(e)=>{
      setOnboardingForm((prevState)=>({
         ...prevState,
         [e.target.name]:e.target.value
      }));

   }


       const formSubmitHandler=async (e)=>{
             e.preventDefault();
             console.log(e);
               
              dispatch({
               type: 'SET_LOADING',
               payload: {
                  isLoading: true,
               }
              });



              

              const authenticate=async ()=>{
             if(isLoginForm)
             {
                 
               // You can use the await keyword on its own (outside of an async function) at the top level of a module. This means that modules with child modules that use await will wait for the child modules to execute before they themselves run, all while not blocking other child modules from loading.- (all confusion removed)

                 const [data,loginError]=await handlePromise(signInWithEmailAndPassword(auth,form.email,form.password));
                 
                 err=loginError;
                 console.log(auth.currentUser);
             }
             else
             {
                const [data,signupError]=await handlePromise(createUserWithEmailAndPassword(auth,form.email,form.password));
                if(signupError) err=signupError;
             }
            }


           const fetchUser = async()=>{


                 const currentUserRef = doc(db, "user", auth.currentUser.email);
                 const currentUserSnap = await getDocs(currentUserRef);

                    if (currentUserSnap.exists()) {
                      
   
                     dispatch({
                        type:"SET_USER",
                        payload: {
                           user: currentUserSnap.data(),
                        }

                     })

                     dispatch({
                        type:"SET_IS_ONBOARDED",
                        payload: {
                           isOnboarded: true,
                        }

                     })
                    } else {
  // docSnap.data() will be undefined in this case
                     toast.error("User Not Onboarded");
                     setTimeout(()=>{toast("Redirected to Onboarding Form")}, 1000);
                     
                    }

            }


            await authenticate();


            if(!err)
            await fetchUser();
            else
            toast.error(err.message);
            
             
             dispatch({
               type: 'SET_LOADING',
               payload: {
                  isLoading: false,
               }
              });

              if(err!==null)
              {
               toast.error('This is an error!'+err.message);

              }
              else
              {
               toast.success('Successfully done!');
              }

              // resetForm();

              

       }


       
         const setUserData = async () => {
            try {
              const userCollection = collection(db, 'user');
        
              const userQuery = query(
                userCollection,
                where('username', '==', onboardingForm.username)
              );
        
              const usersSnapshot = await getDocs(userQuery);
        
              if (usersSnapshot.docs.length > 0) {
                toast.error('username already exists');
                return;
              }
        
              await setDoc(doc(db, 'user', auth.currentUser.email), {
                fullName: onboardingForm.fullname,
                username: onboardingForm.username,
                email: auth.currentUser.email,
                id: auth.currentUser.uid,
                createdAt: serverTimestamp(),
              });


              dispatch({
               type:"SET_IS_ONBOARDED",
               payload: {
                  isOnboarded: true,
               }

            })
            
              toast.success('welcome to instagram clone by Roob88257');
 
         

       }
       catch(e) {
                toast.error(e.message);
               //  toast.success("Finally resolved the error");
               console.log(e);
       }

       }

       const onboardingFormSubmitHandler=async(e)=>{

         e.preventDefault();

         console.log(e);

         dispatch({
            type: 'SET_LOADING',
            payload: {
               isLoading: true,
            }
           });

         await setUserData();

         dispatch({
            type: 'SET_LOADING',
            payload: {
               isLoading: false,
            }
           });


           console.log(user);

          
       }

    return(
        <div className="w-screen h-screen flex items-center justify-center bg-[#FEFEFF]">

             <div className="flex w-4/5 h-4/5">
                  <div className="w-full h-full">
                     <Lottie
                    loop
                    animationData={authJson}
                    play
                    className='w-full h-full'
                     />
   
                   </div>
                   
                   
                   <div className='w-full items-center justify-center flex flex-col space-y-4'>
                   
                  <div className="relative w-2/3 bg-white border border-gray-300 p-10">
                  { isLoading && 
                  <div className='bg-black bg-opacity-10 w-full h-full flex items-center justify-center absolute inset-0 z-1'>
                    <BiLoaderCircle size={40} className='animate-spin' />
                    </div>
                  }

                  { !isAuthenticated  && (
                  <form onSubmit={formSubmitHandler} className='flex flex-col justify-center items-center space-y-5'>
                     <div className='tracking-wider text-5xl my-5'>Instagram</div>
                    <input 
                    placeholder='Phone number, username, or email' 
                    type='email' 
                    name='email' 
                    id='mail' 
                    onChange={onChangeHandler}
                    className='bg-[#FAFBFB] hover:bg-gray-100 focus:bg-transparent outline-gray-300 w-full px-2 py-3 rounded-sm'>
                    </input>
                    
                    <input 
                    type='Password' 
                    name='password' 
                    id='password' 
                    placeholder='Password'
                    value={form.password}
                    onChange={onChangeHandler}
                    className='bg-[#FAFBFB] hover:bg-gray-100 focus:bg-transparent outline-gray-300 text-[#727376] w-full px-2 py-3 rounded-sm'>

                    </input>

                     {isLoginForm ? <Button>Log in</Button>: <Button>Sign Up</Button>}
                </form> )  }

                { isAuthenticated && !isOnboarded &&
                <form onSubmit={onboardingFormSubmitHandler} className='flex flex-col justify-center items-center space-y-5'>
                     <div className='tracking-wider text-5xl my-5'>Instagram</div>
                    <input 
                    placeholder='Username' 
                    type='username' 
                    name='username' 
                    id='username' 
                    onChange={onOnboardingChangeHandler}
                    className='bg-[#FAFBFB] hover:bg-gray-100 focus:bg-transparent outline-gray-300 w-full px-2 py-3 rounded-sm'>
                    </input>
                    
                    <input 
                    type='fullname' 
                    name='fullname' 
                    id='fullname' 
                    placeholder='Fullname'
                    onChange={onOnboardingChangeHandler}
                    className='bg-[#FAFBFB] hover:bg-gray-100 focus:bg-transparent outline-gray-300 text-[#727376] w-full px-2 py-3 rounded-sm'>

                    </input>

                     <button 
                     className='bg-[#4CB4F8] px-5 py-2 text-white rounded-lg w-full items-center hover:bg-blue-300'
                     type='submit'
                     disabled={onboardingForm.username===''||onboardingForm.fullname===''}
                     >Submit</button>
                </form>}

                  <div className='flex items-center justify-center my-8 space-x-2'>
                  <div className='h-[0.8px] w-full bg-slate-400'/>
                  <div className='text-gray-400 text-center'>OR</div>
                  <div className='h-[0.8px] w-full bg-slate-400'/>
                  </div>
                  <div className='w-full text-center flex items-center justify-center text-indigo-900'>
                     <AiFillFacebook size={25} className='inline-block text-2xl mr-2 '/>
                     <span className='font-semibold text-sm'>{isLoginForm ? 'Log in' : 'Sign Up'} with Facebook</span>
                  </div>
                  <div className='text-sm font-medium text-center text-indigo-900 mt-3 ml-5'>
                     {isLoginForm? 'Forgotten your password':''}
                     </div> 
                  </div>
                   <div className="w-2/3 bg-white border border-gray-300 p-10 text-sm space-y-5 flex items-center justify-center">
                    {!isLoginForm ? 'Already have an account?' : "Don't have an account?" } 
                    <button className='text-blue-600 ml-2 font-semibold' onClick={()=>{setIsLoginForm(!isLoginForm)}}>
                     {!isLoginForm ? 'Login' : 'Sign up'}
                     </button> 
                  
                   </div>

                  </div>
            </div>
                   
    </div>

    )
}


export default Login;