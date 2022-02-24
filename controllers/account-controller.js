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
            res.cookie('refresh_token', userData.tokens.refresh_token, {maaxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError('Validation error. Make sure email specified is valid and password isn\'t less than 6 symbols.', errors.array()))
            }

            // TODO: Handle login controller 
        } catch (e) {
           next(e); 
        }
    }

    async logout(req, res, next) {
        try {
            // TODO: Handle logout controller 
        } catch (e) {
           next(e); 
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await accountService.activate(activationLink);
            return res.json({
                message: 'Account successfully activated.'
            });
        } catch (e) {
           next(e); 
        }
    }

    async refresh(req, res, next) {
        try {
            // TODO: Handle refresh controller 
        } catch (e) {
           next(e); 
        }
    }
}


module.exports = new AccountContoller();