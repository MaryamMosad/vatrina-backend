const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();
//Normal users
router.route('/').get(productController.getAllProducts);
router.route('/:id').get(productController.getProduct);

//admin only routes 
router.use(authController.protect,authController.strictTo('admin', 'merchant'));
router.route('/').post(productController.createProduct);
router.route('/:id')
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
