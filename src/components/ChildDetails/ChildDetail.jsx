import'./ChildDetail.css';
import React from 'react';

const ChildDetails = ({ child, onClose }) => {
    if (!child) return null;
  
    return (
      <div className="child-details-overlay">
        <div className="child-details-form">
          <button className="close-button" onClick={onClose}>X</button>
          <h3>Child Details</h3>
          <div className="child-image">
            <img
              src={`data:image/png;base64,${child.image}`}
              alt={`Child ${child.first_name}`}
            />
          </div>
          <ul>
            <li><strong>Name:</strong> {child.first_name} {child.last_name}</li>
            <li><strong>Nickname:</strong> {child.nickname}</li>
            <li><strong>Date of Birth:</strong> {child.date_of_birth}</li>
            <li><strong>ID Number:</strong> {child.id_number}</li>
            <li><strong>School:</strong> {child.school_name}</li>
            <li><strong>Address:</strong> {child.street} {child.house_number}, {child.city}</li>
            <li><strong>Parent Email:</strong> {child.parent_email}</li>
            <li><strong>Mother:</strong> {child.mother_name} ({child.mother_phone})</li>
            <li><strong>Father:</strong> {child.father_name} ({child.father_phone})</li>
            <li><strong>Phone:</strong> {child.phone}</li>
            <li><strong>Total Points:</strong> {child.total_points}</li>
            <li><strong>Branch ID:</strong> {child.branch_id}</li>
            <li><strong>Class ID:</strong> {child.class_id}</li>
            <li><strong>Shirt ID:</strong> {child.shirt_id}</li>
          </ul>
        </div>
      </div>
    );
  };
  export default ChildDetails;
  