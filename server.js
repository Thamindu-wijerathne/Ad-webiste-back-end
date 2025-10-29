import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Signup route
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ user: { id: user._id, fullName, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ user: { id: user._id, fullName: user.fullName, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route example
app.get("/api/dashboard", (req, res) => {
  const authHeader = req.headers["authorization"]; // Get "Authorization" header
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    res.json({ message: `Welcome user ${decoded.id}` }); // Access granted
  } catch {
    res.status(403).json({ message: "Invalid token" }); // Token invalid or expired
  }
});


app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
