const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'There is no category without a name!'],
        unique: [true, 'This category already exists']
    },
    icon: String,
    product: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product',
        select:false
    },
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;