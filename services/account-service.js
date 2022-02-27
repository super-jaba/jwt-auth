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
        const candidate = await db.query(
            'SELECT * FROM accounts WHERE email = $1;', 
            [email]
        );
        if (candidate.rows[0]) {
            throw ApiError.BadRequestError(`User with email ${email} already exists.`);
        }

        // Generating password hash
        const passwordHash = await bcrypt.hash(password, 3);

        // Generate activation link
        const activationLink = uuid.v4();

        // Add account to the DB
        const newAccount = await db.query(
            'INSERT INTO accounts (email, password, activation_link) VALUES ($1, $2, $3) RETURNING *;', 
            [email, passwordHash, activationLink]
        );

        // Send activation email
        await mailService.sendActivationMail(
            email, 
            `${process.env.API_URL}/api/account/activate/${activationLink}`
        );

        // Generate auth tokens
        const userDto = new UserDto(newAccount.rows[0]);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            user: { ...userDto },
            tokens: { 
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }
        };
    }

    async login(email, password) {
        const candidate = await db.query(
            'SELECT * FROM accounts WHERE email=$1;', 
            [email]
        );
        if (!candidate.rows[0]) {
            throw ApiError.BadRequestError('User not found.');
        }

        // Comparing password hashes
        const passwordEquality = await bcrypt.compare(password, candidate.rows[0].password);
        if (!passwordEquality) {
            throw ApiError.BadRequestError('Invalid credentials.');
        }

        const userDto = new UserDto(candidate.rows[0]);

        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            user: { ...userDto },
            tokens: { 
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }
        };
    }

    async logout(refreshToken) {
        // All we need to do is just delete token specified in the DB
        await tokenService.removeToken(refreshToken);
    }

    async activate(activationLink) {
        await db.query(
            'UPDATE accounts SET is_activated=true WHERE activation_link=$1;', 
            [activationLink]
        );
    }

    async refresh(token) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        // Validating token
        const userData = tokenService.validateRefreshToken(token); 

        // Checking for token existence 
        const tokenFromDB = await tokenService.findToken(token);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        // Finding user to generate new tokens
        const user = await db.query(
            'SELECT * FROM accounts WHERE id=$1;', 
            [tokenFromDB.user_id]
        );
        const userDto = new UserDto(user);

        // Generating and saving new pair of tokens
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            user: { ...userDto },
            tokens: { 
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }
        };
    }
}

module.exports = new AccountService();