import React from "react";
import "./Signin.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signin = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      // Note: Kept your /signin endpoint as per original logic
      const response = await fetch(
        "https://sigmagpt-cw84.onrender.com/signin",
        options,
      );
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/chat");
      } 
    } catch (err) {
      console.error("Signup error:", err);
      alert("Email or Password is incorrect");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <header className="auth-header">
          <div className="auth-logo">Σ</div>
          <h1 className="auth-title">Create account</h1>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleFormData}
              required
              autoComplete="username"
            />
          </div>

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
              autoComplete="email"
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleFormData}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn">
            Continue
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </footer>
      </div>
    </div>
  );
};

export default Signin;
