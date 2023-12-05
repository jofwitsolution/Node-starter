import dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

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

app.use(errorHandler);
app.use(notFound);

// Helmet for security purposes. Compression for efficiency
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => console.log(`Server running on port ${port}...`));
