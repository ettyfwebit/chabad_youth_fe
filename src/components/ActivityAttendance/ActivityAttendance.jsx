import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi'; // איקון של שליחה מ-React Icons

import './ActivityAttendance.css';
import { FaCheckCircle, FaCheckSquare, FaRegCircle, FaRegSquare } from 'react-icons/fa';


const ActivityAttendance = ({ children, activityId, onClose, userId }) => {
    const [showTooltip, setShowTooltip] = useState(false); // ניהול מצב חלונית ההסבר
    const [minAttendance, setMinAttendance] = useState(0); // ערך ברירת מחדל ל-0
    const [selectAll, setSelectAll] = useState(false); // מצב הכפתור - האם לבחור את כולם או לא
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [messageContent, setMessageContent] = useState('');
    const filteredChildren = children.filter(
        (child) => child.total_points >= minAttendance
    );
    const [attendance, setAttendance] = useState(
        filteredChildren.reduce((acc, child) => {
            acc[child.child_id] = { // אתחול הנוכחות כברירת מחדל ל-false
                is_present: false,   // ברירת מחדל היא false
                branch_id: child.branch_id,  // הוספת branch_id
            }// הוספת meeting_id
            return acc;
        }, {})
    );
    const handleToggleSelectAll = () => {
        const newState = !selectAll;
        setSelectAll(newState);
        setAttendance((prevAttendance) => {
            const updatedAttendance = {};
            filteredChildren.forEach(child => {
                updatedAttendance[child.child_id] = {
                    is_present: newState,
                    branch_id: child.branch_id,
                };
            });
            return updatedAttendance;
        });
    };
    const handleSendNotification = async () => {
        const selectedChildren = filteredChildren.filter(
            (child) => attendance[child.child_id]?.is_present
        );
    
        // מיפוי הורים לשמות הילדים שלהם
        const parentsChildrenMap = selectedChildren.reduce((acc, child) => {
            // אם כבר יש לו את הילד, נוסיף אותו לרשימה
            if (!acc[child.parent_id]) {
                acc[child.parent_id] = [];
            }
            acc[child.parent_id].push(child);
            return acc;
        }, {});
    
        try {
            // עבור כל הורה
            for (const parentId in parentsChildrenMap) {
                const childrenForParent = parentsChildrenMap[parentId];
    
                // יצירת כותרת הודעה עם שמות הילדים של ההורה הנוכחי
                const childrenNames = childrenForParent.map((child) => `${child.first_name} ${child.last_name}`).join(", ");
                const messageWithChildrenNames = `הודעה עבור הורי התלמידים:\n${childrenNames}\n\n${messageContent}`;
    
                // שליחת ההודעה להורה
                console.log("parent" ,parentId)
                const parentIds = await updateParentIds(parentId);
                const value = Object.values(parentIds)[0];

                const response = await fetch("http://localhost:8000/notifications/sendNlotifications", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: messageWithChildrenNames, // השתמש בהודעה עם השמות
                        user_ids: value,
                        sent_by: userId,
                    }),
                });
    
                if (!response.ok) {
                    const error = await response.json();
                    alert(`שגיאה בשליחת התשובה: ${error.detail}`);
                }
            }
    
            // אם הכל בסדר
            setIsModalOpen(false);
            onClose();
        } catch (error) {
            console.error("Error sending reply:", error);
            alert("שגיאה בלתי צפויה בשליחת התשובה.");
        }
    };
    

    const updateParentIds = async (filteredChildren) => {
        try {
            // יצירת רשימה של parent_ids מתוך הילדים המסוננים
            console.log ( "filtered children",filteredChildren)
            console.log("filteredChildren type:", typeof filteredChildren); // יראה אם זה אובייקט או לא
            const parentIdInt = parseInt(filteredChildren, 10); // המרה למספר
            console.log("parentIdInt children",parentIdInt)
            console.log("parentIdInt type:", typeof parentIdInt); // יראה אם זה אובייקט או לא

            // קריאה לשרת לקבלת מיפוי ה-parent_id ל-login_user_id
            const response = await fetch("http://localhost:8000/notifications/login_ids", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify({parent_id: parentIdInt}),
            });
    
            if (response.ok) {
                const parentIdMap = await response.json(); // מקבל את המיפוי { parent_id: login_user_id }
    
                // עדכון רשימת parentIds בהתאם לנתונים שהתקבלו
                const updatedParentIds = parentIdMap
                    // .filter(child => parentIdMap[child.parent_id]) // מסנן רק את הילדים שהתקבל עבורם מיפוי
                    // .map(child => parentIdMap[child.parent_id]); // ממפה את ה-login_user_id

                return updatedParentIds; // מחזיר את רשימת ה-login_user_id המעודכנת
            } else {
                const error = await response.json();
                console.error("Failed to fetch parent IDs:", error.detail);
                alert(`שגיאה בשליפת הנתונים: ${error.detail}`);
                return [];
            }
        } catch (error) {
            console.error("Error fetching parent IDs:", error);
            alert("שגיאה בלתי צפויה בשליפת ה-login_user_id.");
            return [];
        }
    };
    



    const handleAttendanceChange = (childId, isPresent, branchId) => {
        setAttendance((prevAttendance) => ({
            ...prevAttendance,
            [childId]: {
                is_present: isPresent,
                branch_id: branchId, // הוספת ה-branch_id
            },
        }));
    };

    const handleSubmit = async () => {
        // יצירת נתוני הנוכחות לשליחה
        const attendanceData = filteredChildren.map(child => ({
            activity_id: activityId,  // מזהה הפעילות
            child_id: child.child_id,
            is_present: attendance[child.child_id]?.is_present || false,

        }));
        try {
            const response = await fetch('http://localhost:8000/attendance/activityAttendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            });

            if (response.ok) {
                console.log("Attendance data saved successfully");
            } else {
                console.error("Failed to save attendance data");
            }

        } catch (error) {
            console.error("Error saving attendance data:", error);
        }
        setIsModalOpen(true)

    };


    return (
        <div className="activity-attendancde-list-wrapper">
            <h2 className=" activity-attendance-table-title">Attendance List</h2>
            <div className="filter-wrapper">

                <input
                    id="min-attendance"
                    type="number"
                    value={minAttendance === 0 ? "" : minAttendance} // תצוגת placeholder כאשר הערך הוא 0
                    onChange={(e) => setMinAttendance(Number(e.target.value) || 0)} // טיפול במצב שבו הקלט ריק
                    className="filter-input"
                    placeholder="Enter Minimum Percentage:"
                />
                <div className="select-all-wrapper">
                    <button onClick={handleToggleSelectAll} className="toggle-select-button">
                        {selectAll ? <FaCheckCircle size={24} color='#ccc' /> : <FaRegCircle size={24} color='#ccc' />}
                    </button>
                </div>

            </div>
            <table className="activity-attendance-table">

                <tbody>
                    {filteredChildren.map((child) => (
                        <tr key={child.child_id} >
                            <td className="profile-td">
                                <div className="profile-wrapper">
                                    <img
                                        src={`data:image/png;base64,${child.image}`}
                                        alt={`Child ${child.first_name}`}
                                    />
                                    <div className="name-wrapper">
                                        <div className="name">{child.first_name} {child.last_name}</div>
                                        <div className="id-number">{child.id_number}</div>
                                    </div>
                                </div>
                            </td>
                            <td className='city-td'>
                                <div className="location-wrapper-attendance">
                                    <div className="city">{child.city}</div>
                                    <div className="street">{child.street}</div>
                                </div>
                            </td>
                            <td className="attendance-percentage">
                                {child.total_points !== undefined
                                    ? `${child.total_points}%`
                                    : 'N/A'} {/* מציג אחוזי נוכחות או 'N/A' אם אין מידע */}
                            </td>

                            <div className='input-check-attendance'>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={attendance[child.child_id]?.is_present || false}
                                        onChange={(e) =>
                                            handleAttendanceChange(child.child_id, e.target.checked, child.branch_id)
                                        }
                                    />
                                </td>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={handleSubmit} className="submit-attendance-button">
                <FiSend color="#3f3939" size={24} />
                {showTooltip && <div className="tooltip">Send Attendance</div>}
            </button>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-all-parents">
                        <header className="new-notification-header-all-parents">

                        <h2>שליחת הודעה להורים</h2>
                        </header>
                        <textarea
                            className="textarea-all-parents"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="כתוב את ההודעה כאן..."
                        ></textarea>

<div className="modal-actions">
                            <button onClick={handleSendNotification} className="action-button-all-parents send">
                                שלח
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="action-button cancel">
                                ביטול
                            </button>
                        </div>
                </div>
        </div>
    )
}
        </div >
        
    );
};

export default ActivityAttendance;
