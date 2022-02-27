const { validationResult } = require('express-validator');

const accountService = require("../services/account-service");
const ApiError = require('../exceptions/api-error');

class AccountContoller {
    
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError('Validation error. Make sure email specified is valid and password isn\'t less than 6 symbols.', errors.array()))
            }

            const { email, password } = req.body;
            const userData = await accountService.registration(email, password);

            res.cookie(
                'refresh_token', 
                userData.tokens.refresh_token, {maaxAge: 30 * 24 * 60 * 60 * 1000, 
                    httpOnly: true
            });            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await accountService.login(email, password);

            res.cookie(
                'refresh_token', 
                userData.tokens.refresh_token, {maaxAge: 30 * 24 * 60 * 60 * 1000, 
                    httpOnly: true
            });            return res.json(userData);
        } catch (e) {
           next(e); 
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refresh_token;
            const token = await accountService.logout(refreshToken);
            res.clearCookie('refresh_token');

            return res.json({
                message: 'User has been logged out.'
            });
        } catch (e) {
           next(e); 
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await accountService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);  // Redirects to home after activation
        } catch (e) {
           next(e); 
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refresh_token;
            const userData = await userService.refresh(refreshToken);

            res.cookie(
                'refresh_token', 
                userData.tokens.refresh_token, {maaxAge: 30 * 24 * 60 * 60 * 1000, 
                    httpOnly: true
            });

        } catch (e) {
           next(e); 
        }
    }

    async authCheck(req, res, next) {
        try {
            return res.json({
                message: 'All correct! :)'
            })
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new AccountContoller();