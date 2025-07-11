import Notification from './Notification_user'
import './notification.css'
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";


import profile1 from '../../assets/profile1.png'
import profile2 from '../../assets/profile2.png'
import profile3 from '../../assets/profile3.png'

const NotificationContainer = () => {
  const notifications = [
    {
      profile: profile1,
      title: 'Leave Request',
      message: "@Robert Fox has applied for leave",
      time: "Just Now",
      id: 0,
    },
    {
      profile: profile2,
      title: 'Check In Issue',
      message: "@Alexa shared a message regarding check in issue",
      time: "11:16 AM",
      id: 1,
    },
    {
      title: "Applied job for “Sales Manager” Position",
      message: "@shane Watson has applied for job",
      time: "09:00 AM",
      id: 2,
    },
    {
      profile: profile3,
      title: 'Robert Fox has share his feedback',
      message: "“It was an amazing experience with your organisation”",
      time: "Yesterday",
      id: 3,
    },
    {
      title: "Password Update successfully",
      message: "Your password has been updated successfully",
      time: "Yesterday",
      id: 4,
    },
  ];

  return (
    <div className="container">
  <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar />
      <TopBar/>
      {/* Main layout with Sidebar and content */}
      <div>
        {/* Sidebar */}
        <Sidebar />
  
    <div className='notification-container'>
      <h1 className='notification-title'>Notifications</h1>
      <p className='notification-description'>Dashboard / Notification</p>
      <ul className='notification-list'>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            profile={notification.profile}
            title={notification.title}
            message={notification.message}
            time={notification.time}
          />
        ))}
      </ul>
    </div>
    </div>
    </div>
    </div>
  );
};

export default NotificationContainer;