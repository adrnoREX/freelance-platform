import express from "express"
import { deleteUser, getUser, checkUserExists } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/jwt.js"

const router = express.Router()

router.get("/:id", getUser);
router.delete("/:id", verifyToken, deleteUser)
router.get("/check/exists", checkUserExists);

export default router

