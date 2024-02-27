// server.js
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const moment = require("moment");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "employeeinstance.cu4aa78nopao.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "5252864Mi",
  database: "employee_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  console.log("MySQL connected");
});

db.on("error", (err) => {
  console.error("MySQL connection error:", err);
});

const adminCredentials = {
  username: "admin",
  password: "Saran@533",
  email: "vinay05saran03@gmail.com",
};

// Track login attempts
let loginAttempts = {};

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Get IP address
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("IP:", ip);

  // Check if credentials match
  if (
    username == adminCredentials.username &&
    password == adminCredentials.password
  ) {
    // Successful login, grant access
    res.status(200).send("Login successful");

    // Reset login attempts
    loginAttempts[ip] = 0;
  } else {
    // Invalid credentials, increment login attempt count
    loginAttempts[ip] = loginAttempts[ip] ? loginAttempts[ip] + 1 : 1;

    // Send security alert if login attempts exceed threshold
    if (loginAttempts[ip] >= 1) {
      sendSecurityAlert(ip); // Pass user's email address and login attempts to the security alert function
    }

    // Display error message
    res.status(401).send("Invalid credentials");
  }
});

// Function to send security alert email
function sendSecurityAlert(ip) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vinay05saran03@gmail.com", // your email
      pass: "nhhj vwzn tprh jrga", // your password
    },
  });

  const mailOptions = {
    from: "vinay05saran03@gmail.com",
    to: adminCredentials.email, // admin's email
    subject: "Security Alert: Anonymous Login Attempts Detected",
    text: ` login attempt  detected  at  ${new Date()}.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Add a new employee
app.post("/api/employees", (req, res) => {
  const { name, employeeId, department, dob, gender, designation, salary } =
    req.body;

  // Check if all required fields are provided
  if (
    !name ||
    !employeeId ||
    !department ||
    !dob ||
    !gender ||
    !designation ||
    !salary
  ) {
    return res.status(400).json({ message: "Incomplete data" });
  }

  // Calculate age based on the provided date of birth
  const age = moment().diff(dob, "years");

  // Check if age is less than 18
  if (age < 18) {
    return res
      .status(400)
      .json({ message: "Employee must be at least 18 years old" });
  }

  // Check if name length and salary length are within limits
  if (name.length > 30 || salary.length > 8) {
    return res.status(400).json({ message: "Invalid data" });
  }

  // Proceed to add the employee to the database
  const sql =
    "INSERT INTO employees (name, employeeId, department, dob, gender, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, employeeId, department, dob, gender, designation, salary],
    (err, result) => {
      if (err) {
        console.error("Error adding employee:", err);
        return res.status(500).json({ message: "Failed to add employee" });
      }
      res.status(201).json({ message: "Employee added successfully" });
    }
  );
});

// Update an employee by ID
app.put("/employees/:id", (req, res) => {
  const { name, employeeId, department, dob, gender, designation, salary } =
    req.body;
  const id = req.params.id;

  const query = `UPDATE employees SET name = ?, employeeId = ?, department = ?, dob = ?, gender = ?, designation = ?, salary = ? WHERE id = ?`;

  db.query(
    query,
    [name, employeeId, department, dob, gender, designation, salary, id],
    (err, result) => {
      if (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ message: "Error updating employee" });
      } else {
        res.status(200).json({ message: "Employee updated successfully" });
      }
    }
  );
});

// Delete an employee by ID
app.delete("/employees/:id", (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM employees WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({ message: "Error deleting employee" });
    } else {
      res.status(200).json({ message: "Employee deleted successfully" });
    }
  });
});

// Get all employees
app.get("/employees", (req, res) => {
  const query = `SELECT * FROM employees`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err); // Log the error to the console
      return res
        .status(500)
        .json({ message: "Error fetching employees", error: err }); // Return detailed error response
    } else {
      console.log("Employees fetched successfully:", results); // Log the fetched employees
      return res.status(200).json(results); // Return the fetched employees
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
