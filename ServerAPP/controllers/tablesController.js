const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

function runQuery(database, sql, params = []) {
    return new Promise((resolve, reject) => {
        database.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
}

class TablesController {
    async showTables(req, res) {
        try {
            const users = await runQuery(db, "SELECT id, email, fullName, createdAt FROM Users ORDER BY id");
            const favorites = await runQuery(db, "SELECT id, user_id, video_id, title, position, created_at FROM favorites ORDER BY user_id, position");

            const sessionsPath = path.join(__dirname, "..", "sessions.sqlite");
            let sessions = [];
            if (!fs.existsSync(sessionsPath)) {
                sessions = [{ note: "No sessions file yet. Log in to create sessions." }];
            } else try {
                const sessionsDb = new sqlite3.Database(sessionsPath, sqlite3.OPEN_READONLY, (err) => {
                    if (err) throw err;
                });
                // connect-sqlite3 uses columns: sid, expired, sess (not expires/data)
                const rawSessions = await runQuery(sessionsDb, "SELECT sid, expired, sess FROM sessions ORDER BY expired DESC LIMIT 50");
                sessionsDb.close();
                // Parse session data to show which user each session belongs to
                sessions = rawSessions.map((row) => {
                    let user_id = null;
                    let email = null;
                    let fullName = null;
                    const sessData = row.sess || row.data;
                    if (sessData) {
                        try {
                            const parsed = typeof sessData === "string" ? JSON.parse(sessData) : sessData;
                            if (parsed.user) {
                                user_id = parsed.user.id;
                                email = parsed.user.email;
                                fullName = parsed.user.fullName;
                            }
                        } catch (e) {
                            user_id = "-";
                            email = "-";
                            fullName = "-";
                        }
                    }
                    return {
                        sid: row.sid,
                        sidShort: row.sid ? String(row.sid).slice(0, 20) + "..." : "",
                        expires: row.expired != null ? row.expired : row.expires,
                        user_id,
                        email,
                        fullName,
                    };
                });
            } catch (e) {
                sessions = [{ note: "Sessions table (sessions.sqlite) not readable or empty. " + (e && e.message ? e.message : "") }];
            }

            res.render("tables", {
                user: req.session.user,
                users,
                favorites,
                sessions,
            });
        } catch (err) {
            console.error(err);
            res.status(500).render("tables", {
                user: req.session.user,
                users: [],
                favorites: [],
                sessions: [],
                error: err.message,
            });
        }
    }
}

module.exports = new TablesController();
