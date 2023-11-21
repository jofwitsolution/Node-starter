import express from "express";
import { activate, signin, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/activate/:activationToken", activate);

export default router;
