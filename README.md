# Server Project – MVC Web App (ServerAPP)

האפליקציה רצה מתוך תיקיית **ServerAPP**.

## דרישות שמומשו

### 1) הרצה און-ליין (Render) + Login / Register / Logout + SQLite
- **משתמשים** ו-**Sessions** נשמרים ב-SQLite (טבלאות Users + connect-sqlite3).
- אחרי **Register** או **התחברות** – מעבר למסך ראשי כמחובר, עם פרטי המשתמש וכפתור התנתקות.
- אם המשתמש **לא מחובר** – מוצג מסך **Login** עם לינק ל-**Register**.

### 2) דף מועדפים (MVC + DB)
- דף חדש: **חיפוש סרטונים ב-YouTube** (חלק עליון) ו**רשימת סרטונים שמורים** (חלק תחתון).
- שמירה למועדפים בלחיצה על הסרטון; מחיקה מהרשימה.
- גישה לדף **רק לאחר התחברות**; טבלת **favorites** ב-DB.
- עיצוב עם **Bootstrap**; אופציונלי: שינוי סדר (drag & drop).

### 3) הצגת נתוני טבלאות
- דף **Table Data** (`/tables`) – הצגת נתונים מטבלאות **Users**, **Favorites**, **Sessions** (לאחר התחברות).

---

## הרצה מקומית

```bash
cd ServerAPP
npm install
```

צור קובץ `.env` בתוך ServerAPP (ראה `ServerAPP/.env.example`):

```env
PORT=3000
SESSION_SECRET=your-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
DATABASE_PATH=./db.sqlite
```

הרצה:

```bash
cd ServerAPP && npm start
```

או מהשורש:

```bash
npm start
```

האפליקציה: `http://localhost:3000`

---

## Deployment ל-Render

1. העלה את הפרויקט ל-GitHub.
2. ב-Render: New → Web Service, חבר את ה-repo.
3. **Root Directory**: `ServerAPP`
4. **Build Command**: `npm install`
5. **Start Command**: `node app.js`
6. **Environment**: הוסף `SESSION_SECRET`, `YOUTUBE_API_KEY`, `DATABASE_PATH` (אופציונלי).

קובץ `ServerAPP/render.yaml` מכיל הגדרות לדוגמה.

---

## מבנה הפרויקט

```
server_project/
├── ServerAPP/          ← האפליקציה (MVC, SQLite, Auth, Favorites, Table Data)
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
- **חשוב**: ב-Render הגדר **Root Directory** = `ServerAPP`, **Start Command** = `node app.js`.
