import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import multer from "multer";
import bcrypt from "bcrypt";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("img"), async (req, res) => {
  

  try {
    const { username, email, password, role, goalType, teamSize, intent } = req.body;
    const img = req.file?.filename;

    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const errorMsg =
        existingUser.username === username
          ? "Username already taken"
          : "Email already registered";
      return res.status(409).json({ message: errorMsg });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      img,
      role,
      goalType,
      teamSize,
      intent,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user" });
  }
});


router.post("/login", login);
router.post("/logout", logout);

export default router;
