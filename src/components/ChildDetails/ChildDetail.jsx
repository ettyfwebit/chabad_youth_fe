import React, { useState } from "react";
import "./ChildDetail.css";

const ChildDetails = ({ child, onClose }) => {
  const [isEditing, setIsEditing] = useState(false); // מצב עריכה
  const [editedChild, setEditedChild] = useState({ ...child }); // עותק לעריכה

  if (!child) return null;

  const handleEditClick = () => {
    setIsEditing(true); // מעבר למצב עריכה
  };

  const handleSaveClick = () => {
    setIsEditing(false); // חזרה למצב תצוגה
    console.log("Saved child:", editedChild); // כאן ניתן לקרוא ל-API לעדכון
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedChild({ ...editedChild, [name]: value });
  };

  return (
    <div className="child-details-overlay">
      <div className="child-details-form">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="child-image">
          <img
            src={`data:image/png;base64,${child.image}`}
            alt={`Child ${child.first_name}`}
          />
        </div>
        <ul>
          <li>
            <strong>Name:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={editedChild.first_name}
                onChange={handleInputChange}
              />
            ) : (
              `${child.first_name}`
            )}
          </li>
          <li>
            <strong>Last Name:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={editedChild.last_name}
                onChange={handleInputChange}
              />
            ) : (
              child.last_name
            )}
          </li>
          <li>
            <strong>Nickname:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="nickname"
                value={editedChild.nickname}
                onChange={handleInputChange}
              />
            ) : (
              child.nickname
            )}
          </li>
          <li>
            <strong>Date of Birth:</strong>{" "}
            {isEditing ? (
              <input
                type="date"
                name="date_of_birth"
                value={editedChild.date_of_birth}
                onChange={handleInputChange}
              />
            ) : (
              child.date_of_birth
            )}
          </li>
          <li>
            <strong>ID Number:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="id_number"
                value={editedChild.id_number}
                onChange={handleInputChange}
              />
            ) : (
              child.id_number
            )}
          </li>
          <li>
            <strong>School:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="school_name"
                value={editedChild.school_name}
                onChange={handleInputChange}
              />
            ) : (
              child.school_name
            )}
          </li>
          <li>
            <strong>Address:</strong>{" "}
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={editedChild.street}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="house_number"
                  placeholder="House Number"
                  value={editedChild.house_number}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={editedChild.city}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              `${child.street} ${child.house_number}, ${child.city}`
            )}
          </li>
          <li>
            <strong>Parent Email:</strong>{" "}
            {isEditing ? (
              <input
                type="email"
                name="parent_email"
                value={editedChild.parent_email}
                onChange={handleInputChange}
              />
            ) : (
              child.parent_email
            )}
          </li>
          <li>
            <strong>Mother:</strong>{" "}
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="mother_name"
                  placeholder="Mother's Name"
                  value={editedChild.mother_name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="mother_phone"
                  placeholder="Mother's Phone"
                  value={editedChild.mother_phone}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              `${child.mother_name} (${child.mother_phone})`
            )}
          </li>
          <li>
            <strong>Father:</strong>{" "}
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="father_name"
                  placeholder="Father's Name"
                  value={editedChild.father_name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="father_phone"
                  placeholder="Father's Phone"
                  value={editedChild.father_phone}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              `${child.father_name} (${child.father_phone})`
            )}
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editedChild.phone}
                onChange={handleInputChange}
              />
            ) : (
              child.phone
            )}
          </li>
          <li>
            <strong>Total Points:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                name="total_points"
                value={editedChild.total_points}
                onChange={handleInputChange}
              />
            ) : (
              child.total_points
            )}
          </li>
          <li>
            <strong>Branch ID:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="branch_id"
                value={editedChild.branch_id}
                onChange={handleInputChange}
              />
            ) : (
              child.branch_id
            )}
          </li>
          <li>
            <strong>Class ID:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="class_id"
                value={editedChild.class_id}
                onChange={handleInputChange}
              />
            ) : (
              child.class_id
            )}
          </li>
          <li>
            <strong>Shirt ID:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="shirt_id"
                value={editedChild.shirt_size_id}
                onChange={handleInputChange}
              />
            ) : (
              child.shirt_id
            )}
          </li>
        </ul>

        <div className="edit-buttons">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>
              ✏️
            </button>
          ) : (
            <button className="save-button" onClick={handleSaveClick}>
              ✔️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;
