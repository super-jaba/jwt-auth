const jwt = require('jsonwebtoken');

const db = require('../db/db');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload, process.env.JWT_ACCESS_SECRET || 'abcde',  // SET VALUE ON PRODUCTION!!!
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            payload, process.env.JWT_REFRESH_SECRET || '12345',  // SET VALUE ON PRODUCTION!!! 
            { expiresIn: '30d' }
        );
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const result = await db.query('INSERT INTO tokens (user_id, token_value) VALUES ($1, $2) RETURNING *;', [userId, refreshToken]);
        return result.rows[0];
    }

    async removeToken(token) {
        await db.query('DELETE FROM tokens WHERE token_value=$1;', [token]);
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'abcde');  // SET VALUE ON PRODUCTION!!!
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || '12345');  // SET VALUE ON PRODUCTION!!!
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(token) {
        const searchResult = await db.query('SELECT * FROM tokens WHERE token_value=$1;', [token]);
        return searchResult.rows[0];
    }
}

module.exports = new TokenService();