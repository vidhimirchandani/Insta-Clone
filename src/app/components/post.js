"use client"
import { uuidv4 } from '@firebase/util';
import {BsThreeDots} from 'react-icons/bs'
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'
import {FaRegComment} from 'react-icons/fa'
import {PiShareFatBold} from 'react-icons/pi'
import {BsBookmark} from 'react-icons/bs'
import {BsEmojiSmile} from 'react-icons/bs'
import Button from '../UI/button'
import { useContext, useEffect, useRef, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { GlobalContext } from '../state/context/GlobalContext'

const Post=({param})=>{

    const [isLiked,setIsLiked]=useState(false);
    const [comments, setComments] = useState([]);
     
    let likesCount=param.likesCount;
    
    const handleLikePost=async ()=>{

        // setIsLiked(prevState=>!prevState);
 
           const postLike={
            postId:param.id,
            userId:auth.currentUser.uid,
            username:param.username,
           }

           const likeRef=doc(db,`likes/${postLike.postId}_${postLike.userId}`)
           const postRef = doc(db, `posts/${param.id}`);

           try 
           {
            let updatedLikesCount;

    if (isLiked) {
      await deleteDoc(likeRef);
      if (likesCount) {
        updatedLikesCount = likesCount - 1;
      } else {
        updatedLikesCount = 0;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    } else {
      await setDoc(likeRef, postLike);
      if (likesCount) {
        updatedLikesCount = likesCount + 1;
      } else {
        updatedLikesCount = 1;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    }
   }
           catch(err) 
           {
             toast.error("Error in posting: " + err.message);
           }

           

    }

    useEffect(()=>{

        const likesRef = collection(db, 'likes');
    const likesQuery = query(
      likesRef,
      where('postId', '==', param.id),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribeLike = onSnapshot(likesQuery, (snapshot) => {
        const like = snapshot.docs.map((doc) => doc.data());
        if (like.length !== 0) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });

        const commentsRef = collection(db, `posts/${param.id}/comments`);
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map((doc) => doc.data());
      setComments(comments);
    });

    return () => {
      unsubscribeLike();
      unsubscribeComments();
    };

    }, [param.id])


    
  

  const comment = useRef(null);

  const { user } = useContext(GlobalContext);

  const handlePostComment = async (e) => {
    e.preventDefault();
    // comment functionality
    const commentData = {
      id: uuidv4(),
      username: user.username,
      comment: comment.current.value,
      createdAt: serverTimestamp(),
    };
    comment.current.value = '';
    const commentRef = doc(db, `posts/${param.id}/comments/${commentData.id}`);
    await setDoc(commentRef, commentData);
  };


    return (
        <div className='flex flex-col max-h-100 border-gray-100'>
                   <div className='flex justify-between border border-gray-100 p-2'>
                    <div className='flex border-gray-100 space-x-2'>
                       <div className='rounded-full bg-black ring-2 ring-pink-400 ring-offset-2 w-6 h-6'/>
                       <div>{param.username}</div>
                   </div>
                       <div className='w-5'><BsThreeDots/></div>
                   </div>
                   <img src={param.image}  className='w-full h-full bg-black' />
                   <div className='justify-between flex py-2 px-3'>
                        <div className='flex space-x-3'>
                            {!isLiked ? <div size={30} onClick={handleLikePost}  className='text-black-50 hover:text-red-300'><AiOutlineHeart/></div> :
                            <div size={30} onClick={handleLikePost} className='text-red-500 hover:text-red-500'><AiFillHeart/></div>}
                            <div size={30}><FaRegComment/></div>
                            <div size={30}><PiShareFatBold/></div>
                        </div>
                        <div size={30}><BsBookmark/></div>
                   </div>
                   <div className="px-2">
        {likesCount ? `${likesCount} likes` : 'Be the first to like'}
      </div>
                   <div className='px-2'>{param.caption}</div>
                   <div className='space-y-1'>
                {comments.map((commentData) => (
                    <div key={commentData.id} className="flex space-x-2">
                      <div className="font-medium">{commentData.username}</div>
                      <div>{commentData.comment}</div>
                    </div>
                  ))}
                   </div>
                   <div className='px-2 py-1'>3 Hours Ago</div>
                   <form onSubmit={handlePostComment} className='flex space-x-3 py-2'>
                   <div className='flex flex-row space-x-3 w-full border-t border-gray-100'>
                    <div className='py-3'><BsEmojiSmile/></div>
                    <div className='w-full'>
                        <input
                        type="text"
                        name={`comment ${param.id}`}
                        id={`comment ${param.id}`}
                        className="w-full bg-white outline-none"
                        placeholder="Add a comment..."
                        ref={comment}
                        />
                    </div>
                   <button className='text-blue-600 font-semibold py-2'>Post</button>
                   </div>
                   </form>
                </div>
    )

}

export default Post;
