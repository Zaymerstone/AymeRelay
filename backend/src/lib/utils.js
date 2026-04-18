import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = jwt.sign({ userId }, JWT_SECRET, {
    // сюда кладем ту инфу которую хотим получать из токена при декодинге
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    // send token in cookie for a user
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // prevent CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true, // makes HTTPS when we are in production
  });

  return token;
};
