import express from "express"
import dotenv from "dotenv"
dotenv.config()
import colors from "colors"
import connectDB from "../config/dbConfig.js"
import authRoutes from "../routes/authRoutes.js"
import errorHandler from "../middleware/errorhandler.js"
import adminRoutes from "../routes/adminRoutes.js"
import counselorRoutes from "../routes/counselorRoutes.js"
import ratingRoutes from "../routes/ratingRoutes.js"
import creditsRoutes from "../routes/creditsRoutes.js"
import roadmapRoutes from "../routes/roadmapRoutes.js"
import messageRoutes from "../routes/messageRoutes.js"
import dashboardRoutes from "../routes/dashboardRoutes.js"
import cors from "cors"
import mongoose from "mongoose"
import http from "http"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { Server } from "socket.io"
import { chatHandler, onlineUsers } from "../socket/chatHandel.js"
import socketAuthMiddleware from "../socket/socketAuth.js"
const PORT = process.env.PORT || 3000

// ESM equivalent of __dirname (server.js lives in backend/server/)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Single-service deploy: Express also serves the built Vite frontend.
// Repo layout: <root>/frontend/dist  <->  <root>/backend/server/server.js
const clientDist = path.join(__dirname, "..", "..", "frontend", "dist")
const clientIndex = path.join(clientDist, "index.html")
const serveClient = fs.existsSync(clientIndex)

const app = express()
const server = http.createServer(app)
connectDB()

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5050"
].filter(Boolean);

// Allow any localhost / 127.0.0.1 port in dev (vite may run on 5174, 5175, ...)
// plus CLIENT_URL in production. No `origin` header (curl/mobile) is allowed.
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true
  }
})

io.use(socketAuthMiddleware)

// controllers (message delete realtime notify) ke liye io available rakho
app.set("io", io)

io.on("connection", (socket) => {
    // Log only once per user (first tab/socket). Extra tabs/sockets join silently
    // so one user = one log line instead of spam on every reconnect/navigation.
    const userId = String(socket.userID || "");
    const isFirstSocket = !onlineUsers.has(userId);
    if (isFirstSocket && process.env.SOCKET_DEBUG !== "off") {
        console.log(`User online: ${userId} (${onlineUsers.size + 1} online)`);
    }
    chatHandler(io, socket)
    socket.on("disconnect", () => {
        // chatHandler removes the socket; log only when user's last socket closes
        if (!onlineUsers.has(userId) && process.env.SOCKET_DEBUG !== "off") {
            console.log(`User offline: ${userId} (${onlineUsers.size} online)`);
        }
    });
})

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// API root probe ("/" itself serves the frontend when built)
app.get("/api" , (req , res) => {
    res.status(200).json({
        message : "WELCOME TO NEXT-STEP API's "
    })
})

// Health check for Render (no auth). Reports 503 while MongoDB is
// disconnected so Render restarts/replaces a DB-less instance instead
// of serving traffic that would all fail. dbConfig only logs on
// failure, so this is the safety net.
app.get("/api/health" , (req , res) => {
    const dbConnected = mongoose.connection.readyState === 1
    res.status(dbConnected ? 200 : 503).json({
        status : dbConnected ? "ok" : "degraded",
        db : dbConnected ? "connected" : "disconnected",
        uptime : process.uptime(),
        timestamp : new Date().toISOString()
    })
})
// Auth Routes
app.use("/api/auth" , authRoutes)

// admin Routes
app.use("/api/admin/" , adminRoutes)
//  Counselor Routes

app.use("/api" , counselorRoutes)

//  rating router 

app.use("/api/rating" , ratingRoutes)

//  credits router 
app.use("/api/credits" , creditsRoutes)
//  road map routes
app.use("/api/ai" , roadmapRoutes)

//  messages routes
app.use("/api/messages" , messageRoutes)

//  user dashboard (StudentDashboard at /auth/profile)
app.use("/api/user" , dashboardRoutes)
// alias so /api/dashboard also works
app.use("/api" , dashboardRoutes)

// ---- Single-service frontend hosting ----
// Serves frontend/dist (built by `npm run build` in frontend/).
// Skipped automatically in local backend-only dev (no dist present).
if (serveClient) {
    app.use(express.static(clientDist))
    // SPA fallback for React Router: any non-API GET serves index.html.
    // (Socket.io intercepts /socket.io before Express, so it is unaffected.)
    app.use((req , res , next) => {
        if (req.method === "GET" && !req.path.startsWith("/api")) {
            return res.sendFile(clientIndex)
        }
        next()
    })
}

// error handler
app.use(errorHandler)
server.listen(PORT , () => console.log(`SERVER RUNNING AT PORT ,${PORT}`.bgBlue) )





