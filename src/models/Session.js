const db = require('../database/db');
const crypto = require('crypto');

class Session {
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static async create(userId) {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await db.run(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt.toISOString()]
    );
    
    return { token, expiresAt };
  }

  static async findByToken(token) {
    const session = await db.get(
      'SELECT * FROM sessions WHERE session_token = ? AND expires_at > datetime("now")',
      [token]
    );
    
    if (session) {
      return session;
    }
    return null;
  }

  static async delete(token) {
    await db.run('DELETE FROM sessions WHERE session_token = ?', [token]);
  }

  static async deleteByUserId(userId) {
    await db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
  }

  static async cleanupExpired() {
    await db.run('DELETE FROM sessions WHERE expires_at <= datetime("now")');
  }
}

module.exports = Session;
