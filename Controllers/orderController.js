const orderModel = require('../Models/orderModel');
const productModel = require('../Models/productModel');
const userModel=require('../Models/userModel')
const productController=require('../Controllers/productController')
const jwtAuthorization = require('../Middleware/jwtMiddleware');
const bcrypt = require('bcrypt-inzi');

const orderController = {
  async orderProduct(req, res,next) {
    try {
      const { email, password, priceUnit, id } = req.body;

      const user = await userModel.findOne({ email });
      const product = await productModel.findById(id);

      const verifyHash2= await bcrypt.varifyHash(password, user.password);

      if (!verifyHash2) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      if (user.role === 'buyer') {
        if (!email || !password || !priceUnit) {
          return res.status(400).json({ message: 'All fields required' });
        }

        const order = new orderModel({ priceUnit });

        await order.save();

        if (product.productPrice === order.priceUnit) {
          await productController.updateAndComeback(next);
        }

        return res.status(200).json(order);
      }
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

module.exports = orderController;
