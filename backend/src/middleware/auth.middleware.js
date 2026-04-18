import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

// middleware to check if user is authorized or no (has token, which is valid or no ?)

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // this will be undefined if we dont use cookie-parser package in server.js file
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // get all except password
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    req.user = user; // add user to request so we can access it in the next function (server-to-server side always req usage)
    // we do it because, this middleware needs to provide user to another function - update profile
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
