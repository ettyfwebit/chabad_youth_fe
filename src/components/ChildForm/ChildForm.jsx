import './ChildForm.css';
import React, { useState } from 'react';

const ChildForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        nickname: '',
        date_of_birth: '',
        id_number: '',
        school_name: '',
        address: { city: '', street: '', houseNumber: '' },
        parent_email: '',
        mother_name: '',
        mother_phone: '',
        father_name: '',
        father_phone: '',
        branch_name: '',
        class: '',
        shirt_size: '',
        phone: '',
        image: '',
        has_health_issue: '', // כן או לא
        health_issue_note: '', // הערה לבעיה בריאותית
        parental_approval: '' // כן או לא
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, image: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { city, street, houseNumber } = formData.address;
        console.log("City:", city);
        console.log("Street:", street);
        console.log("House Number:", houseNumber);
        onSubmit(formData);
    };
    const handleAddressChange = (e) => {
        const value = e.target.value;
        const regex = /^([^,]+),\s*([^,]+),\s*(\d+)$/; // פורמט: עיר, רחוב, מספר בית
        const match = value.match(regex);

        if (match) {
            setFormData((prevData) => ({
                ...prevData,
                address: {
                    city: match[1],
                    street: match[2],
                    houseNumber: match[3],
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                address: { city: '', street: '', houseNumber: '' },
            }));
        }
    };


    return (
        <div className="new-child-form">
            <div className="child-details-overlay">
                <div className="child-details-form">
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                    <h3>Add new child</h3>
                    <div className="child-image">
                        <label htmlFor="imageUpload">
                            <img
                                src={
                                    formData.image
                                        ? formData.image
                                        : 'https://via.placeholder.com/100'
                                }
                                alt="Child Profile"
                            />
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // הסתרת הקלט

                            />
                        </label>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <ul>
                            <li>
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Nickname:
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={formData.nickname}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    ID Number:
                                    <input
                                        type="text"
                                        name="id_number"
                                        value={formData.id_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    School Name:
                                    <input
                                        type="text"
                                        name="school_name"
                                        value={formData.school_name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Full Address :
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="city, street, houseNumber"
                                        onChange={handleAddressChange}
                                        required
                                        className="address" />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Parent Email:
                                    <input
                                        type="email"
                                        name="parent_email"
                                        value={formData.parent_email}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Mother Name:
                                    <input
                                        type="text"
                                        name="mother_name"
                                        value={formData.mother_name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Mother Phone:
                                    <input
                                        type="tel"
                                        name="mother_phone"
                                        value={formData.mother_phone}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Father Name:
                                    <input
                                        type="text"
                                        name="father_name"
                                        value={formData.father_name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Father Phone:
                                    <input
                                        type="tel"
                                        name="father_phone"
                                        value={formData.father_phone}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Branch Name:
                                    <input
                                        type="text"
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Phone:
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    Class:
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        <option value="ז">ז</option>
                                        <option value="ח">ח</option>
                                        <option value="ט">ט</option>
                                        <option value="י">י</option>
                                        <option value="יא">יא</option>
                                        <option value="יב">יב</option>
                                    </select>
                                </label>
                            </li>
                            <li>
                                <label>
                                    Shirt Size:
                                    <select
                                        name="shirt_size"
                                        value={formData.shirt_size}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Size</option>
                                        <option value="xs">XS</option>
                                        <option value="s">S</option>
                                        <option value="m">M</option>
                                        <option value="l">L</option>
                                        <option value="xl">XL</option>
                                        <option value="xxl">XXL</option>
                                    </select>
                                </label>
                            </li>
                            <li>
                                <label>האם יש בעיה בריאותית?</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="has_health_issue"
                                            value="yes"
                                            checked={formData.has_health_issue === 'yes'}
                                            onChange={handleRadioChange}
                                        />
                                        כן
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="has_health_issue"
                                            value="no"
                                            checked={formData.has_health_issue === 'no'}
                                            onChange={handleRadioChange}
                                        />
                                        לא
                                    </label>
                                    {formData.has_health_issue === 'yes' && (
                                        <textarea
                                            className="health-issue-note"
                                            name="health_issue_note"
                                            value={formData.health_issue_note}
                                            onChange={handleInputChange}
                                            placeholder="נא לפרט את הבעיה הבריאותית"
                                            required
                                        ></textarea>
                                    )}
                                </div>
                            </li>
                            <li>
                                <label>האם יש אישור הורים?</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="has_parent_approval"
                                            value="yes"
                                            checked={formData.has_parent_approval === 'yes'}
                                            onChange={handleRadioChange}
                                        />
                                        כן
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="has_parent_approval"
                                            value="no"
                                            checked={formData.has_parent_approval === 'no'}
                                            onChange={handleRadioChange}
                                        />
                                        לא
                                    </label>
                                </div>
                            </li>



                        </ul>
                        <button type="submit" className="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChildForm;
