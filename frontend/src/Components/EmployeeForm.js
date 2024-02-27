import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link component for navigation
import './EmployeeForm.css'; 

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    dob: '',
    gender: '',
    designation: '',
    salary: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/employees', formData);
      alert('Employee added successfully!');
    } catch (error) {
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className='bg'>
      <h2 className='head'>Employee Form</h2>
      <div className="form-container">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Employee Name"
              maxLength={30}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Employee ID"
              required
            />
          </div>
          <div className="form-group">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Logistics">Logistics</option>
              <option value="Designing">Designing</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  required
                />{' '}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  required
                />{' '}
                Female
              </label>
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              maxLength={8}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
          <Link to="/employee-list" className="view-button">See Employee List</Link>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
