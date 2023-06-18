const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDis: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productQunity: { type: Number, required: true },
  productInstock: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', productSchema);
