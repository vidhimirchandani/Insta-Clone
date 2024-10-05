'use client'

import { useContext } from "react";
import { GlobalDispatchContext } from "../state/context/GlobalContext";
import { toast } from "react-hot-toast";

const IconDisplay=({Icon,key,name})=>{

    const dispatch=useContext(GlobalDispatchContext);

    //console.log(key);
    const addHandler=()=>{
        if(name === 'Add')
        {
        dispatch({
            type: 'SET_IS_MODAL_OPEN',
            payload: {
                isModalOpen:true,
            }
           });
        }

       
    }

return (
    <div className="hover:bg-gray-200 p-1 hover:cursor-pointer focus:outline-gray-100 transition rounded" onClick={addHandler}>
    <Icon size={25}  />
    </div>
)
}


export default IconDisplay;