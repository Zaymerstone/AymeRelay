import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Schema like in pydantic FastAPI to define field validation
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }, // adds createdAt updatedAt fields to the user
);
// create a user model based of the schema that we have above
const User = mongoose.model("User", userSchema);

// by exporting User, we can now interact with User model in database in another files
export default User;
