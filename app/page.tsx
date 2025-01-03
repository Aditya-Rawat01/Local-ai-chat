"use client"

import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SendIcon } from "./SendIcon"

export default function Home() {
  const [inputData,setInputData]=useState<String>('')
  const comeInView=useRef<HTMLDivElement>(null)
  const comeInViewText=useRef<HTMLDivElement>(null)
  const [messages,setMessages]=useState([{type:"user",message:"hey gemini"},{type:"ai",message:"hey how can i help you"}])
  const {data, isPending, mutate}=useMutation({
    mutationFn:fetcher
  })
  async function fetcher() {
    comeInView.current?.scrollIntoView()
    const response=await axios.post("http://localhost:3000/api",{prompt:inputData as string,history:messages.slice(-11)})
    // // remember last 11 messages (only works for odd numbers as even numbers will give the first message role as model which gives error) 
    
    setMessages((prev)=>[...prev,{type:"ai", message:response.data.msg}])
    comeInViewText.current?.scrollIntoView()
    return response.data.msg
  }
  function Ai(e:React.KeyboardEvent<HTMLInputElement>) {
    if (e.key==="Enter") { 
      mutate();
      
       setMessages((prev)=>[...prev,{type:"user", message:inputData as string}])
       setInputData('')
      
    }
  }
 
  return (
    <div className="w-screen h-screen">
    <div className="w-screen bg-white bg-opacity-15 fixed z-10 top-0 left-0  rounded-b-lg h-12 flex items-center justify-center text-3xl">
      <p className="bg-gradient-to-r from-amber-500 to-pink-500 text-transparent bg-clip-text font-medium">Gemini</p>
    </div>
    <div className="w-screen absolute bg-gradient-to-r from-red-500 to-indigo-600 min-h-[100vh] pt-12 pb-20 ">
    {messages?.map((info:any,index) => {
  if (info.type === "user") {
    return <div key={index} className="w-screen flex items-center justify-end p-5 min-h-12">
      <div className="w-64 max-w-80 p-3 bg-stone-100 text-black rounded-3xl rounded-tr-none">{info.message}</div>
  </div>
  }
  else return <div key={index} ref={comeInViewText} className="w-screen flex items-center justify-start p-5 min-h-12">
  <div className="w-fit max-w-[400px] p-3 bg-blue-700 text-white rounded-3xl rounded-tl-none">{info.message}</div>
</div>
})}
     {isPending && <div className="pl-3" ref={comeInView}><Skeleton className="w-[400px] h-[200px] rounded-3xl rounded-tl-none"/></div>}
    </div>
    <div className="fixed bottom-0 w-screen h-20 flex justify-center items-center">
      <input  className="w-5/6 h-[90%] p-8 pr-20 text-black text-lg focus:outline-none placeholder:text-slate-800 placeholder:text-base rounded-full" type="text" placeholder="Send Messages!" value={inputData as string} onChange={e=>setInputData(e.target.value as string)} onKeyDown={(e)=>Ai(e)} disabled={isPending}/>
      
        <div className="bg-slate-800 hover:cursor-pointer  rounded-full p-2 absolute right-[10%]"><SendIcon/></div>
      
    </div>
    </div>
    )
}
