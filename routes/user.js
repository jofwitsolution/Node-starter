import express from "express";
import {
  adminGetUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, isLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isLogin, getAllUsers);
router.get("/profile", isLogin, getUser);
router.get("/:id/profile", isLogin, isAdmin, adminGetUser);
router.put("/:id", isLogin, updateUser);

export default router;
