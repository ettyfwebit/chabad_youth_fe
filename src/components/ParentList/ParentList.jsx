import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ManagerSideBar from '../ManagerSideBar/ManagerSideBar';
const ParentList = () =>{
        const location = useLocation()  
        const { state } = location;
        const [children, setChildren] = useState([]);
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
        
        return (
            <div className="children-list-wrapper">
               <ManagerSideBar/> 
          <h2 className="table-title">Children</h2>
          <table className="children-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Points</th>
                <th>Date of birth</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.child_id}>
                  <td>{child.child_id}</td>
                  <td>{child.name} </td>
                  <td>{child.total_points} points</td>
                  <td>{child.date_of_birth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        
          
        </div>
      );
        
}
export default ParentList