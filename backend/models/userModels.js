import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Fill Name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Fill Email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please Fill Phone"],
    },
    password: {
      type: String,
      required: [true, "Please Fill Password"],
    },
    userType: {
      type: String,
      required: true,
      enum: ["STUDENT", "COUNSELOR", "ADMIN"],
      default: "STUDENT",
    },
    qualification: {
      type: String,
      required: [true, "Please Fill Qualification"],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    location: {
      type: String,
      required: [true, "Please Fill Location"],
    },
    credits: {
      type: Number,
      default: 5,
      required: true,
    },


  profilePic :{
    type:String ,
    required : true
  }

  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
