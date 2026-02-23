import express from "express";
import dotenv from "dotenv"; // for not hardcoding the port number
import path from "path"; // to serve static files, like the frontend build files

import authRoutes from "./routes/auth.route.js"; // Now authRoutes = the router I created earlier.
import messageRoutes from "./routes/message.route.js"; // import router from message.route.js, so we can use it in this file, calling it messageRoutes

dotenv.config(); // so that we can use the variables in the .env file, like PORT

const app = express();
const __dirname = path.resolve(); // to get the current directory path, so we can use it to serve static files

const PORT = process.env.PORT; // instead of hardcoding the port number

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); // to link all pathes starting with /api/messages to the messageRoutes router logic

// make ready for deployment
// I do this because of sevalla deployment process where a backend server is now serving the fronted server inside
// static files sit in frontend/dist, so I need to tell the backend server to serve those files when in production mode, and also to check for the index.html file in that folder for every incoming request, so that the frontend routing can work properly
// When deployed, also act like a frontend server
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // to serve the static files from the frontend/dist folder build folder

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // for every incoming request check this folder first, this file first
  }); // if we get request https://aymerelay.com/chat, without this it would be cannot GET /chat, but its good because we have reference to index and to front here. React router type of vibe
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
