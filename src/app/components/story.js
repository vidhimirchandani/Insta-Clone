"use client"

const Story=()=>{
return (
    <div className='p-3 bg-white border border-gray-100 flex space-x-4 overflow-x-auto '>
                    {
                        new Array(15).fill(0).map((id)=>(
                            <div key={id} className='bg-black rounded-full flex-none w-20 h-20 ring ring-2 ring-pink-400 ring-offset-2'>
                                
                                </div>
                        ))
                    }
                </div>
)
}

export default Story;