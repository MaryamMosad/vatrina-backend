const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();
//users in general can view categories wether they're signed in or not
router.get('/' , categoryController.getAllCategories);
router.get('/:id' ,categoryController.getCategory)

//only admins can create,update or delete a category
router.use(authController.protect, authController.strictTo('admin'));
router.route('/').post(categoryController.createCategory);
router.route('/:id').patch(categoryController.updateCategory).delete(categoryController.deleteCategory);

module.exports = router;
