const User = require("../models/User");
const jwt = require("jsonwebtoken");

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

const userController = {
  //edit profile
  editProfile: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await User.findByIdAndUpdate(userData.id,
          { name: req.body.name, email: req.body.email },
          { new: true });
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  },
}

module.exports = userController;
