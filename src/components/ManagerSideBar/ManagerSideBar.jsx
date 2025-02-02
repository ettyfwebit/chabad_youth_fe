import React, { useState } from 'react';
import './ManagerSideBar.css'; // קובץ ה-CSS לעיצוב ה-SideBar
import ChildForm from '../ChildForm/ChildForm';
import { VscHome } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../App';

const ManagerSideBar = ({ user_id,branches, classes, shirts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleFormSubmit =async (formData) => {
    formData.parent_id=user_id
    const formattedData = {
      ...formData,
      address: {
          city: formData.address.city,
          street: formData.address.street,
          houseNumber: formData.address.houseNumber,
      },
      has_health_issue: formData.has_health_issue === "yes",
      parental_approval: formData.parental_approval === "yes",
  };

    try {
      const response = await fetchWithAuth("http://localhost:8000/children/addNewChild", {
        method: 'POST', // השתמש ב-POST או PUT לפי הצורך
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert('Child details updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update child: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating child details.');
    }
 
  console.log('Submitted Data:', formData);
  setIsFormOpen(false); // סגור את הטופס לאחר שליחה
};

return (

  <div className="side-bar">
    <button className="side-bar-button" onClick={() => navigate('/')}>Home <VscHome /></button>
    <button className="side-bar-button">Profile</button>
    <button className="side-bar-button">exit </button>
    <button className="side-bar-button" onClick={() => setIsFormOpen(true)}>new Child</button>
    {isFormOpen && (
      <ChildForm
        branches={branches}
        classes={classes}
        shirts={shirts}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />
    )}    </div>
);
};

export default ManagerSideBar;