import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  // what we get from the request, which fields user provides to us when filling out the form
  // these data we get from frontend and we need to do деструктуризация объекта
  const { fullName, email, password } = req.body; // get the fields from the request body from front

  try {
    if (!fullName || !email || !password) {
      // because everything is required to be filled out
      // if user did not provide any of these fields, return error
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if email valid, I use regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // this was taken from stackoverflow
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check if user already exists with such email, in case he wants to create an account with the same email twice
    const user = await User.findOne({ email }); // since they are the same name email and email, can just shorten it -> email
    if (user) return res.status(404).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10); // salt determines how long the string will be, but also the greater the value, the longer it takes for app to compelete.
    const hashedPassword = await bcrypt.hash(password, salt); // hash the password user provided with salt we selected

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    }); // before calling .save() on newUser, it is stored in memory and we can call it.

    if (newUser) {
      // before CR:
      // generateToken(newUser._id, res);
      // we can refer to newUser._id even before calling this .save()
      // await newUser.save(); // add newUser object to the DB. Now it will be stored in DB

      // after CR:
      // Persist user first, then issue auth cookie
      const savedUser = await newUser.save(); // save the user to the database and get the saved user with _id
      generateToken(savedUser._id, res); // generate token using the saved user's _id and set it in the response cookie

      res.status(201).json({
        // reply to POST request with these fields
        _id: newUser._id, // mongoose automatically created field _id when I do Schema for user
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      }); // sending json response to this POST request, so that client (frontend) can access necessary fields and display smth

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL,
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error); // if this fails, then we just see console.log but programme doesnt stop after this, because we already created an account for user and sent response to frontend, so this email sending is just a bonus, if it fails, it should not affect the main functionality of signing up.
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    (res.status(500), json({ message: "Internal server error" }));
  }
};
