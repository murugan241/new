import React from "react";
import user from '../../assets/user.png'
import lock from '../../assets/lock.png'
import "./Notification_user.css";

const Notification = ({ profile, title, message, time }) => {
  const renderIcon = () => {
    if (profile) {
      return <img src={profile} alt="Profile" className="notification-profile-image" />;
    }

    const icon = title.includes("Password") ?  <img src={lock} alt="lock"/> : <img src={user} alt="user"/>;
    return <div className="notification-icon">{icon}</div>;
  };

  return (
      <li className="notification-li">
          <div className="notification">
            <div className="notification-details">
              <div>{renderIcon()}</div>
              <div>
                <div className="notification-title">{title}</div>
                <div className="notification-message">{message}</div>
              </div>
            </div>
            <div className="notification-time">{time}</div>
          </div>
          <hr className="notification-border-line"/>
      </li> 
  );
};

export default Notification;