import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChildDetails from '../ChildDetails/ChildDetail';
import ChildForm from '../ChildForm/ChildForm'; // ייבוא הקומפוננטה
import { FaCommentDots, FaPlus, FaHome, FaTree, FaUserTie, FaBuilding, FaTimes, FaMapMarkerAlt, FaPen, FaCheck, FaTrash, FaClipboardList, FaCalendarPlus, FaTrashAlt, FaSpinner, FaUsers } from 'react-icons/fa';
import NotificationPage from '../Notification/Notification';
import ActivityAttendance from '../ActivityAttendance/ActivityAttendance';
import SecretaryNotification from '../SecretaryNotification/SecretaryNotification';
import BranchDetails from '../BranchDetails/BranchDetails';
import BranchManagerDetails from '../BranchManagerDetails/BranchManagerDetails';
import { ClipLoader, FadeLoader, PulseLoader } from 'react-spinners';

const ChildrenList = () => {
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
    const [showActivityModal, setShowActivityModal] = useState(false); // מצב המודל ליצירת פעילות
    const [selectedGroups, setSelectedGroups] = useState([]); // קבוצות שנבחרו
    const [selectedBranches, setSelectedBranches] = useState([]); // קבוצות שנבחרו
    const [childrenByGroup, setChildrenByGroup] = useState([]); // קבוצות שנבחרו
    const [showAttendance, setShowAttendance] = useState(false);
    const [activityId, setActivityId] = useState(null);
    const [showBranchManagersComponent, setShowBranchManagersComponent] = useState(false);
    const [activities, setActivities] = useState([]);
    const [showChildrenList, setShowChildrenList]=useState(false);
    const [activityDetails, setActivityDetails] = useState({
        name: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
    });
    const [showActivityForm, setShowActivityForm] = useState(false); // מצב להציג את טופס יצירת הפעילות
    const [showGroupSelectionModal, setShowGroupSelectionModal] = useState(false);
    const [loading, setLoading] = useState(true);

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
    const handleBranchSelection = async (branchId) => {
        const isSelected = selectedBranches.includes(branchId);
        const branch = branches.find((b) => b.branch_id === branchId);

        if (isSelected) {
            // אם הסניף כבר מסומן, נסיר אותו ואת הקבוצות שלו
            setSelectedBranches(selectedBranches.filter((id) => id !== branchId));

            // הסרת הקבוצות של הסניף מהבחירות
            if (branch && branch.groups) {
                const groupIdsToRemove = branch.groups.map((group) => group.group_id);
                setSelectedGroups((prevGroups) =>
                    prevGroups.filter((groupId) => !groupIdsToRemove.includes(groupId))
                );
            }
        } else {
            // אם הסניף לא מסומן, נוסיף אותו ואת הקבוצות שלו
            setSelectedBranches([...selectedBranches, branchId]);

            // טעינת הקבוצות אם לא קיימות עדיין
            if (branch && branch.groups) {
                const groupIdsToAdd = branch.groups.map((group) => group.group_id);
                setSelectedGroups((prevGroups) => [
                    ...prevGroups,
                    ...groupIdsToAdd.filter((id) => !prevGroups.includes(id)),
                ]);
            } else {
                // אם קבוצות הסניף לא נטענו, נטען אותן כעת
                try {
                    const response = await fetch(`http://localhost:8000/branches/${branchId}/groups`);
                    const data = await response.json();

                    // עדכון הקבוצות בתוך הסניף
                    setBranches((prevBranches) =>
                        prevBranches.map((branch) => {
                            if (branch.branch_id === branchId) {
                                return {
                                    ...branch,
                                    groups: data, // נניח ש-data הוא מערך הקבוצות
                                };
                            }
                            return branch;
                        })
                    );

                    // הוספת מזהי הקבוצות ל-selectedGroups
                    const groupIdsToAdd = data.map((group) => group.group_id);
                    setSelectedGroups((prevGroups) => [
                        ...prevGroups,
                        ...groupIdsToAdd.filter((id) => !prevGroups.includes(id)),
                    ]);
                } catch (error) {
                    console.error('Error fetching groups for branch:', error);
                }
            }
        }
    };




    const handleSaveActivity = async () => {
        console.log('Selected Groups:', selectedGroups);
        const childrenResponse = await fetch(`http://localhost:8000/children/getChildrenByGroups?group_ids=${selectedGroups}`);

        const childrenData = await childrenResponse.json();
        console.log("Fetched children:", childrenData);
        try {
            const response = await fetch(`http://localhost:8000/activities/${activityId}/groups`, {
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
            .then(data => setChildren(data)).then(console.log("children", children)).finally(() => {
                setLoading(false);
              });
    }, []);
    useEffect(() => {
        fetch('http://localhost:8000/activities/')
            .then(response => response.json())
            .then(data => setActivities(data)).then(console.log("activities", activities));
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
        setShowBranchManagersComponent(!showBranchManagersComponent);

    };

    const toggleBranchesModal = () => {
        setShowBranchesModal(!showBranchesModal);
    };







    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch({ ...newBranch, [name]: value });
    };

    if (loading) {
        return (
          <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <FadeLoader size={150} color={"#3f3939"} loading={true} />
          </div>
        );
      }
    return (
        <div className="secretry-children-list-wrapper">
            <div className="activity-button" onClick={handleCreateActivity}>
                <FaCalendarPlus className="notification-icon-style" color="#3f3939" size={24} />
            </div>
            <div >
                  <button className='children-button' onClick={() => setShowChildrenList(!showChildrenList)}>
                    <FaUsers className="notification-icon-style" color="#3f3939" size={24}/>       </button>
            
                  {showChildrenList && navigate('/secretaryList', { state: { user_id: state?.user_id } })}
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
                        <button className="save-activity-datails" onClick={handleSaveNewActivity}>
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
                            {branches.map((branch) => (
                                <li key={branch.branch_id} >
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedBranches.includes(branch.branch_id)}
                                            onChange={() => handleBranchSelection(branch.branch_id)}
                                        />
                                        {branch.branch_name}
                                    </label>

                                    {/* נוודא ש-group קיימת לפני השימוש ב-map */}
                                    {selectedBranches.includes(branch.branch_id) && branch.groups && (
                                        <div className='group-container'>
                                            <ul>
                                                {branch.groups.map((group) => (
                                                    <li key={group.group_id} className="group-container">
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
                                        </div>
                                    )}

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
                <FaMapMarkerAlt className="notification-icon-style" color="#3f3939" size={24} />
                {showTooltipBranch && <div className="home-tooltip">Branches</div>}
            </div>

            {/* טופס הסניפים */}
            {showBranchesModal && (
                <div>
                    <BranchDetails
                        toggleBranchesModal={toggleBranchesModal}
                    />
                </div>
            )}
            <div
                className="manager-icon"
                onClick={handleBranchManagersClick}
                onMouseEnter={() => setShowTooltipManager(true)}
                onMouseLeave={() => setShowTooltipManager(false)}
            >
                <FaUserTie className="notification-icon-style" color="#3f3939" size={24} />
                {showTooltipManager && <div className="home-tooltip">Branch Managers</div>}
            </div>

            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}
                onMouseEnter={() => setShowTooltipNotification(true)}
                onMouseLeave={() => setShowTooltipNotification(false)}>
                <FaCommentDots className="notification-icon-style" color="#3f3939" size={24} />
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
                <FaHome className="notification-icon-style" size={24} color="#3f3939" />
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
                <table className="secretary-children-table">
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
            )}
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
            {showBranchManagersComponent && (
                <div className="branch-managers-container">
                    <BranchManagerDetails onClose={() => setShowBranchManagersComponent(false)} />
                </div>
            )}




        </div>
    );
};

export default ChildrenList;
