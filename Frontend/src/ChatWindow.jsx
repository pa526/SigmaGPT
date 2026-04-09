import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard.jsx";
import axios from "axios";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setIsAuthenticated,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const navigate = useNavigate();

  // Unified function to get AI response
  // We pass 'messageText' as an argument so STT can trigger it immediately
  const fetchAIReply = async (messageText) => {
    if (!messageText || !messageText.trim()) return;
    
    setLoading(true);
    setNewChat(false);
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        message: messageText,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.error("AI Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Original function for the manual "Send" button and "Enter" key
  const getReply = () => {
    fetchAIReply(prompt);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        handleAudioUpload(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone Error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", blob, "user_speech.wav");

    try {
      const response = await axios.post("http://localhost:8080/api/transcribe", formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data" 
        },
      });

      if (response.data.transcript) {
        const transcriptText = response.data.transcript;
        
        // 1. Show the user what they said in the input box
        setPrompt(transcriptText);

        // 2. IMMEDIATELY send this text to your OpenAI backend
        await fetchAIReply(transcriptText);
      }
    } catch (err) {
      console.error("Transcription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  const handleProfileClick = () => setIsOpen(!isOpen);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>SigmaGPT <i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          {showCard && <ProfileCard />}
          <div className="dropDownItem" onClick={() => setShowCard(!showCard)}>
            <span className="userIcon"><i className="fa-solid fa-user"></i></span>
            Profile
          </div>
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem" onClick={handleLogOut}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat />

      <div className="loaderContainer">
        <ScaleLoader color="#fff" loading={loading} />
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <div 
            className={`micIcon ${isRecording ? "recording" : ""}`} 
            onClick={isRecording ? stopRecording : startRecording}
            style={{ 
              cursor: 'pointer', 
              padding: '0 12px', 
              color: isRecording ? '#ff4b4b' : '#ccc',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fa-solid ${isRecording ? "fa-stop-circle" : "fa-microphone"}`}></i>
          </div>

          <input
            placeholder={isRecording ? "Listening to you..." : "Ask Sigma anything"}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">SigmaGPT can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}