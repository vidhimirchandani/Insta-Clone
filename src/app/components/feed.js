"use client"
import Header from './header.js'
import Story from './story.js'
import Post from './post.js'
import Modal from '../Modal/index.js'
import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext, GlobalDispatchContext } from '../state/context/GlobalContext.js'
import { db, storage } from '../lib/firebase.js'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-hot-toast'
import { uuidv4 } from '@firebase/util';;
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'

const Feed=()=>{

// const [isOpen,setIsOpen]=useState(false);



const {isModalOpen,user}=useContext(GlobalContext);


   const dispatch=useContext(GlobalDispatchContext);

   const closeModal=()=>{

    dispatch({
        type: 'SET_IS_MODAL_OPEN',
        payload: {
            isModalOpen:false,
        }
       });
   }
   
   const [file,setFile]=useState(null);
   const [media,setMedia]=useState({
    src:'',
    isUploading:false,
    caption: ' ',

   })

   const reader = new FileReader();

   useEffect(()=>{
          

    const handleEvent=(event)=>{
        switch (event.type) {
            case 'load':
                setMedia((prevState)=>({
                    ...prevState,
                    src: reader.result,
                }))
                  break ;
            case 'error':
                console.log(event);
                return toast.error("Error in setting the image");
            default:
                break;           

        }
    }

    if(file)
    {
        reader.addEventListener("load", handleEvent);
        reader.addEventListener("error", handleEvent);

        reader.readAsDataURL(file);

    }
    
     return ()=>{

        reader.removeEventListener("load", handleEvent);
        reader.removeEventListener("error", handleEvent);
     }
   },[file])


   const currentImage=useRef(null);

   const handlePostToDb=async(url)=>{

    const postId=uuidv4();
    const postRef=doc(db,"posts",postId);

    const post={
        id:postId,
        image:url,
        caption:(media.caption||" "),
        username:user.username,
        createdAt:serverTimestamp(),
    }
               try {
                await setDoc(postRef,post);
                toast.success("synced to databse");
               } catch (error) {
                toast.error(error.message);

               }

   }

   const handleUploadPost=async ()=>{

    if(!file)
     return    toast.error("Please select a file");

      console.log(file);
     setMedia((prevState)=>({
        ...prevState,
        isUploading:true,
     }));

     const toastId= toast.loading("Please wait uploading the post");

     const storageRef=ref(storage,  `posts/${uuidv4()}-${file.name}`);


     try {
        const uploadTask = await uploadBytes(storageRef, file);

        const url=await getDownloadURL(uploadTask.ref);

        handlePostToDb(url);

        console.log(url);
        toast.success("Post Uploaded Successfully",{
            id:toastId
        });

     } catch (error) {

        // console.log(error);
        toast.error(error.message,{
            id:toastId
        });
        
     } finally{
        setMedia({
            src:'',
            isUploading:false
        });

        setFile(null);
    currentImage.current.src = null;

    closeModal();

    }
   }

   const handleRemovePost=()=>{
    setFile(null);
    currentImage.current.src = null;
   }

   const [posts,setPosts]=useState([]);
   const [loading,setLoading]=useState(false);


   useEffect(() => {

    setLoading(true);
    const postsCollection=collection(db,"posts");
    const q=query(postsCollection,orderBy('createdAt','desc'));
    onSnapshot(q,(snapshot)=>{
       const posts=snapshot.docs.map((doc)=>doc.data());
       setPosts(posts);
       setLoading(false);
    })


  
   }, [])

   console.log(posts);

return(
    <div className="w-screen h-screen bg-[#FEFEFF]">
        <Header></Header>

        <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="w-screen h-screen max-w-3xl max-h-[70vh] flex flex-col items-center border-white">
          <div className="w-full py-4 text-xl font-semibold text-center border-b border-black">
            Create new post
          </div>
          <div className="flex items-center justify-center w-full h-full">
           {!file && <label for="post" className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition  disabled:bg-opacity-50 select-none cursor-pointer disabled:scale-100 rounded text-sm font-semibold">
            Select From Computer
            </label>}
            <input 
            type='file' 
            id='post' 
            placeholder='Select a file' 
            className='hidden'
           
            onChange={(e)=>{setFile(e.target.files[0]);}}
            multiple={false}
            accept='image/jpeg image/png'
            />
            <div className='flex flex-col p-5 gap-y-4'>
            {
                file && 
                <>
                <input type='image' src={media.src} ref={currentImage} className='h-80'/>  
                <input 
                type='text' 
                name='caption' 
                placeholder='Enter a caption' 
                onChange={(e)=>{setMedia((prevState)=>({...prevState, caption: e.target.value}))}} 
                value={media.caption}
                 className='w-full px-2 py-4 bg-gray-100 border rounded outline-none hover:bg-transparent focus:bg-transparent focus:border-gray-400'/>
                <button className='bg-[#4CB4F8] px-5 py-2 text-white rounded-lg w-full items-center hover:bg-blue-300'   onClick={handleUploadPost}>Upload</button>
                <button className='bg-[#4CB4F8] px-5 py-2 text-white rounded-lg w-full items-center hover:bg-blue-300' onClick={handleRemovePost}>Remove</button>      
                </>
            }
            </div>
          </div>

                 </div>

        </Modal>
        <div className='grid grid-cols-3 space-x-10 mx-auto mt-20 max-w-screen-lg h-full '>
            <div className='col-span-2 flex flex-col space-y-8'>
                <Story/>
                {
                posts.map((data)=>(
                     <Post param={data}/>
                ))
                }
            </div>
            <div className='col-span-1 fixed right-[15%] max-w-sm'>
                <div className='flex'>
                </div>
            </div>
        </div>
    </div>
)
};

export default Feed;
