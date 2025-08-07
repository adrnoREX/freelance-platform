import express from "express";
import {
  createFreelancerProfile,
  getFreelancerProfile,
  updateFreelancerProfile,
} from "../controllers/freelancer.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createFreelancerProfile);
router.get("/:id", getFreelancerProfile);
router.put("/:id", verifyToken, updateFreelancerProfile);

export default router;
