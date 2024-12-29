const User = require("../models/User");

const userController = {
  // Lấy thông tin người dùng theo ID
  getUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOneById(id); // Tìm người dùng theo ID
      if (user) {
        return res.status(200).json(user); // Trả về người dùng nếu tìm thấy
      } else {
        return res.status(404).json({ message: "User not found" }); // Nếu không tìm thấy người dùng
      }
    } catch (err) {
      console.error("Error in getUser:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Cập nhật thông tin người dùng theo ID
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { password } = req.body; // Lấy password từ request body
    try {
      const updatedUser = await User.updateById(id, password); // Cập nhật password
      if (updatedUser) {
        return res.status(200).json({ message: "User updated" }); // Trả về thông báo thành công
      } else {
        return res.status(404).json({ message: "User not found" }); // Nếu không tìm thấy người dùng
      }
    } catch (err) {
      console.error("Error in updateUser:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Xóa người dùng theo ID
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.deleteById(id); // Xóa người dùng theo ID
      if (deletedUser) {
        return res.status(200).json({ message: "User deleted" }); // Trả về thông báo thành công
      } else {
        return res.status(404).json({ message: "User not found" }); // Nếu không tìm thấy người dùng
      }
    } catch (err) {
      console.error("Error in deleteUser:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;
