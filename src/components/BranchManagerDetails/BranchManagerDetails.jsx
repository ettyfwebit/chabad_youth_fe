import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaCheck, FaPen } from "react-icons/fa";
import "./BranchManagerDetails.css";

const BranchManagerDetails = () => {
  const [branchManagers, setBranchManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newManager, setNewManager] = useState(null);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);

  const fetchBranchManagers = async () => {
    try {
      const response = await fetch("http://localhost:8000/branch_managers/");
      const data = await response.json();
      setBranchManagers(data);
    } catch (err) {
      setError(err.message);
    }
  };
  // שליפת נתונים מהשרת
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:8000/branches/");
        const data = await response.json();
        setBranches(data);
        fetchBranchManagers();
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBranchManagers = async () => {
      try {
        const response = await fetch("http://localhost:8000/branch_managers/");
        const data = await response.json();
        setBranchManagers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  const getBranchName = (branchId) => {
    const branch = branches.find((branch) => branch.branch_id === branchId);
    return branch ? branch.branch_name : "Unknown Branch";
  };

  const handleEditManager = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      // שמירה בשרת
      const response = await fetch(
        `http://localhost:8000/branch_managers/${selectedManager.branch_manager.branch_manager_id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedManager),
        }
      );
      if (!response.ok) throw new Error("Failed to save manager details");
      await fetchBranchManagers();

      // קבלת המנהל המעודכן מהשרת
      const updatedManager = await response.json();
  
      // עדכון הרשימה המקומית של branchManagers
      setBranchManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.branch_manager_id === updatedManager.branch_manager.branch_manager_id
            ? updatedManager // החלפת המנהל המעודכן
            : manager
        )
      );
  
      // עדכון selectedManager
      setSelectedManager(updatedManager);
  
      // יציאה ממצב עריכה
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };
  
  

  const handleAddManager = async () => {
    try {
      const response = await fetch("http://localhost:8000/branch_managers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newManager),
      });
      if (!response.ok) throw new Error("Failed to add new manager");
      setNewManager(null);
      const newManagerData = await response.json();
      setBranchManagers([...branchManagers, newManagerData]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="children-list-wrapper">
      <h2 className="table-title-branch-manager">Branch Managers</h2>
      {error && <p className="error-message">Error: {error}</p>}
      {!branchManagers.length && <p className="loading">Loading...</p>}

      <div className="table-container">
        <table className="children-table">
          <tbody>
            {branchManagers.map((manager) => (
              <tr key={manager.branch_manager_id} onClick={() => setSelectedManager(manager)}>
                <td className="profile-td">
                  <div className="profile-wrapper">
                    <div className="name-wrapper">
                      <div className="name">{manager.login_user.user_name}</div>
                      <div className="id-number">{getBranchName(manager.branch_manager.branch_id)}</div>
                    </div>
                  </div>
                </td>
                <td className="city-td">
                  <div className="location-wrapper">
                    <div className="city">{manager.login_user.email}</div>
                    <div className="street">{manager.login_user.phone || "N/A"}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-button" onClick={() => setNewManager({ login_user: {}, branch_manager: {} })}>
          <FaPlus size={24} color="#3f3939" />
        </button>
      </div>

      {/* טופס עריכה */}
      {selectedManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedManager(null)}>
              <FaTimes size={20} />
            </button>
            {isEditing ? (
              <>
                <h3>Editing {selectedManager.login_user.user_name}</h3>
                <label>Username:</label>
                <input
                  type="text"
                  value={selectedManager.login_user.user_name}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      login_user: { ...selectedManager.login_user, user_name: e.target.value },
                    })
                  }
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={selectedManager.login_user.email}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      login_user: { ...selectedManager.login_user, email: e.target.value },
                    })
                  }
                />
                <label>Phone:</label>
                <input
                  type="text"
                  value={selectedManager.login_user.phone || ""}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      login_user: { ...selectedManager.login_user, phone: e.target.value },
                    })
                  }
                />
                 <div className="form-row">
                 <label htmlFor="branch">Branch:</label>
                <select
                  value={selectedManager.branch_manager.branch_id}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      branch_manager: { ...selectedManager.branch_manager, branch_id: e.target.value },
                    })
                  }
                >
                  {branches.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
                </div>

              </>
            ) : (
              <>
                <h3>Details for {selectedManager.login_user.user_name}</h3>
                <p><strong>Email:</strong> {selectedManager.login_user.email}</p>
                <p><strong>Phone:</strong> {selectedManager.login_user.phone}</p>
                <p><strong>Branch:</strong> {getBranchName(selectedManager.branch_manager.branch_id)}</p>
              </>
            )}

            <div className="edit-button" onClick={isEditing ? handleSaveEdit : handleEditManager}>
              {isEditing ? <FaCheck color="#3f3939" size={20} /> : <FaPen color="#3f3939" size={20} />}
            </div>
          </div>
        </div>
      )}

      {/* טופס הוספה */}
      {newManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setNewManager(null)}>
              <FaTimes size={20} />
            </button>
            <h2>Add New Manager</h2>
            <div className="form-row">
              <label>Username:</label>
              <input
                type="text"
                onChange={(e) =>
                  setNewManager({ ...newManager, login_user: { ...newManager.login_user, user_name: e.target.value } })
                }
              />
            </div>
            <div className="form-row">
              <label>Email:</label>
              <input
                type="email"
                onChange={(e) =>
                  setNewManager({ ...newManager, login_user: { ...newManager.login_user, email: e.target.value } })
                }
              />
            </div>
            <div className="form-row">
              <label>Phone:</label>
              <input
                type="text"
                onChange={(e) =>
                  setNewManager({ ...newManager, login_user: { ...newManager.login_user, phone: e.target.value } })
                }
              />
            </div>
            <div className="form-row">
              <label>Password:</label>
              <input
                type="password"
                onChange={(e) =>
                  setNewManager({ ...newManager, login_user: { ...newManager.login_user, password: e.target.value } })
                }
              />
            </div>
            <div className="form-row">
              <label>Branch:</label>
              <select
                value={newManager.branch_manager.branch_id || ""}
                onChange={(e) =>
                  setNewManager({
                    ...newManager,
                    branch_manager: { ...newManager.branch_manager, branch_id: e.target.value },
                  })
                }
              >
                 <option value="" disabled>
    Select a branch
  </option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>
            <button className="save-new-branch-manager-button" onClick={handleAddManager}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagerDetails;
