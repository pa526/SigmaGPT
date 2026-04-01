import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import { MyContext } from './MyContext'
import { useState } from 'react';
import {v1 as uuidv1} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
  };
  
  return (
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
        <Sidebar />
        <ChatWindow/>
      </MyContext.Provider>
    </div>
  )
}

export default App
