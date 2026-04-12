import React from 'react';
import './Login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };
    try {
      const response = await fetch("https://sigmagpt-cw84.onrender.com/login", options);
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/chat");
      } else {
        alert("Email or Password is incorrect");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log("Login failure:", err);
      alert("Email or Password is incorrect");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <header className="auth-header">
          <div className="auth-logo">Σ</div>
          <h1 className="auth-title">Welcome back</h1>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleFormData}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleFormData}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Continue
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </footer>
      </div>
    </div>
  );
};

export default Login;