# CleverBooks Assessment Project

A full-stack social media app built with **NestJS** (backend) and **Next.js** (frontend).
Features include JWT authentication, real-time notifications, async queues, rate-limited APIs, and a modern UI.

---

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, shadcn/ui, Tailwind CSS
- **Backend:** NestJS, TypeScript, MongoDB (Mongoose), Redis + BullMQ, Socket.IO
- **Auth:** JWT (no Firebase)
- **Real-time:** WebSocket notifications
- **Queue:** BullMQ (Redis)
- **Rate Limiting:** NestJS Throttler

---

## 📁 Project Structure

```
Assessment Project/
  ├── backend/   # NestJS API (MongoDB, Redis, JWT, WebSocket)
  └── frontend/  # Next.js app (shadcn/ui, App Router)
```

---

## ✨ Features

- **Authentication:** Signup/Login with JWT, rate-limited, protected routes
- **Post Creation:** Queued with BullMQ (5s delay), real-time notification to followers
- **Follow/Unfollow:** Instant, with real-time notification to the followed user
- **Timeline:** See posts from users you follow
- **Connect:** Search and follow/unfollow users
- **Rate Limiting:** On signup, login, post creation, and more
- **WebSocket:** Real-time notifications for follows and new posts
- **Modern UI:** Responsive, clean, and component-based

---

## 🛠️ Setup Instructions

### 1. **Clone the Repo**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. **Backend Setup**
```bash
cd backend
cp env.example .env
# Edit .env with your MongoDB Atlas URI, Redis, and JWT secret
npm install
npm run start:dev
```
- Requires: Node.js 18+, MongoDB (Atlas or local), Redis

### 3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```
- Visit: [http://localhost:3000](http://localhost:3000)

---

## ⚡ Usage

- **Sign up** and **log in**
- **Create posts** (will appear after 5 seconds)
- **Connect** with other users (search, follow/unfollow)
- **Timeline** shows posts from users you follow
- **Real-time notifications** for follows and new posts

---

## 📝 Environment Variables

**Backend (`backend/.env`):**
```
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

**Frontend:**  
No special env vars needed for local dev.

---

## 🧪 Testing

- All core flows are protected and rate-limited.
- WebSocket notifications appear as banners.
- Try in two browser tabs for real-time demo.

---

## 📦 Deployment

- Deploy backend (NestJS) to any Node.js server (e.g., Heroku, Render, AWS, etc.)
- Deploy frontend (Next.js) to Vercel, Netlify, or any Node.js host.
- Use cloud MongoDB (Atlas) and Redis (Upstash, Redis Cloud, etc.) for production.

---

## 🙏 Credits

- Built for CleverBooks Assessment by **Gundumi Sri Krishna Sudhindra**
- Tech: NestJS, Next.js, MongoDB, Redis, BullMQ, Socket.IO, shadcn/ui
