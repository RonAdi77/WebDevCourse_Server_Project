const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "..", "db.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      video_id TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      UNIQUE(user_id, video_id)
    )
  `);
});

module.exports = db;
