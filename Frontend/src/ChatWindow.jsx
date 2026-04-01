import './ChatWindow.css';
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext } from 'react';

export default function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId} = useContext(MyContext);

    const getReply = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",           
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className='chatWindow'>
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv">
                    <span className='userIcon'><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            <Chat></Chat>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder='Ask anything' value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? getReply() : ""}></input>
                    <div id='submit' onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    );
};