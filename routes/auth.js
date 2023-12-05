import express from "express";
import {
  activate,
  forgotPassword,
  forgotPasswordCode,
  logout,
  resetPassword,
  signin,
  signup,
} from "../controllers/authController.js";
import { isLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/activate/:activationToken", activate);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/verify-code", forgotPasswordCode);
router.post("/reset-password", resetPassword);
router.get("/logout", isLogin, logout);

export default router;
