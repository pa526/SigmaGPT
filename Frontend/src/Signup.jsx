import React from 'react';
import './Signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleFormData = (e) => {
        setFormData(() => ({...formData, [e.target.name]: e.target.value}));
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
            const response = await fetch("http://localhost:8080/signin", options);
            const data = await response.json();
          
            if(data.token) {
                localStorage.setItem("token", data.token);

                navigate("/chat");
            }

        } catch(err) {
            console.log(err);
        }
    }

  return (
    <div className="signup-container">
      <main className="signup-content">
        <div className="signup-header">
          {/* Circular Icon matching your SigmaGPT profile style */}
          <div className="sigma-logo">Σ</div>
          <h1 className="signup-title">Create your account</h1>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Pick a username" 
              name='username'
              value={formData.username}
              onChange={handleFormData}
              required 
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
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
              placeholder="Create a password" 
              name='password'
              value={formData.password}
              onChange={handleFormData}
              required 
            />
          </div>

          <button type="submit" className="create-btn">
            Create account
          </button>
        </form>

        <footer className="signup-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </footer>
      </main>
    </div>
  );
};

export default Signup;