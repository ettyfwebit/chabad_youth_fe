import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa'; // אייקון קבוצת אנשים
import { FaHome, FaCommentDots } from 'react-icons/fa'; // אייקונים לבית והודעות
import './BranchManagerList.css'; // קובץ ה-CSS לעיצוב
import NotificationPage from '../Notification/Notification';
import Attendance from '../Attendance/Attendance';

const BranchManagerList = () => {
  const location = useLocation(); // קבלת הנתונים מ-useNavigate
  const { state } = location;
  const [groups, setGroups] = useState([]); // קבוצות
  const [showForm, setShowForm] = useState(false); // הצגת הטופס
  const [selectedGroups, setSelectedGroups] = useState([]); // קבוצות שנבחרו
  const [meetingName, setMeetingName] = useState(''); // מצב לשם המפגש
  const [showTooltip, setShowTooltip] = useState(false); // ניהול מצב חלונית ההסבר
  const [showTooltipHome, setShowTooltipHome] = useState(false); // טול-טיפ לכפתור הבית
  const [showTooltipNotification, setShowTooltipNotification] = useState(false); // טול-טיפ לכפתור הבית
  const navigate = useNavigate(); // יצירת הפונקציה לניווט
  const [showNotifications, setShowNotifications] = useState(false);
  const [children, setChildren] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false); // הצגת קומפוננטת הנוכחות
  const [meetingId, setMeetingId] = useState(); 
  const [instructionsAcknowledged, setInstructionsAcknowledged] = useState(false); // מצב חדש עבור ההוראות
  const [showInstructions, setShowInstructions] = useState(false); // מצב להצגת ההוראות

  const fetchGroups = async () => {
    const userId = state?.user_id;
    if (!userId) {
      console.warn("user_id is not defined");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/groups/getGroupsByBranchManager?user_id=${userId}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleOpenForm = () => {
    setShowForm(true); // הצגת הטופס
    fetchGroups(); // קריאת השרת לטעינת הקבוצות
  };

  const handleGroupSelection = (groupId) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.includes(groupId)
        ? prevSelected.filter((id) => id !== groupId) // הסרה אם כבר נבחר
        : [...prevSelected, groupId] // הוספה אם לא נבחר
    );
  };

  const handleAttendanceSubmit = async (attendance) => {
    console.log("Submitting attendance:", attendance);
    try {
      await fetch('http://localhost:8000/attendance/updateAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendance),
      });

      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Selected groups for meeting:", selectedGroups);
    console.log("Selected meeting name for meeting:", meetingName);

    try {
      const meetingResponse = await fetch('http://localhost:8000/meetings/createNewMeeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meeting_name: meetingName }),
      });

      if (!meetingResponse.ok) {
        throw new Error('Error creating meeting');
      }

      const meetingData = await meetingResponse.json();
      setMeetingId(meetingData.meeting_id);

      // שליחת קריאה לשרת לקבלת הילדים הקשורים לקבוצות שנבחרו
      const childrenResponse = await fetch(`http://localhost:8000/children/getChildrenByGroups?group_ids=${selectedGroups}`);

      const childrenData = await childrenResponse.json();
      console.log("Fetched children:", childrenData);

      // הצגת הילדים במסך
      setChildren(childrenData); // עדכון המשתנה שמאחסן את רשימת הילדים
      setShowInstructions(true); // הצגת ההוראות
       // סגירת הטופס לאחר אישור

    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleInstructionsAcknowledged = () => {
    setInstructionsAcknowledged(true); // אישור ההוראות
    setShowForm(false);
    setShowAttendance(true); // הצגת קומפוננטת Attendance
    setShowInstructions(false); // סגירת חלונית ההוראות
  };

  return (
    <div className="wrapper">
      <div className="circle"></div>

      <div
        className="home-button"
        onClick={() => navigate('/')} // ניווט לדף ה-Login
        onMouseEnter={() => setShowTooltipHome(true)}
        onMouseLeave={() => setShowTooltipHome(false)}
      >
        <FaHome className="branch-notification-icon-style" size={24} color="#3f3939" />
        {showTooltipHome && <div className="home-tooltip">Log Out</div>}
      </div>

      {/* כפתור הודעות */}
      <div
        className="notification-icon"
        onClick={() => setShowNotifications(!showNotifications)}
        onMouseEnter={() => setShowTooltipNotification(true)}
        onMouseLeave={() => setShowTooltipNotification(false)}
      >
        <FaCommentDots className=" branch-notification-icon-style" color="#3f3939" size={24} />
        {showTooltipNotification && <div className="home-tooltip">Show Notification</div>}
      </div>

      {showNotifications && (
        <div className="notifications-container">
          <NotificationPage user_id={state?.user_id} />
        </div>
      )}

      {showAttendance ? (
        <Attendance
          children={children}
          meetingName={meetingName} // העברת שם המפגש
          meetingId={meetingId}
          onSubmitAttendance={(attendance) => {
            handleAttendanceSubmit(attendance);
            setShowAttendance(false); // חזרה למסך הראשי
          }}
          onClose={() => setShowAttendance(false)} // סגירת הקומפוננטה ללא שליחה
        />
      ) : (
        <>
        
          {!showForm ? (
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={handleOpenForm}
              className="create-meeting-button"
            >
              <FaUsers size={80} color="#3f3939" />
              {showTooltip && <div className="tooltip">Create New Meeting</div>}
            </button>
          ) : (
            <div className="group-form">
              <h2 className="form-title">Your Groups</h2>
              <input
                type="text"
                placeholder="קרא שם למפגש"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)} // עדכון מצב שם המפגש
                className="meeting-name-input"
              />
              <table className="children-table">
                <tbody>
                  {groups.map((group) => (
                    <tr key={group.group_id}>
                      <td className='profile-td'>
                      <div className="profile-wrapper">
                      <div className="name"> {group.group_name}</div>
                        </div>
                        </td>
                        
                      <td className='location-td'>
                      <div className="city">{group.group_id}
                      </div>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.group_id)}
                          onChange={() => handleGroupSelection(group.group_id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleSubmit} className="submit-meeting-button">
                אישור מפגש
              </button>
            </div>
          )}

          {/* הצגת ההוראות אחרי אישור המפגש */}
          {showInstructions && (
  <form className="instructions-form">
    <h3>הוראות המפגש</h3>
    <div className="instructions">
      <label>1. כל ילד חייב להיות מלווה למפגש.</label>
      <label>2. יש להגיע בזמן למפגש.</label>
      <label>3. יש לכבד את שאר המשתתפים ולהיות קשוב.</label>
      <label>4. חובה לעקוב אחרי כל הוראה שניתנת במהלך המפגש.</label>
      <label>5. יש להביא כלים מסוימים למפגש, כגון ספרים או ציוד אישי.</label>
      <label>6. כל שאלה שיש לה, יש לפנות למנחה המפגש.</label>
      <label>7. יש להימנע מהסחות דעת בזמן המפגש, כגון שימוש בטלפונים ניידים.</label>
      <label>8. נא לשמור על שקט במהלך הפעילות.</label>
      <label>9. יש לשמור על סדר ולנקות אחריכם בסיום המפגש.</label>
      <label>10. יש לשמור על גישה חיובית ושיתוף פעולה.</label>
      <label>11. חובה להציג את כרטיס הזיהוי שלכם לפני תחילת המפגש.</label>
      <label>12. יש לוודא שכל חומרי הפעילות מוכנים מראש.</label>
      <label>13. אין להביא אוכל ושתייה שאינם מאושרים.</label>
      <label>14. כל הגעה מאוחרת תסומן ויידווח עליה.</label>
      <label>15. יש לוודא שהילדים מכירים את כללי הבטיחות.</label>
      <label>16. יש להודיע למנחה המפגש על כל שינוי מראש.</label>
      <label>17. חובה ללבוש בגדים מתאימים לפעילות.</label>
      <label>18. הימנעו מצילום או שיתוף תמונות של המפגש.</label>
      <label>19. ילדים לא רשאים לעזוב את המפגש ללא אישור.</label>
      <label>20. כל בעיה רפואית יש לדווח מראש.</label>
      <label>21. אנא הביאו את כל הציוד שברשימה.</label>
      <label>22. הורים מוזמנים להשתתף אך מתבקשים לשמור על סדר.</label>
      <label>23. שימו לב להודעות שמפורסמות במהלך המפגש.</label>
      <label>24. יש לשמור על כבוד אישי לכל המשתתפים.</label>
      <label>25. יש להימנע מהבאת בעלי חיים למפגש.</label>
      <label>26. שימרו על ניקיון אזור הפעילות.</label>
      <label>27. יש להגיע למקום כ-10 דקות לפני הזמן.</label>
      <label>28. יש לוודא שהילדים מבינים את מטרת המפגש.</label>
      <label>29. כל תלונה או הצעה ניתן להעביר בכתב.</label>
      <label>30. שימו לב לתדריך הסיום.</label>
    </div>
    <button
      type="button"
      onClick={handleInstructionsAcknowledged}
      className="acknowledge-instructions-button"
    >
      אני מאשרת את ההוראות
    </button>
  </form>
)}
        </>
      )}
    </div>
  );
};

export default BranchManagerList;
