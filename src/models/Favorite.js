const db = require('../database/db');

class Favorite {
  static async create(userId, videoId, title, thumbnailUrl) {
    const maxPosition = await db.get(
      'SELECT MAX(position) as max FROM favorites WHERE user_id = ?',
      [userId]
    );
    const position = (maxPosition?.max ?? -1) + 1;

    const result = await db.run(
      'INSERT INTO favorites (user_id, video_id, title, thumbnail_url, position) VALUES (?, ?, ?, ?, ?)',
      [userId, videoId, title, thumbnailUrl, position]
    );
    return result.lastID;
  }

  static async findByUserId(userId) {
    return await db.query(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY position ASC, created_at ASC',
      [userId]
    );
  }

  static async delete(id, userId) {
    const favorite = await db.get('SELECT * FROM favorites WHERE id = ? AND user_id = ?', [id, userId]);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    
    await db.run('DELETE FROM favorites WHERE id = ? AND user_id = ?', [id, userId]);
    
    await db.run(
      'UPDATE favorites SET position = position - 1 WHERE user_id = ? AND position > ?',
      [userId, favorite.position]
    );
  }

  static async updatePosition(id, userId, newPosition) {
    const favorite = await db.get('SELECT * FROM favorites WHERE id = ? AND user_id = ?', [id, userId]);
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    const oldPosition = favorite.position;
    
    if (newPosition > oldPosition) {
      await db.run(
        'UPDATE favorites SET position = position - 1 WHERE user_id = ? AND position > ? AND position <= ?',
        [userId, oldPosition, newPosition]
      );
    } else {
      await db.run(
        'UPDATE favorites SET position = position + 1 WHERE user_id = ? AND position >= ? AND position < ?',
        [userId, newPosition, oldPosition]
      );
    }
    
    await db.run(
      'UPDATE favorites SET position = ? WHERE id = ? AND user_id = ?',
      [newPosition, id, userId]
    );
  }

  static async findByVideoId(userId, videoId) {
    return await db.get(
      'SELECT * FROM favorites WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );
  }
}

module.exports = Favorite;
