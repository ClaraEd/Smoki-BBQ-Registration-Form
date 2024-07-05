// Backend (Node.js with Express.js)
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection pool
const pool = mysql.createPool({
  host: "Localhost",
  user: "root",
  password: "C09202001@vJr",
  database: "restaurant_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Route to fetch lunch menu items
app.get("/api/menu/lunch", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM Menu WHERE category = "Lunch"'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching lunch menu items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch dinner menu items
app.get("/api/menu/dinner", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM Menu WHERE category = "Dinner"'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching dinner menu items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
