import { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for toggle
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };
    try {
      const response = await fetch("https://sigmagpt-cw84.onrender.com/api/thread", options);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newthreadId) => {
    setCurrThreadId(newthreadId);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };
    try {
      const response = await fetch(`https://sigmagpt-cw84.onrender.com/api/thread/${newthreadId}`, options);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteThread = async (threadId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };
    try {
      await fetch(`https://sigmagpt-cw84.onrender.com/api/thread/${threadId}`, options);
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <div className="toggle-container">
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <i className={`fa-solid ${isCollapsed ? "fa-bars" : "fa-chevron-left"}`}></i>
        </button>
      </div>

      <div className="sidebar-content">
        <button className="new-chat-btn" onClick={createNewChat}>
          <img src="src/assets/blacklogo.png" alt="logo" className="logo" />
          {!isCollapsed && <span className="btn-text">New Chat</span>}
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li 
              key={idx} 
              onClick={() => changeThread(thread.threadId)} 
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              <i className="fa-regular fa-message"></i>
              {!isCollapsed && <span className="thread-title">{thread.title}</span>}
              {!isCollapsed && (
                <i 
                  onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }} 
                  className="fa-solid fa-trash"
                ></i>
              )}
            </li>
          ))}
        </ul>

        {!isCollapsed && (
          <div className="sign">
            <p>By Parth Khandelwal &hearts;</p>
          </div>
        )}
      </div>
    </section>
  );
}