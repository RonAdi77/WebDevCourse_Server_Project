const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM favorites WHERE user_id = ? ORDER BY position ASC, created_at ASC",
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve((rows || []).map((r) => new Favorite(r)));
                }
            );
        });
    }

    async findByUserAndVideo(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM favorites WHERE user_id = ? AND video_id = ?",
                [userId, videoId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? new Favorite(row) : null);
                }
            );
        });
    }

    async create({ userId, videoId, title, thumbnailUrl }) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT MAX(position) as max FROM favorites WHERE user_id = ?",
                [userId],
                (err, row) => {
                    if (err) return reject(err);
                    const position = (row?.max ?? -1) + 1;
                    db.run(
                        "INSERT INTO favorites (user_id, video_id, title, thumbnail_url, position) VALUES (?, ?, ?, ?, ?)",
                        [userId, videoId, title, thumbnailUrl, position],
                        function (err) {
                            if (err) return reject(err);
                            resolve(this.lastID);
                        }
                    );
                }
            );
        });
    }

    async delete(id, userId) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM favorites WHERE id = ? AND user_id = ?", [id, userId], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }

    async updatePosition(id, userId, newPosition) {
        return new Promise(async (resolve, reject) => {
            db.get("SELECT * FROM favorites WHERE id = ? AND user_id = ?", [id, userId], (err, row) => {
                if (err) return reject(err);
                if (!row) return reject(new Error("Favorite not found"));
                const oldPosition = row.position;
                const updateOthers = newPosition > oldPosition
                    ? "UPDATE favorites SET position = position - 1 WHERE user_id = ? AND position > ? AND position <= ?"
                    : "UPDATE favorites SET position = position + 1 WHERE user_id = ? AND position >= ? AND position < ?";
                const params = newPosition > oldPosition
                    ? [userId, oldPosition, newPosition]
                    : [userId, newPosition, oldPosition];
                db.run(updateOthers, params, (err) => {
                    if (err) return reject(err);
                    db.run("UPDATE favorites SET position = ? WHERE id = ? AND user_id = ?", [newPosition, id, userId], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    }
}

module.exports = new FavoriteRepository();
