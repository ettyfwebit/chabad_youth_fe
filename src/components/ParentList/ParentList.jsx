import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ManagerSideBar from '../ManagerSideBar/ManagerSideBar';
import './ParentList.css';
import ChildDetails from '../ChildDetails/ChildDetail';
import { FaCommentDots } from 'react-icons/fa'; // ספריית אייקונים
import NotificationPage from '../Notification/Notification'; // ייבוא הקומפוננטה של ההודעות

const ParentList = () => {
  const location = useLocation()
  const { state } = location;
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // שליטה על הצגת ההודעות

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:8000/branches/');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8000/classgrades/');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchClasses();
  }, []);
  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await fetch('http://localhost:8000/shirts/');
        const data = await response.json();
        setShirts(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchShirts();
  }, []);
  useEffect(() => {
    const fetchChildren = async () => {
      const userId = state?.user_id;
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/children/getChildrenByParent?user_id=${userId}`);
        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, [state?.user_id]);
  const handleRowClick = (child) => {
    setSelectedChild(child);
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="children-list-wrapper">
      <ManagerSideBar
        user_id={state?.user_id}
        branches={branches}
        classes={classes}
        shirts={shirts}
      />
        <h2 className="table-title">Children</h2>
        <div className="notification-icon" onClick={toggleNotifications}>
        <FaCommentDots  color ={'#3f3939'} size={28} />
      </div>
      {/* קומפוננטת ההודעות */}
      {showNotifications && (
        <div className="notifications-container">
          <NotificationPage user_id={state?.user_id} />
        </div>

      )} <table className="children-table">
        <tbody>
          {children.map((child) => (
            <tr key={child.child_id} onClick={() => handleRowClick(child)}>
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


            </tr>
          ))}
        </tbody>
      </table>
     
      {selectedChild && (
        <ChildDetails
          child={selectedChild}
          setChild={setSelectedChild}
          branches={branches}
          classes={classes}
          shirts={shirts}
          onClose={() => setSelectedChild(null)}
        />
      )}
    </div>
  );

}
export default ParentList