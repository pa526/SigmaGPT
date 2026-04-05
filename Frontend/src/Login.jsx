import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <main className="login-content">
        <div className="login-header">
          {/* Circular Icon like your profile picture in the screenshot */}
          <div className="sigma-logo">Σ</div>
          <h1 className="login-title">Welcome back</h1>
        </div>

        <form className="login-form">
          <div className="input-wrapper">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              autoComplete="email"
              required 
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              autoComplete="current-password"
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