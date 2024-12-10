import React ,{useState} from 'react';
import './ManagerSideBar.css'; // קובץ ה-CSS לעיצוב ה-SideBar
import ChildForm from '../ChildForm/ChildForm';

const ManagerSideBar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleFormSubmit = (formData) => {
    console.log('Submitted Data:', formData);
    setIsFormOpen(false); // סגור את הטופס לאחר שליחה
  };
  return (
    
    <div className="side-bar">
       <button className="side-bar-button">Home</button>
       <button className="side-bar-button">Profile</button>
       <button className="side-bar-button">exit </button>
       <button className="side-bar-button" onClick={() => setIsFormOpen(true)}>new Child</button>
        {isFormOpen && (
          <ChildForm
          
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}    </div>
  );
};

export default ManagerSideBar;