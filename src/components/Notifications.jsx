import React from "react";

function Notifications() {
  // Static list of notifications
  const staticNotifications = [
    { id: 1, message: "New feedback has been posted." },
    { id: 2, message: "System maintenance scheduled for tomorrow." },
    { id: 3, message: "Welcome to the barangay management system!" },
  ];

  return (
    <div>
      <h2>Notifications</h2>
      {staticNotifications.length > 0 ? (
        <ul>
          {staticNotifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
}

export default Notifications;