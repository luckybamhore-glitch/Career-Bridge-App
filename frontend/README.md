# CareerBridge Client (`next-client-frontend`)

Modern React Single Page Application for CareerBridge India Platform built with Vite, Tailwind CSS, Redux Toolkit, and React Query.

## 🚀 Features
- **Role-Based Portals:** Dedicated experiences for Students, Counselors, and Platform Admins.
- **AI Career Roadmap Generator:** Interactive 4-phase career trajectory builder.
- **Live 1-on-1 Chat:** Realtime messaging and online status tracking.
- **Counselor Directory & Booking:** Verified mentors with ratings and reviews.
- **Neo-Brutalist Design:** Bold typography, crisp shadows, and full mobile responsiveness.

## 📦 Tech Stack
- **Framework:** React 18 & Vite
- **Routing:** React Router v7
- **State Management:** Redux Toolkit & TanStack React Query
- **Styling:** Tailwind CSS & Lucide Icons
- **Realtime:** Socket.io Client
- **Deployment:** Netlify Ready (`_redirects` & `netlify.toml` included)

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd next-client-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your backend URL:
   ```env
   VITE_API_URL=http://localhost:5050
   VITE_SOCKET_URL=http://localhost:5050
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
