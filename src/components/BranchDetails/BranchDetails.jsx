import React, { useEffect, useState } from 'react';
import { FaCheck, FaPen, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa';
import './BranchDetails.css';
import { fetchWithAuth } from '../../App';

const BranchDetails = ({ toggleBranchesModal }) => {
    const [branches, setBranches] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showBranchesModal, setShowBranchesModal] = useState(false); // מצב לתצוגת 
    const [selectedBranch, setSelectedBranch] = useState(null); // סניף שנבחר להצגה
    const [newBranch, setNewBranch] = useState({ branch_name: '', location: '' }); // סניף חדש
    const [showAddBranchForm, setShowAddBranchForm] = useState(false); // ניהול מצב טופס הוספה
    const [isEditing, setIsEditing] = useState(false); // ניהול מצב עריכה
    const [editedBranch, setEditedBranch] = useState(null); // ניהול פרטי הסניף בעריכה
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const handleDeleteIconClick = (e, branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };
    const [newGroup, setNewGroup] = useState({ group_name: '' });
    const [showAddGroupForm, setShowAddGroupForm] = useState(false);

    const handleDeleteGroupClick = (e, group) => {
        setGroupToDelete(group);
        setShowDeleteGroup(true);
    };
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setBranchToDelete(null);
    }; 
    const handleCancelGroupDelete = () => {
        setShowDeleteGroup(false);
        setGroupToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/branches/deleteBranch/${branchToDelete.branch_id}`, {
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
                const response = await fetchWithAuth('http://localhost:8000/branches/');
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
                const response = await fetchWithAuth('http://localhost:8000/groups/');
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchGroups();
    }, []);
    useEffect(() => {
        if (selectedBranch) {
            const fetchGroupsForBranch = async () => {
                try {
                    const response = await fetchWithAuth(`http://localhost:8000/branches/${selectedBranch.branch_id}/groups`);
                    const data = await response.json();
                    setGroups(data);
                } catch (error) {
                    console.error('Error fetching groups for branch:', error);
                }
            };

            fetchGroupsForBranch();
        }
    }, [selectedBranch]);


    const handleBranchClick = (branch) => {
        setSelectedBranch(branch); // שמירת הסניף שנבחר
    };

    const closeBranchDetails = () => {
        setSelectedBranch(null); // סגירת תיבת פרטי הסניף
        setIsEditing(false)
    };

    const toggleAddBranchForm = () => {
        setShowAddBranchForm(!showAddBranchForm);
        setNewBranch({ branch_name: '', location: '' })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch({ ...newBranch, [name]: value });
    };

    const handleSaveBranch = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8000/branches/addNewBranch', {
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
            const response = await fetchWithAuth('http://localhost:8000/branches/updateBranch', {
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
        handleSaveGroupEdit()
    };
    const handleGroupDelete = async () => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/branches/groups/${groupToDelete.group_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGroups(groups.filter(g => g.group_id !== groupToDelete.group_id));
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
        setShowDeleteGroup(false);
    };
    const handleGroupEditInputChange = (e, group) => {
        const updatedGroups = groups.map(g =>
            g.group_id === group.group_id ? { ...g, group_name: e.target.value } : g
        );
        setGroups(updatedGroups);
    };

    const handleSaveGroupEdit = async () => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/branches/groups`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groups),
            });

            if (response.ok) {
                const updatedGroup = await response.json();
                setGroups(groups.map(g => g.group_id === updatedGroup.group_id ? updatedGroup : g));
            } else {
                console.error('Failed to update group');
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };
    const handleSaveGroup = async () => {
        try {
            const response = await fetchWithAuth(`http://localhost:8000/branches/${selectedBranch.branch_id}/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });
    
            if (response.ok) {
                const savedGroup = await response.json();
                setGroups([...groups, savedGroup]); // עדכון הרשימה
                setShowAddGroupForm(false); // סגירת הטופס
                setNewGroup({ group_name: '' }); // איפוס הטופס
            } else {
                console.error('Failed to save group');
            }
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };
    



    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-content">
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
                                    size={14}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

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
                                <div>
                                    <h4>Groups under this branch:</h4>
                                    <ul>
                                        {groups.map(group => (
                                            <li key={group.group_id}>
                                                <input
                                                    type="text"
                                                    value={group.group_name}
                                                    onChange={(e) => handleGroupEditInputChange(e, group)}
                                                />
                                              
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        ) : (
                            <div className='form-field'>
                                <p><strong>Name:</strong> {selectedBranch.branch_name}</p>
                                <p><strong>Location:</strong> {selectedBranch.location}</p>
                                <h4>Groups under this branch:</h4>
                                <ul>
                                    {groups.map(group => (
                                        <li className='branch-item' key={group.group_id}>
                                            <FaTrashAlt
                                                className="delete-icon"
                                                onClick={(e) => handleDeleteGroupClick(e,group)}
                                                size={14}
                                            />
                                            <strong>{group.group_name}</strong>

                                        </li>
                                    ))}
                                </ul>
                                <div className="add-group-button" onClick={() => setShowAddGroupForm(true)}>
                                    <FaPlus size={20} />
                                </div>

                            </div>
                        )}

                        {/* כפתור עריכה או אישור */}
                        <div
                            className="edit-button"
                            onClick={isEditing ? handleSaveEditBranch : handleEditBranch}
                        >
                            {isEditing ? <FaCheck color="#3f3939" size={20} /> : <FaPen color="#3f3939" size={20} />}
                        </div>
                        {showAddGroupForm && (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-button" onClick={() => setShowAddGroupForm(false)}>
                <FaTimes size={20} />
            </button>
            <h3>Add New Group</h3>
            <div>
                <label>Group Name:</label>
                <input
                    type="text"
                    name="group_name"
                    value={newGroup.group_name}
                    onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value })}
                />
            </div>
            <button className="save-new-group" onClick={handleSaveGroup}>Save</button>
        </div>
    </div>
)}

                      
                        {showDeleteModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="close-button" onClick={handleCancelDelete}>
                                        <FaTimes size={20} />
                                    </button>
                                    <h4> <strong>Are you sure you want to delete</strong>&nbsp; {branchToDelete?.branch_name}?</h4>
                                    <button className='save-botton' onClick={handleConfirmDelete}>Yes</button>
                                    <button className='no-botton' onClick={handleCancelDelete}>No</button>
                                </div>
                            </div>
                        )}             
                         {showDeleteGroup && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="close-button" onClick={handleCancelGroupDelete}>
                                        <FaTimes size={20} />
                                    </button>
                                    <h4> <strong>Are you sure you want to delete</strong>&nbsp; {groupToDelete?.group_name}?</h4>
                                    <button className='save-botton' onClick={handleGroupDelete}>Yes</button>
                                    <button className='no-botton' onClick={handleCancelGroupDelete}>No</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            )




            }
        </div>
    )
}
export default BranchDetails;
