const productModel = require('../Models/productModel');
const userModel = require('../Models/userModel');
const bcrypt=require('bcrypt-inzi')
const productController = {
  async createProduct(req, res) {
    try {
      const {
        email,
        password,
        productName,
        productDis,
        productPrice,
        productQunity,
        productInstock,
      } = req.body;

      const user = await userModel.findOne({ email });

      const verifyHash2 = await bcrypt.varifyHash(password, user.password);

      if (!verifyHash2) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      if (user.role === 'seller') {
        if (
          !productName ||
          !productDis ||
          !productPrice ||
          !productQunity ||
          !productInstock ||
          !email ||
          !password
        ) {
          return res.status(400).json({ message: 'All fields required' });
        }

        const product = new productModel({
          productName,
          productDis,
          productPrice,
          productQunity,
          productInstock,
        });

        await product.save();

        return res.status(200).json(product);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getProduct(req, res) {
    const id = req.params.id;
    const getProduct = await productModel.findById(id);
    console.log(getProduct);
    res.status(200).json(getProduct);
  },

  async updateAndComeback(req, res) {
    try {
      const idget = req.params.id;
      const product = await productModel.findById(idget);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.productInstock = false;
      await product.save();

      return res
        .status(200)
        .json({ message: 'Product priceInstock updated successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = productController;
