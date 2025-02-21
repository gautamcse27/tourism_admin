const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8002;
const secretKey = "your_secret_key";

// PostgreSQL Connection
const pool = new Pool({
  user: "bh_tourism",
       host: "localhost",
       database: "bhojpur_tourism",
       password: "bh_tour@412",
       port: 5432
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Admin Authentication
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: admin.id }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.adminId = decoded.id;
    next();
  });
};

// CRUD Routes for Attractions
app.post("/attractions", async (req, res) => {
  try {
    console.log("Received data:", req.body);
      const { name,location , description, image_url} = req.body;
      const newAttraction = await pool.query(
          "INSERT INTO attractions (name,location, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
          [name,location, description, image_url]
      );
      res.status(201).json(newAttraction.rows[0]);
  } catch (error) {
      console.error("Error inserting attraction:", error);
      res.status(500).json({ message: "Server error" });
  }
});


app.get("/attractions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attractions");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attractions" });
  }
});

app.delete("/attractions/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM attractions WHERE id = $1", [req.params.id]);
    res.json({ message: "Attraction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attraction" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
