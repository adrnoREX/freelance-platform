import express from "express";
import multer from "multer";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Setup for file storage (uploads folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.filename);
  },
});
const upload = multer({ storage });

// POST: /api/gig/
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createGig
);
router.delete("/:id", verifyToken, deleteGig);
router.get("/:id", getGig);
router.get("/", getGigs);

export default router;
