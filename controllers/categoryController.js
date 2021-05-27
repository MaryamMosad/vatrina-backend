const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');

exports.getAllCategories = factory.getAll(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
exports.getCategory = factory.getOne(Category,{path:'product',select:'title price photo -_id'}); 
