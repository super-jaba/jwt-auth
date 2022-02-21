const { Router } = require('express');
const accountController = require('../controllers/account-controller');


const router = new Router();

router.post('/registration', accountController.registration);
router.post('/login', accountController.login);
router.post('/logout', accountController.logout);
router.get('/activate/:link', accountController.activate);
router.get('/refresh', accountController.refresh);


module.exports = router;