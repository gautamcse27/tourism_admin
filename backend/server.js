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
  port: 5432,
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

// ✅ Add New Attraction with Latitude & Longitude
app.post("/attractions", upload.array("images", 10), async (req, res) => {
  try {
    console.log("Received data:", req.body);
    console.log("Received files:", req.files);

    const { name, location, description, latitude, longitude, imageUrls } = req.body;
    
    let imagesArray = [];

    if (imageUrls) {
      imagesArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
    } else if (req.files && req.files.length > 0) {
      imagesArray = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      return res.status(400).json({ message: "No images provided" });
    }

    const newAttraction = await pool.query(
      "INSERT INTO attractions (name, location, latitude, longitude, description, image_urls) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, location, latitude, longitude, description, imagesArray]
    );

    res.status(201).json(newAttraction.rows[0]);
  } catch (error) {
    console.error("Error inserting attraction:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Update Attraction with Latitude & Longitude
app.put("/attractions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, latitude, longitude, description, image_urls } = req.body;

    // ✅ Fetch existing images
    const existingImagesResult = await pool.query(
      "SELECT image_urls FROM attractions WHERE id = $1",
      [id]
    );

    let existingImages = existingImagesResult.rows[0]?.image_urls || [];

    // ✅ Preserve old images if no new ones are provided
    const finalImages = Array.isArray(image_urls) && image_urls.length > 0 ? image_urls : existingImages;

    await pool.query(
      "UPDATE attractions SET name = $1, location = $2, latitude = $3, longitude = $4, description = $5, image_urls = $6 WHERE id = $7",
      [name, location, latitude, longitude, description, finalImages, id]
    );

    res.json({ message: "Attraction updated successfully" });
  } catch (error) {
    console.error("Error updating attraction:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Fetch All Attractions with Latitude & Longitude
app.get("/attractions", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, location, latitude, longitude, description, image_urls FROM attractions");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attractions" });
  }
});

// ✅ Fetch Single Attraction
app.get("/attractions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM attractions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Attraction not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch Gallery Images
app.get("/attractions/:id/gallery", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT name, image_urls FROM attractions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json({ name: result.rows[0].name, images: result.rows[0].image_urls });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Attraction
app.delete("/attractions/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM attractions WHERE id = $1", [req.params.id]);
    res.json({ message: "Attraction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attraction" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
