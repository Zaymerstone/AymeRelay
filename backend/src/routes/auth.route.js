import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// router.get("/test", arcjetProtection, (req, res) => {
//   res.status(200).json({ message: "Test route" });
// }); works good
router.post("/signup", arcjetProtection, signup); // When someone goes to /signup, call the signup function from the controller
router.post("/login", arcjetProtection, login);
router.post("/logout", arcjetProtection, logout); // add protectRoute middleware, because we want to logout only auth user
router.put("/update-profile", protectRoute, arcjetProtection, updateProfile); // if only user is authenticated only then he can call updateProfile funct

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router; // When someone imports this file, give them the router object
