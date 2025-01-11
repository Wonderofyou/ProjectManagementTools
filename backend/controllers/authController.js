const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET; // Đảm bảo thay bằng secret thực tế
// Hàm đăng ký người dùng
const authController = {
  signupController: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (e) {
      res.status(422).json(e);
    }
  },

  // Hàm đăng nhập người dùng
  loginController: async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email: userDoc.email,
          id: userDoc._id
        }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.status(422).json('email not found');
    }
  },

  // Hàm lấy thông tin người dùng
  profile: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  },

  // Hàm đăng xuất người dùng
  logoutController: (req, res) => {
    res.cookie('token', '').json({ message: "Logout successful" });
  }
};

module.exports = authController;
