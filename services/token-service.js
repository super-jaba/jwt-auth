const jwt = require('jsonwebtoken');

const db = require('../db/db');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const result = await db.query('INSERT INTO tokens (user_id, token_value) VALUES ($1, $2) RETURNING *;', [userId, refreshToken]);
        return result.rows[0];
    }

    async deleteExpiredTokensOf(userId) {
        // TODO: Remove expired refresh tokens from db.
    }
}

module.exports = new TokenService();