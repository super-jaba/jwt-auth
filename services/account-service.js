const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const tokenService = require('../services/token-service');
const db = require('../db/db');
const mailService = require('./mail-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class AccountService {
    async registration(email, password) {
        // Check if user with credentials specified already exists in DB
        const candidate = await db.query('SELECT * FROM accounts WHERE email = $1;', [email]);
        if (candidate.rows[0]) {
            throw ApiError.BadRequestError(`User with email ${email} already exists.`);
        }

        // Generating password hash
        const passwordHash = await bcrypt.hash(password, 3);

        // Generate activation link
        const activationLink = uuid.v4();

        // Add account to the DB
        const newAccount = await db.query(
            'INSERT INTO accounts (email, password, activation_link) VALUES ($1, $2, $3) RETURNING *', 
            [email, passwordHash, activationLink]
        );

        // Send activation email
        await mailService.sendActivationMail(email, activationLink);

        // Generate auth tokens
        const userDto = new UserDto(newAccount.rows[0]);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            user: { ...newAccount.rows[0] },
            tokens: { 
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }
        };
    }
}

module.exports = new AccountService();