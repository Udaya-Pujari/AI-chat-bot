import { useState } from 'react'
import './App.css'
import ChatHistory from './component/ChatHistory/ChatHistory'
import Loading from './component/Loading/Loading'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSend } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
function App() {
  const [userInput,setUserInput]=useState("")
  const [chatHistory,setChatHistory]=useState([])
  const [isLoading,setIsLoading]=useState(false)

  //initialising the gemini API
  const genAI = new GoogleGenerativeAI("AIzaSyAYG-T-fi2_3JwbcgtKqGSalPbgGxw_eoY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



  //fn to handle user input
  const handleUserInput=(e)=>{
    setUserInput(e.target.value)
  }

  //fn to handle send messge
  const sendMessage=async()=>{
    if(userInput.trim()==="") return
    setIsLoading(true)
    try{
      const result = await model.generateContent(userInput);
      const response=await result.response;
      console.log(response);
      //add the gemini response to chat history
      setChatHistory([...chatHistory,{type:'user',message:userInput},{type:'bot',message:response.text()}])
    }
    catch{
      console.error("ERROR:");
      
    }finally{
        setUserInput("")
        setIsLoading(false)
    }
  
  }

  //fn to clear chat history
  const clearChat=()=>{
    setChatHistory([])
  }


  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-center mb-4'>Gemini Chat Bot</h1>
          <div className='chat-container rounded-lg shadow-md p-4 max-h-[600px] min-h-96 overflow-hidden overflow-y-auto bg-gradient-to-r from-blue-50 to-cyan-50'>
            <ChatHistory chatHistory={chatHistory}/>
            <Loading isLoading={isLoading}/>

          </div>
      <div className='flex mt-4'>
        <input
         type='text'
         className='flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
         placeholder="Type your message here......"
         value={userInput}
         onChange={handleUserInput}
        />
        <button 
        className='flex  px-4 py-2 rounded-lg bg-blue-500 text-white ml-2 hover:bg-blue-600 focus:outline-none'
        onClick={sendMessage}
        disabled={isLoading}
        >Send <IoSend className='ml-2' size={25}/></button>

      </div>
      <button 
      className='flex mt-4   px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none'
      onClick={clearChat}>
        Clear Chat <FaTrash className='ml-2' size={25} />
      </button>

    </div>
  )
}

export default App
