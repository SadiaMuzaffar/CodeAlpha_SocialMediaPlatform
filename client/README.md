# CodeAlpha_SocialMediaPlatform

A full-stack social media platform with a Node.js/Express/SQLite backend and a React (Vite) frontend.

## Features
- User registration and login (JWT authentication, hashed passwords)
- Create posts
- View feed (all posts with author info, like/comment counts)
- Comment on posts
- Like/unlike posts
- Follow/unfollow users
- View user profiles with follower/following counts

## Tech stack
- **Backend:** Node.js, Express, SQLite (better-sqlite3), bcryptjs, jsonwebtoken
- **Frontend:** React, Vite, Axios, React Router

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

### Backend
1. Clone the repo
2. Run `npm install` in the root folder
3. Create a `.env` file with `JWT_SECRET` and `PORT=3000`
4. Run `node server.js`

### Frontend
1. Open a new terminal, navigate to the `client` folder: `cd client`
2. Run `npm install`
3. Run `npm run dev`
4. Open the URL shown (usually `http://localhost:5173`)

Both the backend and frontend need to run at the same time, in separate terminals.