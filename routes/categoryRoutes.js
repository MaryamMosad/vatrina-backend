const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/' , categoryController.getAllCategories);
router.get('/:id' ,categoryController.getCategory)

router.use(authController.protect, authController.strictTo('admin'));

router.route('/').post(categoryController.createCategory);
router.route('/:id').patch(categoryController.updateCategory).delete(categoryController.deleteCategory);

module.exports = router;
