"use client"

import { createContext } from "react";
import { useReducer } from "react";
import globalReducer from "../reducers/globalReducer";
import {onAuthStateChanged } from "firebase/auth";
import { auth } from '../../lib/firebase';
import { useEffect } from "react";
import useFetchCurrentUser from "@/app/utils/fetchCurrentUsers";


const initialState={
    user: {},
    isAuthenticated: false,
    isOnboarded: false,
    isLoading: false,
    isModalOpen: false,
}

export const GlobalContext = createContext(initialState);
export const GlobalDispatchContext = createContext(null);

const GlobalContextProvider=({children})=>{

    const [state,dispatch]=useReducer(globalReducer,initialState);

    useEffect(()=>{
        
        const {fetchUser}=useFetchCurrentUser();

        const unsubscribe= onAuthStateChanged(auth, async (user) => {
          if (user) {
           
            dispatch ({
             type: 'SET_IS_AUTHENTICATED',
             payload: {isAuthenticated:true},
            })

            const currUser=await fetchUser();

            if(currUser)
            {
                console.log(currUser)
                dispatch({
                    type:"SET_USER",
                    payload: {
                       user: currUser,
                    }

                 })

                 dispatch({
                    type:"SET_IS_ONBOARDED",
                    payload: {
                       isOnboarded: true,
                    }

                 })
            }

          }
        });

        return () => unsubscribe();
    }
    ,[])

    return (
        <GlobalContext.Provider value={state} >
            <GlobalDispatchContext.Provider value={dispatch} >
                {children}
            </GlobalDispatchContext.Provider>
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;