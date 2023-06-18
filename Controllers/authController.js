const userModel = require('../Models/userModel');
const jwtAuthorization = require('../Middleware/jwtMiddleware');
const bcrypt = require('bcrypt-inzi');


const authController = {
  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const existing = await userModel.findOne({ email });

      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const hashPassword = await bcrypt.stringToHash(password, 10);

      const user = new userModel({
        name,
        email,
        password: hashPassword,
        role,
      });

      await user.save();

      const token = jwtAuthorization.sign({user});

      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      const verifyHash2 = await bcrypt.varifyHash(password, user.password);

      if (!verifyHash2) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      const token = jwtAuthorization.sign({user});

      return res.status(200).json({user,token});
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
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

module.exports = authController;
