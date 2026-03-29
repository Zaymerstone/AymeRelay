import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // When someone goes to /signup, call the signup function from the controller
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile); // if only user is authenticated only then he can call updateProfile funct

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router; // When someone imports this file, give them the router object
