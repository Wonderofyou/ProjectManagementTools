const Project = require("../models/Project");
const User = require("../models/User");
const ProjectMembers = require("../models/ProjectMembers");
const Invitation = require("../models/Invitations");
const Notification = require("../models/Notifications");
const UserNotification = require("../models/UserNotifications");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET; // Đảm bảo thay bằng secret thực tế
// project controller
const projectsController = {
    // Hàm tạo dự án
    createProject: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Xác thực token
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' });
                }

                // Lấy thông tin người dùng
                const user = await User.findById(userData.id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const { name, description, start_date, end_date } = req.body;

                let newProject;
                try {
                    newProject = await Project.create({
                        name: name,
                        description,
                        start_date: start_date || Date.now(),
                        end_date: end_date || Date.now() + 10 * 24 * 60 * 60 * 1000, // Mặc định cộng 10 ngày
                        owner_id: user._id,
                    });
                } catch (projectError) {
                    console.error('Error creating project:', projectError);
                    return res.status(500).json({ message: 'Error creating project' });
                }

                // Thêm người dùng vào ProjectMembers (người tạo dự án là admin)
                let newProjectMember;
                try {
                    newProjectMember = new ProjectMembers({
                        project_id: newProject._id,
                        user_id: user._id,
                        role: 'admin', // Người tạo là admin
                    });
                    await newProjectMember.save();
                } catch (memberError) {
                    console.error('Error adding member to project:', memberError);
                    return res.status(500).json({ message: 'Error adding member to project' });
                }

                // Phản hồi
                res.status(201).json({
                    message: 'Project created successfully',
                    project: newProject,
                });
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Internal server error' });
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

                const { projectId, email, content } = req.body; // Lấy projectId từ body

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

                // Tạo lời mời (Invitation)
                const newInvitation = await Invitation.create({
                    project_id: projectId,
                    inviter_id: userData.id,
                    invitee_id: invitedUser._id,
                });

                // Tạo thông báo (Notification)
                const newNotification = await Notification.create({
                    created_by: userData.id,
                    title: "Project Invitation",
                    content: content,
                    type: 1, // 1: Notification liên quan đến lời mời
                });

                // Liên kết thông báo với người dùng
                await UserNotification.create({
                    user_id: invitedUser._id,
                    notification_id: newNotification._id,
                    read_status: false, // Đánh dấu chưa đọc
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

    // Lấy danh sách dự án
    getProjects: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Xác thực token
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' });
                }

                // Lấy danh sách dự án
                const projects = await ProjectMembers.find({ user_id: userData.id });

                // Phản hồi
                res.status(200).json({
                    projects: projects,
                });
            });
        } catch (error) {
            console.error('Error getting projects:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


};

module.exports = projectsController;
