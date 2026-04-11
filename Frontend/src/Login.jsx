import React from 'react';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './MyContext';

const Login = ({setIsAuthenticated}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleFormData = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(formData),
        };
        try {
            const response = await fetch("https://sigmagpt-cw84.onrender.com/login", options);
            const data = await response.json();
            if(data.token) {
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                navigate("/chat");
            }
        } catch(err) {
            console.log(err);
        }
    }

  return (
    <div className="login-container">
      <main className="login-content">
        <div className="login-header">
          {/* Circular Icon like your profile picture in the screenshot */}
          <div className="sigma-logo">Σ</div>
          <h1 className="login-title">Welcome back</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              name='email'
              value={formData.email}  
              onChange={handleFormData}  
              required 
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              name='password'
              value={formData.password}  
              onChange={handleFormData}  
              required 
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>

        <footer className="login-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </footer>
      </main>
      
      {/* Footer text similar to your screenshot footer */}
      <div className="login-disclaimer">
        SigmaGPT can make mistakes. Check important info.
      </div>
    </div>
  );
};

export default Login;