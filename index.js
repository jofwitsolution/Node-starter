import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT secret not defined");
}

// Middlewares
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => console.log(`Server running on port ${port}...`));
