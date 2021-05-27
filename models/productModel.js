const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The Product must have a name'],
        maxlength: 100,
    },
    description: String,
    price: {
        type: Number,
        default: 0.0
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    photo: String,
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;