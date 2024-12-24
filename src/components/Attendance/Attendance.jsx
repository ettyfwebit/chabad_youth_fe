import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi'; // איקון של שליחה מ-React Icons

import './Attendance.css';


const Attendance = ({ children, meetingName, meetingId, onSubmitAttendance, onClose }) => {
    const [showTooltip, setShowTooltip] = useState(false); // ניהול מצב חלונית ההסבר
    const [attendance, setAttendance] = useState(
        children.reduce((acc, child) => {
            acc[child.child_id] = { // אתחול הנוכחות כברירת מחדל ל-false
                is_present: false,   // ברירת מחדל היא false
                branch_id: child.branch_id,  // הוספת branch_id
                meeting_id: meetingId,
            }// הוספת meeting_id
            return acc;
        }, {})
    );


    const handleAttendanceChange = (childId, isPresent, branchId) => {
        setAttendance((prevAttendance) => ({
            ...prevAttendance,
            [childId]: {
                is_present: isPresent,
                branch_id: branchId, // הוספת ה-branch_id
                meeting_id: meetingId,
            },
        }));
    };

    const handleSubmit = () => {
        // שליחה חזרה לשרת של נתוני הנוכחות
        onSubmitAttendance(attendance);
        onClose(); // סגירת הקומפוננטה
    };

    return (
        <div className="attendancde-list-wrapper">
            <h2 className=" attendance-table-title"> {meetingName}  Attendance List</h2>
            <table className="attendance-table">

                <tbody>
                    {children.map((child) => (
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
                            <td className="city-td">
                                <div className="location-wrapper">
                                    <div className="city">{child.city}</div>
                                    <div className="street">{child.street}</div>
                                </div>
                            </td>


                            <div className='input-check'>
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
        </div>
    );
};

export default Attendance;
