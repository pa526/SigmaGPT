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

  const getReply = () => fetchAIReply(prompt);

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
        setPrompt(response.data.transcript);
        await fetchAIReply(response.data.transcript);
      }
    } catch (err) {
      console.error("Transcription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="chatWindow">
      <nav className="navbar">
        <div className="logo-group">
          <span className="logo">SigmaGPT</span>
        </div>
        <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </nav>

      {isOpen && (
        <div className="dropDown">
          {showCard && <ProfileCard />}
          <div className="dropDownItem" onClick={() => setShowCard(!showCard)}>
            <i className="fa-solid fa-circle-user"></i> Profile
          </div>
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem logout" onClick={handleLogOut}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <main className="chatArea">
        <Chat />
        {loading && (
          <div className="loaderContainer">
            <ScaleLoader color="#4b90ff" height={20} margin={2} />
          </div>
        )}
      </main>

      <footer className="chatInputSection">
        <div className="gemini-input-wrapper">
          <div className={`input-pill ${isRecording ? "recording-pulse" : ""}`}>
            <input
              placeholder={isRecording ? "Listening..." : "Enter a prompt here"}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />
            
            <div className="action-icons">
              <button 
                className={`icon-btn mic-btn ${isRecording ? "active" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
                title="Use microphone"
              >
                <i className={`fa-solid ${isRecording ? "fa-stop" : "fa-microphone"}`}></i>
              </button>
              
              <button 
                className={`icon-btn send-btn ${prompt.trim() ? "visible" : ""}`}
                onClick={getReply}
                disabled={!prompt.trim()}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
          <p className="disclaimer">SigmaGPT may display inaccurate info, so double-check its responses.</p>
        </div>
      </footer>
    </div>
  );
}