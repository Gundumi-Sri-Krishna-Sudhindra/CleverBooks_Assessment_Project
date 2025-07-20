# Social Media App Frontend

A Next.js frontend for the social media application with real-time features and modern UI.

## Features

- 🔐 JWT Authentication (Login/Signup)
- 📝 Post Creation with Queue Integration
- 📊 Real-time Timeline
- 👥 User Management
- 🎨 Modern UI with shadcn/ui
- 📱 Responsive Design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **API**: REST with JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend server running on port 5001
- MongoDB Atlas connection
- Redis server running

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
```bash
npm run dev
   ```

3. **Open your browser**:
   - Navigate to http://localhost:3000

## Project Structure

```
app/
├── login/           # Login page
├── signup/          # Signup page
├── home/            # Home dashboard
├── create-post/     # Post creation
├── timeline/        # Timeline view
└── layout.tsx       # Root layout

components/
├── ui/              # shadcn/ui components
└── ...

contexts/
└── AuthContext.tsx  # Authentication context

lib/
└── api.ts          # API service
```

## API Integration

The frontend connects to the NestJS backend at `http://localhost:5001/api`:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Posts
- `POST /api/posts` - Create post (queued)
- `GET /api/posts/timeline` - Get timeline

### Users
- `POST /api/users/follow/:userId` - Follow user
- `POST /api/users/unfollow/:userId` - Unfollow user

## Testing the Application

1. **Create Account**:
   - Go to http://localhost:3000/signup
   - Fill in your details
   - Click "Sign Up"

2. **Login**:
   - Go to http://localhost:3000/login
   - Use your credentials
   - Click "Login"

3. **Create Post**:
   - Navigate to "Create Post"
   - Fill in title and description
   - Submit (will be queued for 5 seconds)

4. **View Timeline**:
   - Go to "Timeline"
   - Refresh after 5+ seconds to see posts

## Troubleshooting

### Rate Limiting Errors
If you see "Too Many Requests" errors:
- The backend rate limit has been increased to 1000 requests/minute
- Wait a moment and try again

### Authentication Issues
- Clear browser localStorage
- Check if backend is running on port 5001
- Verify JWT token in browser dev tools

### Router Errors
- Ensure all pages have proper imports
- Check for missing `useEffect` or `useState` imports

## Development

- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Environment Variables

The frontend connects to the backend via the API service. No additional environment variables are needed for development.

## Next Steps

1. Add WebSocket notifications
2. Implement follow/unfollow UI
3. Add real-time updates
4. Enhance UI/UX with more components
