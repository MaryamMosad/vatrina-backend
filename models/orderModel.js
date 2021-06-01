const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    price: { //should be changed to refrence the product's price
        type: Number,
        default: 0.0
    },
    quantity:{
        type:Number,
        default:1
    },
    photo: String,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    address:String,
    status:Number
});
orderSchema.pre(/^find/ ,function (next){
    this.populate({ path: 'product', select: 'name -_id'}).populate({path:user, select:'name -_id'});
    next();
})
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;