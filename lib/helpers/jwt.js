import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export function genJWT(payload) {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
  });

  return token;
}
