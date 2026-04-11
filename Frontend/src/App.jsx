import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

// Components
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/chat" replace />
            )
          }
        />

        {/* Signup Route */}
        <Route 
          path="/signup" 
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to="/chat" replace />
            )
          } 
        />

        {/* Protected Chat Route */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <MyContext.Provider value={providerValues}>
                <div className="app">
                  <Sidebar />
                  <ChatWindow />
                </div>
              </MyContext.Provider>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />
        
        {/* Catch-all for any other broken links */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;