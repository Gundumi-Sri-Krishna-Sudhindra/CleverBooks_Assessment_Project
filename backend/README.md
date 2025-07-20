# Social Media App Backend

A NestJS backend for a social media application with JWT authentication, MongoDB, Redis queues, and WebSocket notifications.

## Features

- 🔐 JWT-based authentication (signup/signin)
- 📝 Post creation with BullMQ queues (5-second delay)
- 👥 Follow/unfollow users with real-time notifications
- 📊 Timeline with posts from followed users
- 🚦 Rate limiting for all endpoints
- 🔄 WebSocket real-time notifications
- 🗄️ MongoDB with Mongoose ODM
- 🚀 Redis + BullMQ for job queues

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose
- **Queue**: Redis + BullMQ
- **Authentication**: JWT with Passport
- **Real-time**: WebSocket with Socket.io
- **Rate Limiting**: @nestjs/throttler

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Redis (running locally or cloud instance)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/social_media_app
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the development server**:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user (rate limit: 5/min)
- `POST /api/auth/signin` - Login user (rate limit: 5/min)

### Posts
- `POST /api/posts` - Create a new post (rate limit: 3/min, requires auth)
- `GET /api/posts/timeline` - Get timeline posts (requires auth)

### Users
- `POST /api/users/follow/:userId` - Follow a user (requires auth)
- `POST /api/users/unfollow/:userId` - Unfollow a user (requires auth)

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # JWT auth guard
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── schemas/         # Mongoose schemas
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── posts/               # Posts module
│   ├── schemas/
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
├── notifications/       # WebSocket notifications
│   ├── notifications.gateway.ts
│   └── notifications.module.ts
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Development

- **Build**: `npm run build`
- **Start production**: `npm run start:prod`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/social_media_app` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Post creation**: 3 requests per minute
- **Global limit**: 100 requests per minute

## WebSocket Events

- `user_followed` - When a user follows another user
- `post_created` - When a post is created (after 5-second delay)

## Database Schema

### User
- `email` (unique, required)
- `password` (hashed, required)
- `name` (required)
- `avatar` (optional)
- `bio` (optional)
- `followers` (array of user IDs)
- `following` (array of user IDs)

### Post
- `title` (required)
- `description` (required)
- `author` (user ID, required)
- `likes` (number, default: 0)
- `likedBy` (array of user IDs) 