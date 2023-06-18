const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  priceUnit: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
