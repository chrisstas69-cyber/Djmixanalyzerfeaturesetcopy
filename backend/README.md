# Backend API Server

This directory contains the backend API server implementation.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB or Supabase account
- Redis (for caching)
- AWS S3 or Cloudinary (for file storage)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/syntax-audio
# OR for Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=syntax-audio-files
# OR for Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SENDGRID_API_KEY=your-sendgrid-key
# OR
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain

# Search
ELASTICSEARCH_URL=http://localhost:9200

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email address

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers list
- `GET /api/users/:id/following` - Get following list

### Tracks
- `GET /api/tracks` - List tracks (with pagination, search, filters)
- `GET /api/tracks/:id` - Get track details
- `POST /api/tracks` - Create new track
- `PATCH /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track
- `POST /api/tracks/upload` - Upload audio file
- `POST /api/tracks/:id/like` - Like track
- `POST /api/tracks/:id/unlike` - Unlike track

### Mixes
- `GET /api/mixes` - List mixes (with pagination, filters)
- `GET /api/mixes/:id` - Get mix details
- `POST /api/mixes` - Create new mix
- `PATCH /api/mixes/:id` - Update mix
- `DELETE /api/mixes/:id` - Delete mix
- `POST /api/mixes/:id/remix` - Create remix
- `POST /api/mixes/:id/like` - Like mix
- `POST /api/mixes/:id/unlike` - Unlike mix

### Comments
- `GET /api/mixes/:id/comments` - Get mix comments
- `GET /api/tracks/:id/comments` - Get track comments
- `POST /api/mixes/:id/comments` - Add comment to mix
- `POST /api/tracks/:id/comments` - Add comment to track
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/read-all` - Mark all as read

### Search
- `GET /api/search?q=query&type=all` - Search across all content

### Files
- `POST /api/files/presigned-url` - Get presigned URL for upload

## Database Schema

See `src/lib/database/schemas.ts` for TypeScript definitions.

## Security

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Refresh token rotation
- Rate limiting on auth endpoints (5 requests per 15 minutes)
- CORS configured for production domain
- Input validation with Joi/Zod

## Deployment

See deployment documentation in `/docs/deployment.md`

