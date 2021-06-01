const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../Utils/catchAsync');
const Category = require('../models/categoryModel');


exports.getAllProducts = factory.getAll(Product);

exports.getProduct = factory.getOne(Product);

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  await Category.updateMany({ '_id': product.category }, { $push: { product: product._id } });

  res.status(201).json({
    status: 'success',
    data: {
      data: product
    }
  });
});
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);
