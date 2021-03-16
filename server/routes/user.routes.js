const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/c/count', userController.getCount);
router.get('/', userController.getAll)

router.use(authController.protect);

router.put('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.put('/me', userController.updateMe);

module.exports = router;
