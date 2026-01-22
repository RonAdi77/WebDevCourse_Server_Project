# MVC Web Application with SQLite

A full-stack web application built with Node.js, Express, EJS, and SQLite, featuring user authentication and YouTube video favorites management.

## Features

- ✅ User Registration and Login/Logout
- ✅ Session Management with SQLite
- ✅ YouTube Video Search
- ✅ Save Videos to Favorites
- ✅ Delete Favorites
- ✅ Drag & Drop Reordering (optional)
- ✅ Bootstrap 5 Styling
- ✅ Responsive Design

## Tech Stack

- **Backend**: Node.js + Express
- **View Engine**: EJS
- **Database**: SQLite3
- **Authentication**: bcrypt + express-session
- **API**: YouTube Data API v3
- **Styling**: Bootstrap 5

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
SESSION_SECRET=your-secret-key-here
YOUTUBE_API_KEY=your-youtube-api-key
DATABASE_PATH=./database.db
```

To generate a SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run the Application

```bash
npm start
```

The server will start on `http://localhost:3000`

## Project Structure

```
server_project/
├── src/
│   ├── models/          # Database models
│   ├── views/           # EJS templates
│   ├── controllers/     # Business logic
│   ├── routes/          # Route definitions
│   ├── middleware/      # Auth middleware
│   ├── database/        # Database setup
│   └── utils/           # YouTube API
├── public/              # Static files
├── server.js            # Entry point
└── render.yaml          # Render deployment config
```

## Deployment to Render

### Prerequisites
1. GitHub account
2. Render account (sign up at https://render.com)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Settings**
   - **Name**: `mvc-web-app` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Choose Free or Paid

4. **Set Environment Variables**
   In Render Dashboard → Environment:
   - `PORT`: Leave empty (Render sets it automatically)
   - `SESSION_SECRET`: Generate a random secret
   - `YOUTUBE_API_KEY`: Your YouTube API key
   - `DATABASE_PATH`: `./database.db`
   - `NODE_ENV`: `production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-app-name.onrender.com`

### Important Notes

- **Free Plan**: The service may sleep after 15 minutes of inactivity
- **SQLite**: On Render, the database file is ephemeral. For production, consider using a persistent database service
- **First Deploy**: May take 5-10 minutes

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `GET /auth/register` - Register page
- `POST /auth/login` - Login handler
- `POST /auth/register` - Register handler
- `POST /auth/logout` - Logout handler

### Protected Routes (require authentication)
- `GET /` - Home page
- `GET /favorites` - Favorites page
- `POST /favorites/search` - Search YouTube videos
- `POST /favorites/add` - Add video to favorites
- `DELETE /favorites/:id` - Delete favorite
- `POST /favorites/reorder` - Reorder favorites

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `created_at` (DATETIME)

### Sessions Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `session_token` (TEXT UNIQUE)
- `expires_at` (DATETIME)
- `created_at` (DATETIME)

### Favorites Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `video_id` (TEXT)
- `title` (TEXT)
- `thumbnail_url` (TEXT)
- `position` (INTEGER)
- `created_at` (DATETIME)

## Deployment

https://webdevcourse-server-project.onrender.com
