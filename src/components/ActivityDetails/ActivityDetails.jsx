import React, { useEffect, useState } from "react";
import { FiCheck } from 'react-icons/fi';
import { RiEdit2Fill } from "react-icons/ri";
import { fetchWithAuth } from '../../App';


import "./ActivityDetails.css";
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from "react-icons/fa";

const ActivityDetails = ({ activities, setActivities, activity, setActivity, onClose, branches, setBranches }) => {
    const [isEditing, setIsEditing] = useState(false); // מצב עריכה
    const [editedActivity, setEditedActivity] = useState({ ...activity }); // עותק לעריכה
    const [relevantGroups, setRelevantGroups] = useState(); // משתנה לשמירת הקבוצות הרלוונטיות
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [showDeleteActivityModal, setShowDeleteActivityModal] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [showExistingGroupSelectionModal, setShowExistingGroupSelectionModal] = useState(false)
    const [updatedBranches, setUpdatedBranches] = useState([]);


    useEffect(() => {
        if (activity && activity.branches) {
            // הגדרת הסניפים המסומנים
            const initialBranches = activity.branches.map(branch => branch.branch_id);
            setSelectedBranches(initialBranches);
            console.log(selectedBranches)

            // הגדרת הקבוצות המסומנות
            const initialGroups = activity.branches.flatMap(branch =>
                branch.groups ? branch.groups.map(group => group.group_id) : []
            );
            setSelectedGroups(initialGroups);
            console.log(selectedBranches)

        }
    }, []);
    useEffect(() => {
        const fetchGroupsForBranches = async () => {
            const branchesWithGroups = await Promise.all(
                branches.map(async (branch) => {
                    try {
                        const response = await fetchWithAuth(`http://localhost:8000/branches/${branch.branch_id}/groups`);
                        const groups = await response.json();
                        return { ...branch, groups };  // הוספת הקבוצות לסניף המתאים
                    } catch (error) {
                        console.error(`Error fetching groups for branch ${branch.branch_id}:`, error);
                        return { ...branch, groups: [] };  // במקרה של שגיאה נחזיר מערך ריק
                    }
                })
            );
            setBranches(branchesWithGroups);
        };

        if (branches.length > 0) {
            fetchGroupsForBranches();
        }
    }, []);

    const handleBranchSelection = async (branchId) => {
        const isSelected = selectedBranches.includes(branchId);
        const branch = branches.find((b) => b.branch_id === branchId);

        if (isSelected) {
            // אם הסניף כבר מסומן, נסיר אותו ואת הקבוצות שלו
            setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
            setActivity(prevActivity => ({
                ...prevActivity,
                branches: selectedBranches,  // כאן updatedBranches היא הרשימה החדשה
              }));
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
                    const response = await fetchWithAuth(`http://localhost:8000/branches/${branchId}/groups`);
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


    const handleSaveSelectionGroupsClick = async () => {
        const updatedActivityData = {
            ...editedActivity,
            branches: selectedBranches.map(branchId => ({
                branch_id: branchId,
                groups: selectedGroups
                    .filter(groupId => activity.branches.find(branch => branch.branch_id === branchId)?.groups.some(group => group.group_id === groupId))
                    .map(groupId => ({ group_id: groupId }))
            }))
        };

        setActivity(updatedActivityData);
        setIsEditing(false);

        try {
            const response = await fetchWithAuth("http://localhost:8000/activities/updateActivity", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedActivityData),
            });

            if (!response.ok) {
                throw new Error("Failed to update activity");
            }

            const updatedActivity = await response.json();
            fetchWithAuth('http://localhost:8000/activities/')
                .then(response => response.json())
                .then(data => setActivities(data));

            console.log("Activity updated successfully:", updatedActivity);
        } catch (error) {
            console.error("Error updating activity:", error);
        }
    };


    const handleGroupSelection = (groupId) => {
        if (selectedGroups.includes(groupId)) {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        } else {
            setSelectedGroups([...selectedGroups, groupId]);
        }
    };

    const handleDeleteActivityClick = (activity) => {
        setActivityToDelete(activity);
        setShowDeleteActivityModal(true);
    };
    const handleCancelDeleteActivity = () => {
        setShowDeleteActivityModal(false);
        setActivityToDelete(null);
    };

    const handleConfirmDeleteActivity = async () => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/activities/deleteActivity/${activityToDelete.activity_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setActivities(activities.filter(activity => activity.activity_id !== activityToDelete.activity_id)); // עדכון הרשימה
                setShowDeleteActivityModal(false);
                setActivityToDelete(null);
                onClose()
            } else {
                console.error('Failed to delete activity');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };


    const handleEditClick = () => {
        setIsEditing(true); // מעבר למצב עריכה
    };


    const handleSaveClick = async () => {
        setActivity(editedActivity)
        setIsEditing(false); // חזרה למצב תצוגה
        console.log(editedActivity)
        try {
            const response = await fetchWithAuth("http://localhost:8000/activities/updateActivity", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedActivity),
            });

            if (!response.ok) {
                throw new Error("Failed to update activity");
            }

            const updatedActivity = await response.json();
            fetchWithAuth('http://localhost:8000/activities/')
                .then(response => response.json())
                .then(data => {
                    setActivities(data);
                    return data; // מחזירים את הנתונים כדי להמשיך בשרשור
                })
                .then(updatedActivities => {
                    const updatedActivity = updatedActivities.find(d => d.activity_id === editedActivity.activity_id);
                    if (updatedActivity) {
                        setActivity(updatedActivity);
                        setEditedActivity(updatedActivity);
                    }
                })           
        } catch (error) {
            console.error("Error updating activity:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Field updated:", name, "New value:", value); // בדיקה

        setEditedActivity({ ...editedActivity, [name]: value });
    };

    const handleFocus = (e) => {
        e.target.select(); // בחר את כל התוכן בשדה ברגע שיש פוקוס
    };
    const saveChanges= async ()=>{
    try {const response = await fetchWithAuth(`http://localhost:8000/activities/${activity.activity_id}/groups`, {
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
      setShowExistingGroupSelectionModal(false)
    };

    return (
        <div className="activity-details-overlay">
            <div className="activity-details-form">
                <button className="close-button-details" onClick={onClose}>
                    <FaTimes size={20} />
                </button>
                <h3 className=" activity-title"> {activity.name} Details </h3>


                <div className={`activity-details-grid ${isEditing ? "editing" : "viewing"}`}>

                    <ul>
                        <div className="editing-activity">
                            <li>
                                <strong> Activity Name:</strong>{" "}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedActivity.name}
                                        onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    `${editedActivity.name}`
                                )}
                            </li>
                            <li>
                                <strong>Description</strong>{" "}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={editedActivity.description}
                                        onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    editedActivity.description
                                )}
                            </li>
                            <li>
                                <strong>Location:</strong>{" "}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={editedActivity.location}
                                        onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    editedActivity.location
                                )}
                            </li>
                            <li>
                                <strong>Start Time</strong>{" "}
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="start_time"
                                        value={editedActivity.start_time}
                                        onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    editedActivity.start_time
                                )}
                            </li>
                            <li>
                                <strong>End Time:</strong>{" "}
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="end_time"
                                        value={editedActivity.end_time}
                                        onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    editedActivity.end_time
                                )}
                            </li>
                        </div>
                    </ul>
                </div>
                <div className="activity-details-branches">
                    <h3>Branches:</h3>
                    {activity.branches && activity.branches.length > 0 ? (
                        activity.branches.map((branch, index) => (
                            <div key={index} className="branch-details">
                                <h4>{branch.branch_name}</h4>
                                <ul>
                                    {branch.groups && branch.groups.length > 0 ? (
                                        branch.groups.map((group) => (
                                            <li key={group.group_id}>
                                                <strong>Group Name:</strong> {group.group_name}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No groups available</li>
                                    )}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No branches available</p>
                    )}
                </div>


                <div className="edit-buttons">
                    {!isEditing ? (
                        <button className="edit-button" onClick={handleEditClick}>
                            <FaPen size={16} color="#3f3939" />
                        </button>
                    ) : (
                        <div>
                            <button className="edit-branches-button" onClick={() => setShowExistingGroupSelectionModal(true)}>
                            <FaPen size={14} color="#3f3939" />
                            </button>


                            <button className="activity-save-button" onClick={handleSaveClick}>

                                <FaCheck size={16} color="#3f3939" />

                            </button>
                        </div>

                    )}


                </div>




                <div className="activity-trash-icon"
                    onClick={() => handleDeleteActivityClick(editedActivity)}

                >
                    <FaTrashAlt color="#3f3939" size={16} />
                </div>
                {showDeleteActivityModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button-delete" onClick={handleCancelDeleteActivity}>
                                <FaTimes size={20} />
                            </button>
                            <h4>Are you sure you want to delete {activityToDelete?.name} </h4>
                            <button className='save-botton' onClick={handleConfirmDeleteActivity}>Yes</button>
                            <button className='no-botton' onClick={handleCancelDeleteActivity}>No</button>
                        </div>
                    </div>
                )}
                {showExistingGroupSelectionModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-branches-button" onClick={() => setShowExistingGroupSelectionModal(false)}>
                                <FaTimes size={20} />
                            </button>
                            <h3>Edit Activity Branches & Groups</h3>
                            <ul className="group-list">


                                {branches.map((branch) => (
                                    <li key={branch.branch_id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedBranches.includes(branch.branch_id)}
                                                onChange={() => handleBranchSelection(branch.branch_id)}
                                            />
                                            {branch.branch_name}
                                        </label>

                                        {(selectedBranches.includes(branch.branch_id) || activity.branches.some(b => b.branch_id === branch.branch_id)) && (

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

                            <button className="save-activity" onClick={saveChanges}>
                                Save Selection
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default ActivityDetails;
