import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChildDetails from '../ChildDetails/ChildDetail';
import ChildForm from '../ChildForm/ChildForm'; // ייבוא הקומפוננטה
import { FaCommentDots, FaPlus, FaHome, FaTree, FaUserTie, FaBuilding, FaTimes, FaMapMarkerAlt, FaPen, FaCheck, FaTrash, FaClipboardList, FaCalendarPlus, FaTrashAlt } from 'react-icons/fa';
import NotificationPage from '../Notification/Notification';
import './SecretaryList.css';
import ActivityAttendance from '../ActivityAttendance/ActivityAttendance';
import SecretaryNotification from '../SecretaryNotification/SecretaryNotification';

const SecretaryList = () => {
  const location = useLocation();
  const { state } = location;
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [branchManagers, setBranchManagers] = useState([]); // רשימת מנהלי הסניפים
  const [showBranchManagers, setShowBranchManagers] = useState(false); // מצב תצוגת מנהלים
  const [classes, setClasses] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // ניהול מצב הטופס
  const navigate = useNavigate(); // יצירת הפונקציה לניווט
  const [showTooltipManager, setShowTooltipManager] = useState(false); // ניהול מצב חלונית ההסבר
  const [showTooltipHome, setShowTooltipHome] = useState(false); // טול-טיפ לכפתור הבית
  const [showTooltipBranch, setShowTooltipBranch] = useState(false); // טול-טיפ לכפתור הבית
  const [showTooltipNotification, setShowTooltipNotification] = useState(false); // טול-טיפ לכפתור הבית
  const [showBranchesModal, setShowBranchesModal] = useState(false); // מצב לתצוגת 
  const [selectedBranch, setSelectedBranch] = useState(null); // סניף שנבחר להצגה
  const [newBranch, setNewBranch] = useState({ branch_name: '', location: '' }); // סניף חדש
  const [showAddBranchForm, setShowAddBranchForm] = useState(false); // ניהול מצב טופס הוספה
  const [isEditing, setIsEditing] = useState(false); // ניהול מצב עריכה
  const [editedBranch, setEditedBranch] = useState(null); // ניהול פרטי הסניף בעריכה
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [showDeleteChildModal, setShowDeleteChildModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false); // מצב המודל ליצירת פעילות
  const [selectedGroups, setSelectedGroups] = useState([]); // קבוצות שנבחרו
  const [childrenByGroup, setChildrenByGroup] = useState([]); // קבוצות שנבחרו
  const [showAttendance, setShowAttendance] = useState(false);
  const [activityId, setActivityId] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    name: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
  });
  const [showActivityForm, setShowActivityForm] = useState(false); // מצב להציג את טופס יצירת הפעילות
  const [showGroupSelectionModal, setShowGroupSelectionModal] = useState(false);
  const handleActivityInputChange = (e) => {
    const { name, value } = e.target;
    setActivityDetails({ ...activityDetails, [name]: value });
  };
  const handleCreateActivity = () => {
    setShowActivityForm(true);
  };
  const handleSaveNewActivity = async () => {
    try {
      // שליחה של נתוני הפעילות לשרת
      const response = await fetch('http://localhost:8000/activities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityDetails),
      });

      if (response.ok) {
        const activity = await response.json();
        setActivityId(activity.activity_id)
        console.log('Activity created:', activity);
        setActivityDetails({
          name: '',
          description: '',
          location: '',
          start_time: '',
          end_time: '',
        });

        setShowActivityForm(false); // סגירת הטופס
        setShowGroupSelectionModal(true); // פתיחת חלונית הקבוצות
      } else {
        console.error('Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };
  const handleGroupSelection = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };
  const handleSaveActivity = async () => {
    console.log('Selected Groups:', selectedGroups);
    const childrenResponse = await fetch(`http://localhost:8000/children/getChildrenByGroups?group_ids=${selectedGroups}`);

    const childrenData = await childrenResponse.json();
    console.log("Fetched children:", childrenData);
    try {const response = await fetch(`http://localhost:8000/activities/${activityId}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedGroups),
    });
    console.log("Groups saved successfully:", response.data);

  } catch (error) {
      console.error("Error saving groups:", error.response?.data || error.message);
  }

    // הצגת הילדים במסך
    setChildrenByGroup(childrenData); // עדכון המשתנה שמאחסן את רשימת הילדים
    setShowAttendance(true)
    setSelectedGroups([]); // איפוס הבחירה
    setShowGroupSelectionModal(false);
  };
  const toggleActivityModal = () => {
    setShowActivityModal(!showActivityModal);
  };

  const handleDeleteChildClick = (e, child) => {
    e.stopPropagation(); // למנוע קריאה לא מכוונת
    setChildToDelete(child);
    setShowDeleteChildModal(true);
  };

  const handleCancelDeleteChild = () => {
    setShowDeleteChildModal(false);
    setChildToDelete(null);
  };

  const handleConfirmDeleteChild = async () => {
    try {
      const response = await fetch(`http://localhost:8000/children/deleteChild/${childToDelete.child_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChildren(children.filter(child => child.child_id !== childToDelete.child_id)); // עדכון הרשימה
        setShowDeleteChildModal(false);
        setChildToDelete(null);
      } else {
        console.error('Failed to delete child');
      }
    } catch (error) {
      console.error('Error deleting child:', error);
    }
  };

  const handleDeleteIconClick = (e, branch) => {
    e.stopPropagation(); // למנוע את קריאת ה-click על הפריט כולו
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/branches/deleteBranch/${branchToDelete.branch_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBranches(branches.filter(branch => branch.branch_id !== branchToDelete.branch_id)); // עדכון הרשימה
        setShowDeleteModal(false);
        setBranchToDelete(null);
      } else {
        console.error('Failed to delete branch');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

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
    fetch('http://localhost:8000/children/')
      .then(response => response.json())
      .then(data => setChildren(data)).then(console.log("children",children));
  }, []);

  useEffect(() => {
    const fetchBranchManagers = async () => {
      try {
        const response = await fetch('http://localhost:8000/branch_managers/');
        const data = await response.json();
        setBranchManagers(data);
      } catch (error) {
        console.error('Error fetching branch managers:', error);
      }
    };

    if (showBranchManagers) {
      fetchBranchManagers();
    }
  }, [showBranchManagers]);

  const handleBranchManagersClick = () => {
    navigate('/branch-managers');
  };

  const toggleBranchesModal = () => {
    setShowBranchesModal(!showBranchesModal);
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch); // שמירת הסניף שנבחר
  };

  const closeBranchDetails = () => {
    setSelectedBranch(null); // סגירת תיבת פרטי הסניף
  };

  const toggleAddBranchForm = () => {
    setShowAddBranchForm(!showAddBranchForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch({ ...newBranch, [name]: value });
  };

  const handleSaveBranch = async () => {
    try {
      const response = await fetch('http://localhost:8000/branches/addNewBranch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranch),
      });

      if (response.ok) {
        const savedBranch = await response.json();
        setBranches([...branches, savedBranch]); // עדכון הרשימה
        setShowAddBranchForm(false); // סגירת הטופס
      } else {
        console.error('Failed to save branch');
      }
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEditBranch = () => {
    setIsEditing(true); // מעבר למצב עריכה
    setEditedBranch(selectedBranch); // שמירת הנתונים לעריכה
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBranch({ ...editedBranch, [name]: value });
  };

  const handleSaveEditBranch = async () => {
    try {
      const response = await fetch('http://localhost:8000/branches/updateBranch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedBranch),
      });

      if (response.ok) {
        const updatedBranch = await response.json();
        setBranches(branches.map(branch =>
          branch.branch_id === updatedBranch.branch_id ? updatedBranch : branch
        )); // עדכון הרשימה
        setSelectedBranch(updatedBranch); // עדכון הסניף שנבחר
        setIsEditing(false); // יציאה ממצב עריכה
      } else {
        console.error('Failed to update branch');
      }
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };

  return (
    <div className="children-list-wrapper">
      <div className="activity-button" onClick={handleCreateActivity}>
        <FaCalendarPlus color="#3f3939" size={24} />
      </div>
      {showActivityForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowActivityForm(false)}>
              <FaTimes size={20} />
            </button>
            <h3>Create New Activity</h3>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={activityDetails.name}
                onChange={handleActivityInputChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={activityDetails.description}
                onChange={handleActivityInputChange}
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={activityDetails.location}
                onChange={handleActivityInputChange}
              />
            </div>
            <div>
              <label>Start Time:</label>
              <input
                type="date"
                name="start_time"
                value={activityDetails.start_time}
                onChange={handleActivityInputChange}
              />
            </div>
            <div>
              <label>End Time:</label>
              <input
                type="date"
                name="end_time"
                value={activityDetails.end_time}
                onChange={handleActivityInputChange}
              />
            </div>
            <button className="save-activity" onClick={handleSaveNewActivity}>
              Save Activity
            </button>
          </div>
        </div>
      )}


      {/* מודל ליצירת פעילות */}
      {showGroupSelectionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowGroupSelectionModal(false)}>
              <FaTimes size={20} />
            </button>
            <h3>Create New Activity</h3>
            <ul className="group-list">
              {groups.map((group) => (
                <li key={group.group_id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.group_id)}
                      onChange={() => handleGroupSelection(group.group_id)}
                    />
                    {group.group_name}
                  </label>
                </li>
              ))}
            </ul>
            <button className="save-activity" onClick={handleSaveActivity}>
              Save Activity
            </button>
          </div>
        </div>
      )}
      <h2 className="secretary-table-title">Children</h2>
      <div
        className="branches-button"
        onClick={toggleBranchesModal}
        onMouseEnter={() => setShowTooltipBranch(true)}
        onMouseLeave={() => setShowTooltipBranch(false)}
      >
        <FaMapMarkerAlt color="#3f3939" size={24} />
        {showTooltipBranch && <div className="home-tooltip">Branches</div>}
      </div>

      {/* טופס הסניפים */}
      {showBranchesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleBranchesModal}>
              <FaTimes size={20} />
            </button>
            <h3>Branches</h3>
            <div className="add-branch-button" onClick={toggleAddBranchForm}>
              <FaPlus size={20} />
            </div>
            <ul>
              {branches.map((branch) => (
                <li
                  key={branch.branch_id}
                  className="branch-item"
                  onClick={() => handleBranchClick(branch)}
                >
                  {branch.branch_name}, {branch.location}
                  <FaTrashAlt
                    className="delete-icon"
                    onClick={(e) => handleDeleteIconClick(e, branch)}
                    size={12}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* טופס פרטי הסניף */}
      {selectedBranch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeBranchDetails}>
              <FaTimes size={20} />
            </button>
            <h3>{isEditing ? 'Edit Branch Details' : 'Branch Details'}</h3>
            {/* אם אנחנו במצב עריכה, מציגים שדות קלט */}
            {isEditing ? (
              <div>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="branch_name"
                    value={editedBranch.branch_name}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={editedBranch.location}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p><strong>Name:</strong> {selectedBranch.branch_name}</p>
                <p><strong>Location:</strong> {selectedBranch.location}</p>
              </div>
            )}

            {/* כפתור עריכה או אישור */}
            <div
              className="edit-button"
              onClick={isEditing ? handleSaveEditBranch : handleEditBranch}
            >
              {isEditing ? <FaCheck color="#3f3939" size={20} /> : <FaPen color="#3f3939" size={20} />}
            </div>
          </div>
        </div>
      )}
      <div
        className="manager-icon"
        onClick={handleBranchManagersClick}
        onMouseEnter={() => setShowTooltipManager(true)}
        onMouseLeave={() => setShowTooltipManager(false)}
      >
        <FaUserTie color="#3f3939" size={24} />
        {showTooltipManager && <div className="home-tooltip">Branch Managers</div>}
      </div>

      <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}
        onMouseEnter={() => setShowTooltipNotification(true)}
        onMouseLeave={() => setShowTooltipNotification(false)}>
        <FaCommentDots color="#3f3939" size={24} />
        {showTooltipNotification && <div className="home-tooltip">Show Notification</div>}
      </div>

      {showNotifications && (
        <div className="notifications-container">
          <SecretaryNotification user_id={state?.user_id} />
        </div>
      )}

      <div
        className="home-button"
        onClick={() => navigate('/')} // ניווט לדף ה-Login
        onMouseEnter={() => setShowTooltipHome(true)}
        onMouseLeave={() => setShowTooltipHome(false)}
      >
        <FaHome size={24} color="#3f3939" />
        {showTooltipHome && <div className="home-tooltip">Log Out</div>}
      </div>
      {showAttendance ? (
        <ActivityAttendance
          children={childrenByGroup}
          activityId={activityId}
          onClose={() => setShowAttendance(false)} // סגירת הקומפוננטה ללא שליחה
          userId={state?.user_id}
        />
      ) : (
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
                <td className="branch-item"
                >
                  <FaTrashAlt
                    className="delete-child-icon"
                    onClick={(e) => handleDeleteChildClick(e, child)}
                    size={18}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedChild && (
        <ChildDetails
          child={selectedChild}
          setChild={setSelectedChild}
          branches={branches}
          classes={classes}
          shirts={shirts}
          groups={groups}
          onClose={() => setSelectedChild(null)}
        />
      )}
      {showAddBranchForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleAddBranchForm}>
              <FaTimes size={20} />
            </button>
            <h3>Add New Branch</h3>
            <div>
              <label>Branch Name:</label>
              <input
                type="text"
                name="branch_name"
                value={newBranch.branch_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={newBranch.location}
                onChange={handleInputChange}
              />
            </div>
            <button className='save-botton' onClick={handleSaveBranch}>Save</button>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCancelDelete}>
              <FaTimes size={20} />
            </button>
            <h4>Are you sure you want to delete
              {branchToDelete?.branch_name}?</h4>
            <button className='save-botton' onClick={handleConfirmDelete}>Yes</button>
            <button className='no-botton' onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
      {showDeleteChildModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCancelDeleteChild}>
              <FaTimes size={20} />
            </button>
            <h4>Are you sure you want to delete {childToDelete?.first_name} {childToDelete?.last_name}?</h4>
            <button className='save-botton' onClick={handleConfirmDeleteChild}>Yes</button>
            <button className='no-botton' onClick={handleCancelDeleteChild}>No</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SecretaryList;
