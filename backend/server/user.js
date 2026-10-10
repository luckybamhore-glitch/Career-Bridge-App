
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config();
import User from "./server/models/userModels.js"
import connectDB from "./server/config/dbConfig.js";


connectDB()

const users = [
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876500001",
    password: "Rahul@123",
    userType: "STUDENT",
    qualification: "B.Tech Computer Science",
    isActive: true,
    location: "Indore",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Priya Verma",
    email: "priya@example.com",
    phone: "9876500002",
    password: "Priya@123",
    userType: "STUDENT",
    qualification: "B.Sc Mathematics",
    isActive: true,
    location: "Bhopal",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Amit Singh",
    email: "amit@example.com",
    phone: "9876500003",
    password: "Amit@123",
    userType: "STUDENT",
    qualification: "M.Tech Information Technology",
    isActive: true,
    location: "Delhi",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Neha Gupta",
    email: "neha@example.com",
    phone: "9876500004",
    password: "Neha@123",
    userType: "STUDENT",
    qualification: "MBA",
    isActive: true,
    location: "Pune",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Rohit Mehta",
    email: "rohit@example.com",
    phone: "9876500005",
    password: "Rohit@123",
    userType: "STUDENT",
    qualification: "MCA",
    isActive: true,
    location: "Jaipur",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "9876500006",
    password: "Sneha@123",
    userType: "STUDENT",
    qualification: "B.Com",
    isActive: true,
    location: "Ahmedabad",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "Vikas Yadav",
    email: "vikas@example.com",
    phone: "9876500007",
    password: "Vikas@123",
    userType: "STUDENT",
    qualification: "M.Sc Computer Science",
    isActive: true,
    location: "Lucknow",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Anjali Joshi",
    email: "anjali@example.com",
    phone: "9876500008",
    password: "Anjali@123",
    userType: "STUDENT",
    qualification: "BBA",
    isActive: true,
    location: "Mumbai",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    name: "Karan Malhotra",
    email: "karan@example.com",
    phone: "9876500009",
    password: "Karan@123",
    userType: "STUDENT",
    qualification: "M.A Psychology",
    isActive: true,
    location: "Chandigarh",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Pooja Nair",
    email: "pooja@example.com",
    phone: "9876500010",
    password: "Pooja@123",
    userType: "STUDENT",
    qualification: "B.Pharm",
    isActive: true,
    location: "Kochi",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    name: "Arjun Kapoor",
    email: "arjun@example.com",
    phone: "9876500011",
    password: "Arjun@123",
    userType: "STUDENT",
    qualification: "M.Tech Mechanical",
    isActive: true,
    location: "Hyderabad",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Meera Iyer",
    email: "meera@example.com",
    phone: "9876500012",
    password: "Meera@123",
    userType: "STUDENT",
    qualification: "M.Sc Physics",
    isActive: true,
    location: "Chennai",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
  },

  // New Users
  {
    name: "Riya Sharma",
    email: "riya@example.com",
    phone: "9876500013",
    password: "Riya@123",
    userType: "STUDENT",
    qualification: "BCA",
    isActive: true,
    location: "Nagpur",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    name: "Deepak Kumar",
    email: "deepak@example.com",
    phone: "9876500014",
    password: "Deepak@123",
    userType: "STUDENT",
    qualification: "B.Tech Civil",
    isActive: true,
    location: "Patna",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    name: "Nisha Roy",
    email: "nisha@example.com",
    phone: "9876500015",
    password: "Nisha@123",
    userType: "STUDENT",
    qualification: "B.Sc Chemistry",
    isActive: true,
    location: "Kolkata",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    name: "Saurabh Jain",
    email: "saurabh@example.com",
    phone: "9876500016",
    password: "Saurabh@123",
    userType: "STUDENT",
    qualification: "B.E Electronics",
    isActive: true,
    location: "Surat",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    name: "Kavya Reddy",
    email: "kavya@example.com",
    phone: "9876500017",
    password: "Kavya@123",
    userType: "STUDENT",
    qualification: "BBA",
    isActive: true,
    location: "Bengaluru",
    credits: 5,
    profilePic: "https://randomuser.me/api/portraits/women/17.jpg",
  },
];

const importData = async () => {
  try {
    // Delete old users
    await User.deleteMany({userType : "COUNSELOR"});

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert users
    await User.insertMany(hashedUsers);

    console.log("✅ Users Seeded Successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


  importData();
