# CodeAlpha_SocialMediaPlatform

A backend REST API for a simple social media platform, built with Node.js, Express, and SQLite.

## Features
- User registration and login (JWT authentication, hashed passwords)
- Create posts
- View feed (all posts with author info, like/comment counts)
- Comment on posts
- Like/unlike posts
- Follow/unfollow users
- View user profiles with follower/following counts

## Tech stack
- Node.js and Express
- SQLite (better-sqlite3)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)

## API Endpoints
- POST /api/auth/register - Create a new user
- POST /api/auth/login - Login, returns JWT token
- POST /api/posts - Create a post (requires auth)
- GET /api/posts - Get all posts (feed)
- POST /api/posts/:id/comments - Add a comment (requires auth)
- GET /api/posts/:id/comments - Get comments for a post
- POST /api/posts/:id/like - Like a post (requires auth)
- DELETE /api/posts/:id/like - Unlike a post (requires auth)
- GET /api/users/:id - Get user profile
- POST /api/users/:id/follow - Follow a user (requires auth)
- DELETE /api/users/:id/follow - Unfollow a user (requires auth)

## How to run
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with `JWT_SECRET` and `PORT=3000`
4. Run `node server.js`