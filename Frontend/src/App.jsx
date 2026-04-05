import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyContext } from './MyContext';
import { useState } from 'react';
import {v1 as uuidv1} from 'uuid';

//Components
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';
import Login from './login';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of our curr threads 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
  };

  return (
    <Router>
      <Routes>
        {/* 1. Auth Routes: These show ONLY the specific component */}
        <Route path="/login" element={<Login />} />

        {/* 2. Main App Route: Shows Sidebar + ChatWindow */}
        <Route 
          path="/chat" 
          element={
            <div className='app'>
              <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
              </MyContext.Provider>
            </div>
          } 
        />

        {/* 3. Redirect: If user hits root "/", send to login or chat */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App
