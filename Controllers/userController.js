const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt-inzi');
const jwtAuthorization = require('../Middleware/jwtMiddleware');

const userController = {
  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const existing = await userModel.findOne({ email });

      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
      }

      const hashPassword = await bcrypt.stringToHash(password, 10);

      const user = new userModel({
        name,
        email,
        password: hashPassword,
        role,
      });

      await user.save();

      const token = jwtAuthorization.sign(user);

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

      const verifyHash = await bcrypt.verifyHash(password, user.password);

      if (!verifyHash) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      const token = jwtAuthorization.sign(user);

      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  },
};

module.exports = userController;
