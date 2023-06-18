const productModel = require('../Models/productModel');
const userModel = require('../Models/userModel');
const jwtAuthorization=require('../Middleware/jwtMiddleware')
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
        const token = jwtAuthorization.sign({product});

        return res.status(200).json({product,token});
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
  
  async deleteProduct(req,res){
     
    const productId = req.params.id;

    try {
      const product = await productModel.findByIdAndDelete(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  ``
      return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }


  },
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { email,password, productName, productDis, productPrice, productQunity, productInstock } = req.body;

     const user =await userModel.findOne({email})
     const verifyHash2 = await bcrypt.varifyHash(password, user.password);

     if (!verifyHash2) {
       return res.status(400).json({ message: 'Wrong password' });
     }

      if (user.role !== 'seller') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

    
      if (!productName || !productDis || !productPrice || !productQunity || !productInstock) {
        return res.status(400).json({ message: 'All fields are required' });
      }

     
      const product = await productModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

     
      product.productName = productName;
      product.productDis = productDis;
      product.productPrice = productPrice;
      product.productQunity = productQunity;
      product.productInstock = productInstock;

      await product.save();
      const token=jwtAuthorization.sign({product})

      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  async verfiyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.sendStatus(401);
      }
  
      const decoded=await jwtAuthorization.verify(token, process.env.JWT_PRIVATE_KEY)
      console.log(decoded)
           req.user =decoded.user;
        next();
    } catch (error) {
      return res.status(400).json({message:"Invalid token"})
    }
   

  }
};

module.exports = productController;
