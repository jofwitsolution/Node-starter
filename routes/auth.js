import express from "express";
import {
  activate,
  forgotPassword,
  forgotPasswordCode,
  resetPassword,
  signin,
  signup,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/activate/:activationToken", activate);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/verify-code", forgotPasswordCode);
router.post("/reset-password", resetPassword);

export default router;
