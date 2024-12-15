import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ManagerSideBar from '../ManagerSideBar/ManagerSideBar';
import './ParentList.css';
import ChildDetails from '../ChildDetails/ChildDetail';

const ParentList = () => {
  const location = useLocation()
  const { state } = location;
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

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

  return (
    <div className="children-list-wrapper">
      <ManagerSideBar 
        user_id={state?.user_id}
/>
      <h2 className="table-title">Children</h2>
      <table className="children-table">
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
        onClose={() => setSelectedChild(null)}
      />
    )}
    </div>
  );

}
export default ParentList