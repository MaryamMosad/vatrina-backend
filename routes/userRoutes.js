const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//protected for logged in users only
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe',userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);

//admin only access
router.use(authController.strictTo('admin'));
router.route('/').get(userController.getAllUsers)
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;