const { Router } = require('express');
const { body } = require('express-validator');

const accountController = require('../controllers/account-controller');


const router = new Router();

router.post('/registration', body('email').isEmail(), body('password').isLength({ min: 6, max: 255 }), accountController.registration);
router.post('/login', accountController.login);
router.post('/logout', accountController.logout);
router.get('/activate/:link', accountController.activate);
router.get('/refresh', accountController.refresh);


module.exports = router;