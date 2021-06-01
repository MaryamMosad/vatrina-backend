const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);
//create new order restricted to signed up users
//every user can view their orders

//admin routes for updating/deleting /viewing all orders
router.use(authController.strictTo('admin'));
router.route('/').get(orderController.getAllOrders);
router.route('/:id').patch(orderController.updateOrder).delete(orderController.deleteOrder);

module.exports = router;
