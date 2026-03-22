import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup); // When someone goes to /signup, call the signup function from the controller
router.post("/login", login);
router.post("/logout", logout);

export default router; // When someone imports this file, give them the router object
