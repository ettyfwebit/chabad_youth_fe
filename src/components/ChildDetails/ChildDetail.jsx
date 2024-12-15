import React, { useState } from "react";
import "./ChildDetail.css";

const ChildDetails = ({ child, setChild, onClose }) => {
  const [isEditing, setIsEditing] = useState(false); // מצב עריכה
  const [editedChild, setEditedChild] = useState({ ...child }); // עותק לעריכה

  if (!child) return null;

  const handleEditClick = () => {
    setIsEditing(true); // מעבר למצב עריכה
  };

  const handleSaveClick = async () => {
    setChild(editedChild)
    setIsEditing(false); // חזרה למצב תצוגה
        try {
      const response = await fetch("http://localhost:8000/children/updateChild", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedChild),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update child");
      }
  
      const updatedChild = await response.json();
      console.log("Child updated successfully:", updatedChild);
    } catch (error) {
      console.error("Error updating child:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedChild({ ...editedChild, [name]: value });
  };
  const handleFocus = (e) => {
    e.target.select(); // בחר את כל התוכן בשדה ברגע שיש פוקוס
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
          <div className="editing">
            <li>
              <strong>Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={editedChild.first_name}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                `${editedChild.first_name}`
              )}
            </li>
            <li>
              <strong>Last Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={editedChild.last_name}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.last_name
              )}
            </li>
            <li>
              <strong>Nickname:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={editedChild.nickname}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.nickname
              )}
            </li>
            <li>
              <strong>Date of Birth:</strong>{" "}
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={editedChild.date_of_birth}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.date_of_birth
              )}
            </li>
            <li>
              <strong>ID Number:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="id_number"
                  value={editedChild.id_number}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.id_number
              )}
            </li>
            <li>
              <strong>School:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="school_name"
                  value={editedChild.school_name}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.school_name
              )}
            </li>
            <li>
              <strong>Street:</strong>{" "}
              {isEditing ? (

                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={editedChild.street}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />

              ) : (editedChild.street)
              }</li>
            <li>
              <strong>House number:</strong>{" "}

              {isEditing ? (
                <input
                  type="text"
                  name="house_number"
                  placeholder="House Number"
                  value={editedChild.house_number}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />) : (editedChild.street)}
            </li>
            <li>
              <strong>City:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={editedChild.city}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />) : (editedChild.city)}
            </li>




            <li>
              <strong>Parent Email:</strong>{" "}
              {isEditing ? (
                <input
                  type="email"
                  name="parent_email"
                  value={editedChild.parent_email}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.parent_email
              )}
            </li>
            <li>
              <strong>Mother:</strong>{" "}
              {isEditing ? (
                     <input
                    type="text"
                    name="mother_name"
                    placeholder="Mother's Name"
                    value={editedChild.mother_name}
                    onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                    onChange={handleInputChange}
                  />
                 
                  ):(editedChild.mother_name)}
                  
                   </li>
                   <li>
                  <strong>Mother phoמe:</strong>{" "}
                  {isEditing ? (
                  <input
                    type="text"
                    name="mother_phone"
                    placeholder="Mother's Phone"
                    value={editedChild.mother_phone}
                    onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                    onChange={handleInputChange}
                  />):(editedChild.mother_phone)}
              
              
            </li>
            <li>
              <strong>Father:</strong>{" "}
              {isEditing ? (
              
                  <input
                    type="text"
                    name="father_name"
                    placeholder="Father's Name"
                    value={editedChild.father_name}
                    onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                    onChange={handleInputChange}
                  />
              ):(editedChild.father_name)}
              </li>
              <li>
              <strong>Father phone:</strong>{" "}
              {isEditing ? (
                  <input
                    type="text"
                    name="father_phone"
                    placeholder="Father's Phone"
                    value={editedChild.father_phone}
                    onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                    onChange={handleInputChange}
                  />
              
              ) : (
                editedChild.father_phone
              )}
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedChild.phone}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.phone
              )}
            </li>
            <li>
              <strong>Total Points:</strong>{" "}
              {isEditing ? (
                <input
                  type="number"
                  name="total_points"
                  value={editedChild.total_points}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.total_points
              )}
            </li>
            <li>
              <strong>Branch ID:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="branch_id"
                  value={editedChild.branch_id}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.branch_id
              )}
            </li>
            <li>
              <strong>Class ID:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="class_id"
                  value={editedChild.class_id}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.class_id
              )}
            </li>
            <li>
              <strong>Shirt ID:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="shirt_id"
                  value={editedChild.shirt_size_id}
                  onFocus={handleFocus} // תוסף ככה שהשדה ייבחר אוטומטית
                  onChange={handleInputChange}
                />
              ) : (
                editedChild.shirt_id
              )}
            </li>
          </div>

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
