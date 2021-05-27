const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync=require('./../Utils/catchAsync');
const Category = require('../models/categoryModel');

exports.getAllProducts =catchAsync(async (req, res, next) => {
    const product=await Product.find().populate({ path: 'category', select: 'name -_id'})
//filtering options
  /*  const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const product = await features.query;
*/
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: product.length,
      data: {
        data: product
      }
    });
  });
;
exports.getProduct = factory.getOne(Product, { path: 'category', select: 'name -_id'});
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  await Category.updateMany({ '_id': product.category }, { $push: { product:product._id } });

  res.status(201).json({
    status: 'success',
    data: {
      data: product
    }
  });
});
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);
