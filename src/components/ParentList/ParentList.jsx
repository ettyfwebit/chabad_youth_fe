import React, { useEffect, useState } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import './ParentList.css';
import ChildDetails from '../ChildDetails/ChildDetail';
import ChildForm from '../ChildForm/ChildForm'; // ייבוא הקומפוננטה
import { FaCommentDots,FaPlus ,FaHome} from 'react-icons/fa';
import NotificationPage from '../Notification/Notification';

const ParentList = () => {
  const location = useLocation();
  const { state } = location;
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [classes, setClasses] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // ניהול מצב הטופס
  const navigate = useNavigate(); // יצירת הפונקציה לניווט
  const [showTooltip, setShowTooltip] = useState(false); // ניהול מצב חלונית ההסבר
  const [showTooltipHome, setShowTooltipHome] = useState(false); // טול-טיפ לכפתור הבית
  const [showTooltipNotification, setShowTooltipNotification] = useState(false); // טול-טיפ לכפתור הבית


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
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8000/groups/');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8000/classgrades/');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
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
        console.error('Error fetching shirts:', error);
      }
    };

    fetchShirts();
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      console.log("parent id" ,state?.user_id)

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





  const handleAddChild = async (formData) => {
    console.log("parent id" ,state?.user_id)
    formData.parent_id = state?.user_id;
    try {
      const response = await fetch("http://localhost:8000/children/addNewChild", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newChild = await response.json();
        setChildren((prevChildren) => [...prevChildren, newChild]);
        alert('Child added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add child: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the child.');
    }

    setIsFormOpen(false);
  };

  return (
    <div className="children-list-wrapper">
 
      <h2 className="table-title">Children</h2>
      <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}
          onMouseEnter={() => setShowTooltipNotification(true)}
          onMouseLeave={() => setShowTooltipNotification(false)}>
        <FaCommentDots className="notification-icon-style" color="#3f3939" size={24} />
        {showTooltipNotification && <div className="home-tooltip">Show Notification</div>}

      </div>

      {showNotifications && (
        <div className="notifications-container">
          <NotificationPage user_id={state?.user_id}
          setShowNotifications={setShowNotifications} />
        </div>
      )}

      <div
        className="add-child-button"
        onClick={() => setIsFormOpen(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaPlus size={24} color="#3f3939" />
        {showTooltip && <div className="tooltip">Add New Child</div>}
      </div>
      <div
        className="home-button"
        onClick={() => navigate('/')} // ניווט לדף ה-Login
        onMouseEnter={() => setShowTooltipHome(true)}
        onMouseLeave={() => setShowTooltipHome(false)}
      >
        <FaHome className="notification-icon-style" size={24} color="#3f3939" />
        {showTooltipHome && <div className="home-tooltip">Log Out</div>}

      </div>

      <table className="children-table">
        <tbody>
          {children.map((child) => (
            <tr key={child.child_id} onClick={() => setSelectedChild(child)}>
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
        children={children}
        setChildren={setChildren}
          child={selectedChild}
          setChild={setSelectedChild}
          branches={branches}
          classes={classes}
          shirts={shirts}
          groups={groups}
          onClose={() => setSelectedChild(null)}
        />
      )}

      {isFormOpen && (
        <ChildForm
          branches={branches}
          classes={classes}
          shirts={shirts}
          groups={groups}
          onSubmit={handleAddChild}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ParentList;
