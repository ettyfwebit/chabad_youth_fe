import React, { useEffect, useState } from "react";
import "./BranchManagerDetails.css";
import { FaTimes } from "react-icons/fa";

const BranchManagerDetails = () => {
  const [branchManagers, setBranchManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);

  // שליפת הנתונים מהשרת
  useEffect(() => {

    
    const fetchBranchManagers = async () => {

        try{
            const response = await fetch('http://localhost:8000/branches/');
            const data = await response.json();
            setBranches(data);
            getBranches()

          }
          catch(err){
            setError(err.message)
          }
      
    };

   

    fetchBranchManagers();
  }, []);
 const getBranches=async()=>{
    try {
        const response = await fetch("http://localhost:8000/branch_managers/");
        if (!response.ok) {
          throw new Error("Failed to fetch branch managers");
        }
        const data = await response.json();
        setBranchManagers(data);
     
     
      
      
      }
    
      catch (err) {
        setError(err.message);
      }
     
 }
   
    const getBranchName = (branchId) => {
        const branch = branches.find(branch => branch.branch_id === branchId);
        return branch ? branch.branch_name : "Unknown Branch";
      };
    

  // הצגת הפרטים הנבחרים
  const handleSelectManager = (manager) => {
    setSelectedManager(manager);
  };

  // סגירת הטופס
  const handleCloseForm = () => {
    setSelectedManager(null);
  };

  return (
    <div className="children-list-wrapper">
 
      <h2 className="table-title">Branch Managers</h2>
      {error && <p className="error-message">Error: {error}</p>}
      {!branchManagers.length && <p className="loading">Loading...</p>}

      <div className="table-container">
        <table className="children-table">
          <tbody>
          {branchManagers.map((manager) => (
            <tr key={manager.branch_manager_id} onClick={() => handleSelectManager(manager)}>
            
    
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
      </div>

      {/* טופס הפרטים */}
      {selectedManager && (
        <div className="modal-form">
          <button className="close-button" onClick={handleCloseForm}>
              <FaTimes size={20} />
            </button>
          <h2>Details for {selectedManager.login_user.user_name}</h2>
          <p><strong>Email:</strong> {selectedManager.login_user.email}</p>
          <p><strong>Phone:</strong> {selectedManager.login_user.phone}</p>
          <p><strong>Branch ID:</strong> {selectedManager.branch_manager.branch_id}</p>
          <p><strong>Additional Info:</strong> {selectedManager.branch_manager.additional_info}</p>
        </div>
      )}

      {/* רקע כהה כשחלון הטופס פתוח */}
      {selectedManager && (
        <div className="overlay" onClick={handleCloseForm}></div>
      )}
    </div>
  );
};

export default BranchManagerDetails;
