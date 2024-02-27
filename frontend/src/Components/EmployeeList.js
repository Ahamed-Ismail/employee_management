import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeList.css'; // Import CSS file for styling

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    dob: '',
    gender: '',
    designation: '',
    salary: ''
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${employeeId}`);
      setEmployees(employees.filter(employee => employee.id !== employeeId));
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      setError('Failed to delete employee');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployeeId(employee.id);
    setUpdateFormData(employee);
    setIsUpdateFormVisible(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = { ...updateFormData };
      // Format the date of birth (dob) to YYYY-MM-DD format
      updatedEmployee.dob = new Date(updateFormData.dob).toISOString().split('T')[0];
      await axios.put(`http://localhost:5000/employees/${selectedEmployeeId}`, updatedEmployee);
      fetchEmployees();
      setIsUpdateFormVisible(false);
      alert('Employee updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee');
    }
  };
  

  const handleChange = (e) => {
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='Error'>Error: {error}</div>;

  return (
    <div className="employee-list-container">
      <h2 className="list-title">Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.employeeId}</td>
              <td>{employee.department}</td>
              <td>{employee.dob}</td>
              <td>{employee.gender}</td>
              <td>{employee.designation}</td>
              <td>{employee.salary}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isUpdateFormVisible && (
        <div className="update-form">
          <h2>Update Employee</h2>
          <form onSubmit={handleUpdate}>
            <input type="text" name="name" value={updateFormData.name} onChange={handleChange} placeholder="Name" />
            <input type="text" name="employeeId" value={updateFormData.employeeId} onChange={handleChange} placeholder="Employee ID" />
            <input type="text" name="department" value={updateFormData.department} onChange={handleChange} placeholder="Department" />
            <input type="text" name="dob" value={updateFormData.dob} onChange={handleChange} placeholder="DOB" />
            <input type="text" name="gender" value={updateFormData.gender} onChange={handleChange} placeholder="Gender" />
            <input type="text" name="designation" value={updateFormData.designation} onChange={handleChange} placeholder="Designation" />
            <input type="text" name="salary" value={updateFormData.salary} onChange={handleChange} placeholder="Salary" />
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
