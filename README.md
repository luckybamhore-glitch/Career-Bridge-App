# CareerBridge

> AI-powered career guidance and mentorship platform. Students explore careers, generate personalised roadmaps with Google Gemini, and chat in real time with verified counselors, all managed through a credit-based system and an admin panel.

![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

### Students
- Browse careers by category with qualification, duration and salary details
- Generate an AI career roadmap (powered by Google Gemini) and revisit saved roadmaps
- Find verified counselors, read ratings and reviews, and rate them
- Real-time 1-on-1 chat with online presence, typing indicator and read receipts
- Personal dashboard with credits, roadmaps and activity
- Request more credits and track request history
- Apply to become a counselor

### Counselors
- Dedicated dashboard, inbox and reviews page
- Availability toggle and category-based profile
- Visible to students only after admin approval

### Admins
- Platform overview dashboard
- User management (activate / deactivate / update)
- Category and career management
- Counselor approval workflow (`pending`, `accepted`, `rejected`)
- Approve or reject credit requests
- Built-in AI assistant for admins

### Platform
- JWT authentication with role-based access (`STUDENT`, `COUNSELOR`, `ADMIN`)
- Credit economy: new users start with 5 credits and a roadmap costs 1 credit. The credit is refunded automatically if generation fails.
- Gemini model fallback chain for resilience when a model is unavailable
- Chat messages auto-expire after 24 hours via a MongoDB TTL index
- Profile image uploads through Cloudinary
- Neo-brutalist, mobile-responsive UI (see [`frontend/UI_THEME_ANALYSIS.md`](frontend/UI_THEME_ANALYSIS.md))

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router v7, Redux Toolkit, TanStack React Query, Tailwind CSS, Axios, Socket.io Client, Lucide Icons, React Markdown |
| Backend | Node.js (ES Modules), Express 5, Mongoose 9, Socket.io, JWT, bcrypt, Multer |
| Database | MongoDB (Atlas or local) |
| AI | Google Gemini (`@google/genai`) |
| Media | Cloudinary |
| Hosting | Netlify (frontend). The backend runs on any Node host. |

## Architecture

```
┌──────────────────────┐    REST (JSON + JWT)    ┌───────────────────────────┐
│  React SPA (Vite)    │ ──────────────────────▶ │  Express API              │
│  Redux + React Query │                         │  routes → controllers     │
│                      │ ◀────── Socket.io ────▶ │  middleware (auth, upload)│
└──────────────────────┘                         └─────────────┬─────────────┘
                                                               │
                         ┌─────────────────┬───────────────────┼──────────────┐
                         ▼                 ▼                   ▼              ▼
                     MongoDB          Google Gemini        Cloudinary     Socket rooms
                  (users, chats,     (roadmaps, admin     (profile        (presence,
                   credits, ...)        assistant)          images)         messages)
```

- **REST API** handles auth, careers, counselors, credits, ratings, roadmaps and admin operations.
- **Socket.io** handles chat, presence, read receipts and live credit updates. Each user joins a personal room (`user_<id>`) and each conversation uses a deterministic room (`room_<idA>_<idB>`).
- **Auth** uses a Bearer JWT. Middleware exposes `protect.forUser` and `protect.forAdmin`.

## Project Structure

```
career-bridge-app/
├── backend/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Request handlers (auth, admin, counselor, credits, ...)
│   ├── middleware/        # Auth, Cloudinary, file upload, error handler
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── server/server.js   # App entry point (HTTP + Socket.io)
│   ├── socket/            # Socket auth and chat handlers
│   └── .env.example
└── frontend/
    ├── public/            # _redirects for SPA routing
    ├── src/
    │   ├── components/    # Reusable UI (Button, Card, Navbar, ChatBubble, ...)
    │   ├── features/      # Redux slices (auth, admin, counselor) and store
    │   ├── hooks/         # useAuthStatus, useCreditSync, useOnlineUsers
    │   ├── lib/           # Socket client
    │   ├── pages/         # Route-level pages (student, counselor, admin)
    │   └── services/      # API service layer (Axios)
    ├── netlify.toml
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- A [Cloudinary](https://cloudinary.com/) account (for profile images)

### 1. Clone the repository

```bash
git clone https://github.com/luckybamhore-glitch/Career-Bridge-App.git
cd Career-Bridge-App
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run dev              # starts on http://localhost:5050
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # starts on http://localhost:5173
```

Open <http://localhost:5173>, register an account and start exploring.

> **Creating an admin:** new accounts default to the `STUDENT` role. To get admin access, change a user's `userType` to `ADMIN` directly in MongoDB.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port (example uses `5050`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLOUDINARY_URL` | Cloudinary connection URL |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_URL` | Frontend origin allowed by CORS (e.g. `http://localhost:5173`) |
| `SOCKET_DEBUG` | Optional. Set to `off` to silence online/offline logs |

### Frontend (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5050`) |
| `VITE_SOCKET_URL` | Socket.io server URL (defaults to `VITE_API_URL`) |

> Never commit `.env` files. Use a strong, unique `JWT_SECRET` in production.

## API Reference

Base URL: `http://localhost:5050`. Routes marked 🔒 require `Authorization: Bearer <token>`, and 🛡️ requires an admin token.

### Auth: `/api/auth`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/register` | Public | Register (multipart, field `profile_image`) |
| POST | `/login` | Public | Login and receive a JWT |
| POST | `/private` | 🔒 | Verify the current session |

### Counselors and ratings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/counselor` | 🔒 | Apply to become a counselor |
| GET | `/api/counselor` | Public | List active counselors |
| GET | `/api/counselor/categories` | Public | List categories |
| POST | `/api/rating/:cind` | 🔒 | Rate a counselor |
| GET | `/api/rating/:cnid` | 🔒 | Get a counselor's ratings |

### Credits: `/api/credits`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | 🔒 | Request credits |
| GET | `/` | 🔒 | Credit request history |
| GET | `/:rid` | 🔒 | Single request details |

### AI roadmap: `/api/ai`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/roadmap` | 🔒 | Generate a roadmap (costs 1 credit) |
| GET | `/roadmap` | 🔒 | Get my saved roadmaps |

### Messages: `/api/messages`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | 🔒 | Inbox |
| GET | `/:uid` | 🔒 | Conversation with a user |
| GET | `/user-info/:uid` | 🔒 | Chat partner info |
| POST | `/mark-seen/:uid` | 🔒 | Mark messages as seen |
| DELETE | `/message/:mid` | 🔒 | Delete a message |
| DELETE | `/conversation/:uid` | 🔒 | Clear conversation (for me only) |

### Dashboard

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/user/dashboard` | 🔒 | Aggregated student dashboard |

### Admin: `/api/admin`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/users` | 🛡️ | List users |
| PUT | `/:uid` | 🛡️ | Update a user |
| GET / POST | `/category` | 🛡️ | List / create categories |
| PUT / DELETE | `/category/:cid` | 🛡️ | Update / delete a category |
| GET | `/career` | 🛡️ | List careers |
| POST | `/career/:cid` | 🛡️ | Create a career in a category |
| GET | `/career/category/:cid` | 🛡️ | Careers by category |
| GET | `/counselors` | 🛡️ | List counselor applications |
| PUT | `/counselors/:cnid` | 🛡️ | Approve or reject a counselor |
| GET | `/credits` | 🛡️ | List credit requests |
| PUT | `/credits/:rid` | 🛡️ | Grant or reject credits |
| POST | `/ai` | 🛡️ | Admin AI assistant |

### Socket.io events

| Event | Direction | Purpose |
| --- | --- | --- |
| `join_room` | client → server | Join a conversation room |
| `send_message` | client → server | Send a message |
| `receiver_message` | server → client | New message in an open room |
| `new_message` | server → client | Notification to the receiver's personal room |
| `mark_seen` / `messages_seen` | both | Read receipts |
| `online_list` / `user_online` | server → client | Presence |
| `credits_updated` | server → client | Live credit balance |

## Data Models

| Model | Key fields |
| --- | --- |
| **User** | name, email (unique), phone (unique), password (hashed), userType, qualification, location, credits (default 5), profilePic |
| **Category** | title |
| **Career** | category (ref), title, description, requiredQualification, duration, salary |
| **Counselor** | user (ref), category (ref), experience, status, isActive, isAvailable |
| **Rating** | user (ref), counselor (ref), rating (1 to 5), review |
| **Credit** | user (ref), credits, status (`pending`, `granted`, `rejected`) |
| **Roadmap** | user (ref), text |
| **Message** | sender, receiver, content, isRead, seenAt, deletedFor, 24h TTL index |

## Deployment

### Frontend (Netlify)

`frontend/netlify.toml` and `frontend/public/_redirects` are already configured for SPA routing.

1. Import the repo into Netlify and set the **base directory** to `frontend`.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing at your deployed backend.

### Backend (Render, Railway, Fly.io, VPS, etc.)

1. Set the root directory to `backend`.
2. Build command: `npm install`. Start command: `npm run server`.
3. Add all backend environment variables, setting `CLIENT_URL` to your deployed frontend URL.
4. Use a host that supports long-lived WebSocket connections, since chat depends on Socket.io.

## Roadmap

Ideas for future improvements:

- Request validation with Zod or Joi on all endpoints
- Rate limiting and security headers (`express-rate-limit`, `helmet`)
- Refresh tokens and httpOnly cookie auth
- Pagination and database indexes for large lists
- Redis for Socket.io scaling and caching
- Automated tests (Vitest and React Testing Library on the frontend, Jest and Supertest on the backend)
- Docker and docker-compose setup with CI/CD via GitHub Actions
- Booking and video sessions with counselors
- Migration to TypeScript

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

Released under the ISC License.

## Author

Built by [@luckybamhore-glitch](https://github.com/luckybamhore-glitch).
