import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req, res) => {
  const { email, password } = req.body; // user provides email and password on frontend, we receive it here
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email }); // find if provided email exists in DB - error handling

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" }); // if provided email do NOT exist in DB, we insta out from the funtion and send error msg
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare password provided by user with the hashed password stored in DB

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" }); // insta out if provided password is not the same
    }

    generateToken(user._id, res); // give token to user and link it with user._id so that we associate each user via id

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 }); // clear cookies on logout. make sure name is the same as in utils.js when we set the cookie, which is "jwt".
  res.status(200).json({ message: "Logged out succesfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
      const userId = req.user._id; // we can use it because from auth.middleware js we did req.user = user

      const uploadResponse = await cloudinary.uploader.upload(profilePic);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true },
      );

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
