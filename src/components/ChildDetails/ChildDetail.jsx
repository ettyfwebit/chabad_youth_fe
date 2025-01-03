import React, { useEffect, useState } from "react";
import { FiCheck } from 'react-icons/fi';
import { RiEdit2Fill } from "react-icons/ri";


import "./ChildDetail.css";
import { FaCheck, FaPen, FaTimes } from "react-icons/fa";

const ChildDetails = ({ child, setChild, branches, classes, shirts, groups, onClose }) => {
  const [isEditing, setIsEditing] = useState(false); // מצב עריכה
  const [editedChild, setEditedChild] = useState({ ...child }); // עותק לעריכה
  const [relevantGroups, setRelevantGroups] = useState(); // משתנה לשמירת הקבוצות הרלוונטיות
 useEffect(() => {
    const fetchRelevantGroups = async () => {
    const filteredGroups = groups.filter(group => group.branch_id === editedChild.branch_id);
    setRelevantGroups(filteredGroups);
    };
    fetchRelevantGroups();
  }, []);
  if (!child) return null;
  const getBranchNameById = (branchId) => {
    const branch = branches.find(branch => branch.branch_id == branchId);
    return branch ? branch.branch_name : "Unknown Branch"; // אם לא נמצא סניף, הצג "סניף לא ידוע"
  };
  const getClassNameById = (classId) => {
    const grade = classes.find(grade => grade.class_id == classId);
    return grade ? grade.class_name : "Unknown Class"; // אם לא נמצא סניף, הצג "סניף לא ידוע"
  };
  const getShirtSizeById = (shirtId) => {
    console.log(shirtId)
    const shirtSize = shirts.find(shirt => shirt.shirt_size_id == shirtId);
    console.log(shirtSize)
    return shirtSize ? shirtSize.shirt_size : "Unknown shirt size"; // אם לא נמצא סניף, הצג "סניף לא ידוע"
  };
  const getGroupNameById = (groupId) => {
    const match_group = groups.find(group => group.group_id == groupId);
    return match_group ? match_group.group_name : "Unknown Group"; // אם לא נמצא סניף, הצג "סניף לא ידוע"
  };
  const filterGroups = (branchId) => {    // פונקציה לסינון הקבוצות לפי branch_id
    const filteredGroups = groups.filter(group => group.branch_id == branchId);
    setRelevantGroups(filteredGroups);
  }
  const handleEditClick = () => {
    setIsEditing(true); // מעבר למצב עריכה
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedChild({
          ...editedChild,
          image: reader.result.split(",")[1], // המרת ה-Base64
        });
      };
      reader.readAsDataURL(file);
    }
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
    console.log("Field updated:", name, "New value:", value); // בדיקה

    setEditedChild({ ...editedChild, [name]: value });
  };
  const handleBranchChange = (e) => {
    const { name, value } = e.target;
    setEditedChild({ ...editedChild, [name]: value });
    filterGroups(value);
  };
  const handleFocus = (e) => {
    e.target.select(); // בחר את כל התוכן בשדה ברגע שיש פוקוס
  };

  return (
    <div className="child-details-overlay">
      <div className="child-details-form">
        <button className="close-button-details" onClick={onClose}>
                   <FaTimes size={20} />
                 </button>
        <div className="child-image">
          {isEditing ? (
            <div className="image-upload-container">
              <img
                src={`data:image/png;base64,${editedChild.image}`}
                alt={`Child ${editedChild.first_name}`}
                onClick={() => document.getElementById("image-upload").click()} // לחיצה על התמונה תפתח את דיאלוג הבחירה

                className="child-image"
              />
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <img
              src={`data:image/png;base64,${editedChild.image}`}
              alt={`Child ${editedChild.first_name}`}
              className="child-image"
            />
          )}

        </div>
        <div className={`child-details-grid ${isEditing ? "editing" : "viewing"}`}>

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
                />) : (editedChild.house_number)}
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

              ) : (editedChild.mother_name)}

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
                />) : (editedChild.mother_phone)}


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
              ) : (editedChild.father_name)}
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

              <strong>Branch:</strong>{" "}
              {isEditing ? (
                <select
                  name="branch_id"
                  value={editedChild.branch_id}
                  onChange={handleBranchChange}
                >
                  {branches.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              ) : (
                getBranchNameById(editedChild.branch_id)
              )}
            </li>
            <li>

              <strong>Group:</strong>{" "}
              {isEditing ? (
                <select
                  name="branch_group_id"
                  value={editedChild.branch_group_id}
                  onChange={handleInputChange}
                >
                  {relevantGroups.map((group) => (
                    <option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              ) : (
                console.log(editedChild),
                getGroupNameById(editedChild.branch_group_id)
              )}
            </li>

            <li>
              <strong>Class:</strong>{" "}
              {isEditing ? (
                <select
                  name="class_id"
                  value={editedChild.class_id}
                  onChange={handleInputChange}
                >
                  {classes.map((grade) => (
                    <option key={grade.class_id} value={grade.class_id}>
                      {grade.class_name}
                    </option>
                  ))}
                </select>
              ) : (
                getClassNameById(editedChild.class_id)
              )}
            </li>
            <li>
              <strong>Shirt size:</strong>{" "}
              {isEditing ? (
                <select
                  name="shirt_size_id"
                  value={editedChild.shirt_size_id}
                  onChange={handleInputChange}
                >
                  {shirts.map((shirtSize) => (
                    <option key={shirtSize.shirt_size_id} value={shirtSize.shirt_size_id}>
                      {shirtSize.shirt_size}
                    </option>
                  ))}
                </select>
              ) : (
                getShirtSizeById(editedChild.shirt_size_id)
              )}
            </li>
          </div>

        </ul>
        </div>

        <div className="edit-buttons">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>
              <FaPen size={20} color="#3f3939" />
            </button>
          ) : (
            <button className="save-button" onClick={handleSaveClick}>

              <FaCheck size={20} color="#3f3939" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;
