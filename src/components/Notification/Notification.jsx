import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { TfiLocationArrow } from "react-icons/tfi";
import { IoMdSend } from "react-icons/io";
import { MdOutlineDrafts } from "react-icons/md";
import './Notification.css';

const NotificationPage = ({user_id }) => {
  //const location = useLocation();
  //const { user_id } = location.state || {}; // If `user_id` is not available, handle gracefully
  const [notifications, setnotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [newnotification, setNewnotification] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [currentReply, setCurrentReply] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientOptions] = useState(['הורה 1', 'הורה 2', 'הנהלה', 'מורה מקצועי']);

  useEffect(() => {
    console.log(user_id)
    if (user_id) {
      // Fetch notifications from an API
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:8000/notifications/${user_id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
          const data = await response.json();
          // Ensure data is wrapped in an array
          const formattednotifications = Array.isArray(data) ? data : [data];
          console.log('Fetched notifications:', formattednotifications); // Debugging log
          setnotifications(formattednotifications); // Set the fetched notifications
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [user_id]); // Include user_id in the dependency array

  // Toggle notification resolved state
  const toggleResolved = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/notifications/${id}/mark_resolved`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark as resolved/unresolved');
      }

      // After marking the notification as resolved, refetch the notifications to update the state
      const updatednotifications = await fetch(`http://localhost:8000/notifications/${user_id}`);
      if (!updatednotifications.ok) {
        throw new Error('Failed to fetch updated notifications');
      }
      const data = await updatednotifications.json();
      // Ensure data is wrapped in an array
      const formattednotifications = Array.isArray(data) ? data : [data];
      console.log('Updated notifications:', formattednotifications); // Debugging log
      setnotifications(formattednotifications); // Update the state with new notifications
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Open reply modal
  const openReplyModal = (notification) => {
    setCurrentReply(notification);
    setReplyContent('');
    setIsReplyModalOpen(true);
  };

  // Send reply
  const sendReply = () => {
    if (replyContent.trim() !== '') {
      alert(`תשובתך נשלחה להודעה מ-${currentReply.sent_by_name}: ${replyContent}`);
      setReplyContent('');
      setIsReplyModalOpen(false);
    } else {
      alert('אנא כתוב תשובה לפני שליחה.');
    }
  };

  return (
    <div className="notification-container">
      <header className="notification-header">
        <h1>הודעות</h1>
      </header>

      <main className="notification-main">
      

      {notifications.length === 0 ? (
  <div className="empty-notification">
    <MdOutlineDrafts className="empty-envelope-icon" size={24} color='#3f3939' />
    <p>אין הודעות להצגה</p>
  </div>
)
: (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.notification_id} className={`notification-item ${notification.is_resolved ? 'resolved' : ''}`}>
                <div className="notification-card">
                  <div className="notification-header">
                    <strong>מאת:</strong> {notification.sent_by_name}
                    <span className="notification-subject">{notification.subject}</span>
                  </div>
                  <p className="notification-content">{notification.message}</p>
                  <div className="notification-actions">
                    <button
                      onClick={() => toggleResolved(notification.notification_id)}
                      className={`action-button ${notification.is_resolved ? 'unresolved' : 'resolved'}`}
                    >
                      {notification.is_resolved ? 'טופל' : 'לא טופל'}
                    </button>
                    <button
                      onClick={() => openReplyModal(notification)}
                      className="action-button reply"
                    >
                      תשובה
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => setIsModalOpen(true)} className="new-notification-button">
             הודעה חדשה        <  IoMdSend size={20}  style={{ transform: 'rotate(180deg)' }} />
        </button>
      </main>

      {/* Modal for new notification */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
          <header className="new-notification-header">

            <h2>הודעה חדשה</h2>
            </header>
            <textarea
              className="textarea"
              value={newnotification}
              onChange={(e) => setNewnotification(e.target.value)}
              placeholder="כתוב את ההודעה כאן..."
            ></textarea>
            <div className="recipients-scroll">
              <h3>נמענים:</h3>
              <div className="recipient-options">
                {recipientOptions.map((recipient) => (
                  <label key={recipient}>
                    <input
                      type="checkbox"
                      value={recipient}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRecipients([...recipients, recipient]);
                        } else {
                          setRecipients(recipients.filter((r) => r !== recipient));
                        }
                      }}
                    />
                    {recipient}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (newnotification && recipients.length > 0) {
                    alert('ההודעה נשלחה בהצלחה');
                    setNewnotification('');
                    setRecipients([]);
                    setIsModalOpen(false);
                  } else {
                    alert('אנא כתוב הודעה ובחר נמענים לפני שליחה.');
                  }
                }}
                className="action-button send"
              >
                שלח
              </button>
              <button onClick={() => setIsModalOpen(false)} className="action-button cancel">
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for reply */}
      {isReplyModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>תשובה להודעה</h2>
            <p>
              <strong>נמענ/ת:</strong> {currentReply?.sent_by_name}
            </p>
            <textarea
              className="textarea"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="כתוב את תשובתך כאן..."
            ></textarea>
            <div className="modal-actions">
              <button onClick={sendReply} className="action-button send">
                שלח
              </button>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="action-button cancel"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
