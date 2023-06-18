const productModel = require('../Models/productModel');
const userModel=require('../Models/userModel')
const jwtAuthorization = require('../Middleware/jwtMiddleware');
const bcrypt = require('bcrypt-inzi');

const orderController = {
  async orderProduct(req, res) {
    
    try {
      const { email, password, priceUnit, id } = req.body;
        const user = await userModel.findOne({ email });
  
      const verifyHash2= await bcrypt.varifyHash(password, user.password);

      if (!verifyHash2) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      if (user.role === 'buyer') {
        if (!email || !password || !priceUnit) {
          return res.status(400).json({ message: 'All fields required' });
        }
     
      const product = await productModel.findById(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      if (product.productPrice < priceUnit || product.productPrice >priceUnit) {
        return res.status(400).json({ error: 'Enter The Correct Amount' });
      }

      if(product.productPrice === priceUnit)
      {

        product.productInstock =false;
        await product.save();
    
        return res.json({ message: 'Order placed successfully' });

      }
    }

    if (user.role != 'buyer') {

      return res.status(400).json({message:"Login as a Buyer"})
    }

    if(user.role !="buyer"){
      return res.json({ message: 'Login as a Buyer account' });
    }
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
