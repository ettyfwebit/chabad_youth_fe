import React, { useState, useEffect } from 'react';
import { IoMdSend } from "react-icons/io";
import { MdOutlineDrafts } from "react-icons/md";
import './SecretaryNotification.css';
import { FaCheck, FaFlag, FaReply, FaShare, FaTimes } from 'react-icons/fa';

const SecretaryNotification = ({ user_id }) => {
    //const location = useLocation();
    //const { user_id } = location.state || {}; // If `user_id` is not available, handle gracefully
    const [notifications, setnotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [newnotification, setNewnotification] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [currentReply, setCurrentReply] = useState(null);
    const [recipients, setRecipients] = useState([]);
    const [recipientOptions] = useState(['מזכירות', 'מנהל סניף', 'הורה']);
    const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
    const [forwardReason, setForwardReason] = useState('');
    const [currentForward, setCurrentForward] = useState(null);

    // פונקציה לפתיחת מודל העברה
    const openForwardModal = (notification) => {
        setCurrentForward(notification);
        setForwardReason('');
        setIsForwardModalOpen(true);
    };

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
    const sendReply = async () => {
        if (replyContent.trim() !== '') {
            try {
                const response = await fetch("http://localhost:8000/notifications/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: replyContent,
                        sent_by: user_id,  // ה-user_id של השולח
                        user_ids: [currentReply.sent_by],  // נשלח את ה-user_id של מקבל ההודעה
                        reply_to_notification_id: currentReply.notification_id, // הוספת מזהה ההודעה שהתגובה היא לה
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(`תשובתך נשלחה להודעה מ-${currentReply.sent_by}: ${replyContent}`);
                    setReplyContent('');
                    setIsReplyModalOpen(false);
                } else {
                    const error = await response.json();
                    alert(`שגיאה בשליחת התשובה: ${error.detail}`);
                }
            } catch (error) {
                console.error("Error sending reply:", error);
                alert("שגיאה בלתי צפויה בשליחת התשובה.");
            }
        } else {
            alert('אנא כתוב תשובה לפני שליחה.');
        }

    };
    const forwardToBranchManager = async (parentId) => {

        try {
            // שליפת הילד הראשון של ההורה
            const childResponse = await fetch(`http://localhost:8000/children/${parentId}/first`);
            if (!childResponse.ok) {
                throw new Error("Failed to fetch the first child for the parent.");
            }
            const childData = await childResponse.json();
            const branchManagerId = childData.branch_manager_id;

            if (!branchManagerId) {
                alert("אין מנהל סניף מוגדר עבור הילד.");
                return;
            }

            // שליפת ה-login_user_id של מנהל הסניף
            const managerResponse = await fetch(`http://localhost:8000/branch_managers/${branchManagerId}`);
            if (!managerResponse.ok) {
                throw new Error("Failed to fetch branch manager details.");
            }
            const managerData = await managerResponse.json();
            const branchManagerLoginId = managerData.login_user_id;

            if (!branchManagerLoginId) {
                alert("לא נמצא login_user_id עבור מנהל הסניף.");
                return;
            }

            // שליחת ההודעה למנהל הסניף
            const notificationResponse = await fetch("http://localhost:8000/notifications/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: currentForward.message,
                    forward_reason: forwardReason,  // סיבת ההעברה
                    sent_by: user_id,
                    user_ids: [branchManagerLoginId],
                }),
            });

            if (notificationResponse.ok) {
                alert("ההודעה נשלחה למנהל הסניף בהצלחה.");
            } else {
                const error = await notificationResponse.json();
                alert(`שגיאה בשליחת ההודעה: ${error.detail}`);
            }
        } catch (error) {
            console.error("Error forwarding notification:", error);
            alert("שגיאה בלתי צפויה בהעברת ההודעה.");
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
                                        <div className="recived-notification-header">
                                            <strong>מאת:</strong>&nbsp;{notification.sent_by_name}
                                            <span className="notification-subject">{notification.subject}</span>
                                        </div>
                                        {notification.reply_to && (
                                            <div className="reply-to">
                                                <p>{notification.reply_to_message}</p>

                                            </div>
                                        )}
                                        <p className="notification-content">{notification.message}</p>
                                        <div className="notification-actions">
                                            <button
                                                onClick={() => toggleResolved(notification.notification_id)}
                                                className={`action-button-reply ${notification.is_resolved ? 'resolved' : 'unresolved'}`}
                                            >
                                                {notification.is_resolved ? <FaCheck size={16} color="#3f3939" /> : <FaFlag style={{ transform: 'scaleX(-1)' }} size={16} color="#3f3939" />}
                                            </button>
                                            <button
                                                onClick={() => openReplyModal(notification)}
                                                className="action-button-reply"
                                            >
                                                <FaReply size={16} color="#3f3939" />
                                            </button>
                                            <button onClick={() => openForwardModal(notification)}
                                                    className="action-button-forward"
                                                 >
                                                <FaShare size={16} color="#3f3939" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    )}
                {isForwardModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div class="notification-header-share">
                            <h2>העברת הודעה</h2>
                            </div>
                            <div className='previous-message'>
                            <p>{currentForward?.message}</p>
                            </div>
                            <textarea className='share-textarea'
                                value={forwardReason}
                                onChange={(e) => setForwardReason(e.target.value)}
                                placeholder="הוסף סיבה להעברה..."
                            ></textarea>
                                <button onClick={() => forwardToBranchManager(currentForward.sent_by) }
                                className="action-button send"
                                >העבר</button>

                                <button onClick={() => setIsForwardModalOpen(false)}className="action-button cancel">ביטול</button>
                        </div>
                    </div>
                )}


                <button onClick={() => setIsModalOpen(true)} className="new-notification-button">
                    הודעה חדשה        <  IoMdSend size={20} style={{ transform: 'rotate(180deg)' }} />
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
                                onClick={async () => {
                                    if (newnotification && recipients.length > 0) {
                                        const recipientUserIds = recipients.includes("מזכירות")
                                            ? [...recipients.map((recipient) => (recipient === "מזכירות" ? 6 : recipient))]
                                            : [...recipients];
                                        try {
                                            // שליחת ההודעה לשרת
                                            const response = await fetch("http://localhost:8000/notifications/", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    message: newnotification,
                                                    user_ids: recipientUserIds,
                                                    sent_by: user_id,
                                                }),
                                            });

                                            if (response.ok) {
                                                alert("ההודעה נשלחה בהצלחה");
                                                setNewnotification("");
                                                setRecipients([]);
                                                setIsModalOpen(false);
                                            } else {
                                                const error = await response.json();
                                                alert(`שגיאה בשליחת ההודעה: ${error.detail}`);
                                            }
                                        } catch (error) {
                                            console.error("Error sending notification:", error);
                                            alert("שגיאה בלתי צפויה בשליחת ההודעה.");
                                        }
                                    } else {
                                        alert("אנא כתוב הודעה ובחר נמענים לפני שליחה.");
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
                        <div className='answer-notification-header'>
                            <h2>תשובה להודעה</h2>
                        </div>
                        <p>
                            <div class="answer-recipients-scroll">
                                <strong>נמענ/ת:</strong>&nbsp; {currentReply?.sent_by_name}
                            </div>
                        </p>
                        <textarea
                            className="answer-textarea"
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

export default SecretaryNotification;
