import React, { useEffect, useState } from 'react';
import { IoPersonCircleSharp } from "react-icons/io5";
import './ProfileCard.css';

const ProfileCard = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  // Define the fetch logic
  useEffect(() => {
  // Define it inside to satisfy the dependency array
  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://sigmagpt-cw84.onrender.com/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const res = await response.json();
        setUser({ username: res.username, email: res.email });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  fetchProfileData();
}, []); // Empty array means this only runs once on mount

  // Logic for display
  const username = user.username || "Guest User";
  const email = user.email || "user@sigmagpt.com";

  return (
    <div className="sigma-profile-card">
      <div className="card-body">
        <div className="user-section">
          <div className="avatar-box">
            <IoPersonCircleSharp className="avatar-icon" />
          </div>
          <div className="user-info-stack">
            <span className="user-full-name">{username}</span>
            <span className="user-email-address">{email}</span>
          </div>
        </div>
      </div>
      
      <div className="card-divider"></div>

      <div className="card-footer-status">
        <div className="plan-pill">
          <span className="status-indicator-dot"></span>
          <span className="plan-label">Free Plan</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;