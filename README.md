# Server Project – MVC Web App (ServerAPP)

The application runs from the **ServerAPP** folder.

## Implemented Requirements

### 1) Run Online (Render) + Login / Register / Logout + SQLite
- **Users** and **Sessions** are stored in SQLite (Users table + connect-sqlite3).
- After **Register** or **Login** – redirect to home as logged in, with user details and logout button.
- If the user is **not logged in** – show **Login** page with link to **Register**.

### 2) Favorites Page (MVC + DB)
- New page: **YouTube video search** (top section) and **saved videos list** (bottom section).
- Save to favorites by clicking the video; delete from the list.
- Access to the page **only after login**; **favorites** table in DB.
- Styled with **Bootstrap**; optional: reorder (drag & drop).

### 3) Table Data Display
- **Table Data** page (`/tables`) – displays data from **Users**, **Favorites**, **Sessions** tables (after login).

---

## Local Run

```bash
cd ServerAPP
npm install
```

Create a `.env` file inside ServerAPP (see `ServerAPP/.env.example`):

```env
PORT=3000
SESSION_SECRET=your-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
DATABASE_PATH=./db.sqlite
```

Run:

```bash
cd ServerAPP && npm start
```

Or from the project root:

```bash
npm start
```

App URL: `http://localhost:3000`

---

## Deployment to Render

1. Push the project to GitHub.
2. On Render: New → Web Service, connect the repo.
3. **Root Directory**: `ServerAPP`
4. **Build Command**: `npm install`
5. **Start Command**: `node app.js`
6. **Environment**: Add `SESSION_SECRET`, `YOUTUBE_API_KEY`, `DATABASE_PATH` (optional).

File `ServerAPP/render.yaml` contains sample configuration.

---

## Project Structure

```
server_project/
├── ServerAPP/          ← The app (MVC, SQLite, Auth, Favorites, Table Data)
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   ├── public/
│   ├── render.yaml
│   └── .env.example
├── package.json        ← "start": "cd ServerAPP && npm start"
└── README.md
```

---

## Deployment (Render)

- **URL**: https://webdevcourse-server-project.onrender.com
- **Important**: In Render set **Root Directory** = `ServerAPP`, **Start Command** = `node app.js`.
