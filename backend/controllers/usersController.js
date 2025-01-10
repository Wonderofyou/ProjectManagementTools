const Project = require("../models/Project");
const User = require("../models/User");
const ProjectMembers = require("../models/ProjectMembers");
const Invitation = require("../models/Invitations");
const Notification = require("../models/Notifications");
const UserNotification = require("../models/UserNotifications");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

const userController = {
  //edit profile
  editProfile: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });

        const updateData = {
          name: req.body.name,
          email: req.body.email,
        };

        // Nếu có mật khẩu trong body thì hash mật khẩu và thêm vào dữ liệu cập nhật
        if (req.body.oldpassword) {
          const password = req.body.oldpassword;
          const user = await User.findById(userData.id);

          const passOk = bcrypt.compareSync(password, user.password);
          if (!passOk) {
            return res.status(401).json({ error: "Wrong password" }); // Return immediately if password is wrong
          }

          updateData.password = bcrypt.hashSync(req.body.password, salt);
        }

        try {
          const updatedUser = await User.findByIdAndUpdate(
            userData.id,
            updateData,
            { new: true }
          );
          const { name, email, _id } = updatedUser;
          res.json({ name, email, _id });
        } catch (err) {
          res.status(500).json({ error: 'Failed to update profile' });
        }
      });
    } else {
      res.status(401).json({ error: 'No token provided' });
    }
  },



  // mời người khác vòa dự án 
  sendInvite: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        const { projectId, email, content, role } = req.body; // Lấy projectId từ body

        // Kiểm tra xem người dùng được mời có tồn tại không
        const invitedUser = await User.findOne({ email: email });
        if (!invitedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra xem người gửi lời mời có phải là admin của dự án không
        const projectMember = await ProjectMembers.findOne({
          project_id: projectId,
          user_id: userData.id,
        });

        if (!projectMember || projectMember.role !== 'admin') {
          return res.status(403).json({ message: "You must be an admin of the project to send invitations" });
        }


        // Tạo thông báo (Notification)
        const newNotification = await Notification.create({
          created_by: userData.id,
          title: "Project Invitation",
          content: content,
          type: 1, // 1: Notification liên quan đến lời mời
        });

        // Liên kết thông báo với người dùng
        const userNotification = await UserNotification.create({
          user_id: invitedUser._id,
          notification_id: newNotification._id,
          read_status: false, // Đánh dấu chưa đọc
        });

        // Tạo lời mời (Invitation)
        await Invitation.create({
          project_id: projectId,
          inviter_id: userData.id,
          invitee_id: invitedUser._id,
          role: role,
        });
        return res.status(201).json({
          message: "Invitation sent successfully",
        });
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getInvitations: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        // Lấy danh sách lời mời của người dùng
        const invitations = await Invitation.find({ invitee_id: userData.id })
          .populate('project_id', 'name') // Lấy thông tin dự án (tên dự án)
          .populate('inviter_id', 'name email'); // Lấy thông tin người gửi (tên và email)

        console.log(invitations);

        return res.status(200).json({
          message: "Invitations fetched successfully",
          invitations,
        });
      });
    } catch (error) {
      console.error("Error fetching invitations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  //response invite
  responseInvite: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        const { invitationId, status } = req.body;

        // Lấy thông tin lời mời
        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
          return res.status(404).json({ message: "Invitation not found" });
        }

        // Kiểm tra người nhận có phải là người dùng hiện tại không
        if (invitation.invitee_id != userData.id) {
          return res.status(403).json({ message: "Unauthorized" });
        }

        const projectMember = await ProjectMembers.findOne({
          project_id: invitation.project_id,
          user_id: userData.id,
        });
        if (projectMember) {
          return res.status(400).json({ message: "You are already a member of this project" });
        }
        if (invitation.status !== "pending") {
          return res.status(400).json({ message: "Invitation has already been responded" });
        }
        invitation.status = status;

        //save invitation
        await invitation.save();
        if (status === "accepted") {
          // Thêm người dùng vào ProjectMembers
          const newProjectMember = new ProjectMembers({
            project_id: invitation.project_id,
            user_id: userData.id,
            role: invitation.role,
          });
          await newProjectMember.save()
        }
        //lấy tên của project
        const project = await Project.findById(invitation.project_id);

        //tạo thông báo :
        const notification = await Notification.create({
          created_by: userData.id,
          title: "Invitation Response",
          content: `Your invitation to project ${project.name} has been ${status}`,
          type: 1,
        });

        // Tạo thông báo cho người gửi
        const userNotification = new UserNotification({
          user_id: invitation.inviter_id,
          notification_id: notification._id,
        });
        await userNotification.save();

        return res.status(200).json({ message: "Response sent successfully" });
      });
    } catch (error) {
      console.error("Error responding to invitation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getNotifications: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        const { status } = req.query;

        // Tạo điều kiện truy vấn linh hoạt
        const query = { user_id: userData.id };
        if (status === "read") query.read_status = true;
        if (status === "unread") query.read_status = false;

        // Truy vấn thông báo
        const notifications = await UserNotification.find(query)
          .populate("notification_id")
          .sort({ createdAt: -1 });

        return res.status(200).json({
          message: "Notifications fetched successfully",
          notifications,
        });
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  updateNotificationStatus: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        const { notificationId } = req.params; // Lấy notificationId từ params
        if (!notificationId) {
          return res.status(400).json({ message: "Notification ID is required" });
        }

        // Tìm thông báo theo ID và user_id
        const userNotification = await UserNotification.findOne({
          _id: notificationId,
          user_id: userData.id,
        });

        if (!userNotification) {
          return res.status(404).json({ message: "Notification not found" });
        }

        // Đảo trạng thái đọc
        userNotification.read_status = !userNotification.read_status;
        await userNotification.save();

        return res.status(200).json({
          message: "Notification status updated successfully",
          read_status: userNotification.read_status,
        });
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Xác thực token
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        const { notificationId } = req.params; // Lấy notificationId từ params
        if (!notificationId) {
          return res.status(400).json({ message: "Notification ID is required" });
        }

        // Xóa thông báo
        await UserNotification.deleteOne({ _id: notificationId, user_id: userData.id });
        await Notification.deleteOne({ _id: notificationId });

        return res.status(200).json({ message: "Notification deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

}

module.exports = userController;
