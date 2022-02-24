const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const db = require('../db/db');
const mailService = require('./mail-service');

class AccountService {
    async registration(email, password) {
        // Check if user with credentials specified already exists in DB
        const candidate = await db.query('SELECT * FROM accounts WHERE email = $1;', [email]);
        if (candidate.rows[0]) {
            throw new Error(`User with email ${email} already exists!`);
        }

        // Generating password hash
        const passwordHash = await bcrypt.hash(password, 3);

        // Generate activation link
        const activationLink = uuid.v4();

        // Add account to the DB
        const newAccount = await db.query('INSERT INTO accounts (email, password, activation_link) VALUES ($1, $2, $3) RETURNING *', [email, passwordHash, activationLink]);

        // Send activation email
        await mailService.sendActivationMail(email, activationLink);

        return newAccount.rows[0];
    }
}

module.exports = new AccountService();