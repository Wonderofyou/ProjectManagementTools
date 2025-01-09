const Project = require("../models/Project");
const User = require("../models/User");
const ProjectMembers = require("../models/ProjectMembers");
const Invitation = require("../models/Invitations");
const Notification = require("../models/Notifications");
const UserNotification = require("../models/UserNotifications");
const Task = require("../models/Task");
const TaskMembers = require("../models/TaskMembers");
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

                console.log(Object.keys(req.body));
                const { name, description, start_date, end_date, status } = req.body;

                let newProject;
                try {
                    newProject = await Project.create({
                        name: name,
                        description: description,
                        start_date: start_date || Date.now(),
                        end_date: end_date || Date.now() + 10 * 24 * 60 * 60 * 1000, // Mặc định cộng 10 ngày
                        status: status,
                        owner_id: user._id,
                        progress: 0,
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

    // Hàm cập nhật trạng thái và tiến độ dự án
    updateStatusAndProgress: async (projectId) => {
        try {
            // Lấy tất cả các task trong dự án
            const tasks = await Task.find({ project_id: projectId });

            if (tasks.length === 0) {
                const progress = 0;
                await Project.findByIdAndUpdate(projectId, { progress });
                return;
            }

            // Tính toán số lượng task có trạng thái "Completed"
            const completedTasks = tasks.filter(task => task.status === 'Completed').length;

            // Tính tiến độ dự án
            const progress = Math.round((completedTasks / tasks.length) * 100);

            // Cập nhật tiến độ của dự án
            await Project.findByIdAndUpdate(projectId, { progress });

            // Cập nhật trạng thái dự án nếu tiến độ đạt 100%
            let newStatus = progress === 100 ? 'Completed' : 'In Progress';
            await Project.findByIdAndUpdate(projectId, { status: newStatus });

        } catch (error) {
            console.error('Error updating status and progress:', error);
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

                // Lấy danh sách dự án mà người dùng tham gia
                const projects = await ProjectMembers.find({
                    user_id: userData.id
                }).populate('project_id');


                // if (projects.length > 0) {
                //     // Các dự án sẽ được trả về với thông tin chi tiết của project
                //     console.log(projects);
                // } else {
                //     console.log('No projects found for this user.');
                // }

                // Cập nhật trạng thái và tiến độ cho từng dự án trước khi trả về
                for (let projectMember of projects) {
                    await projectsController.updateStatusAndProgress(projectMember.project_id._id);
                }

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
    //get a project
    getProject: async (req, res) => {
        try {
            const { token } = req.cookies;
            if (!token) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' });
                }

                const { projectId } = req.params;
                const project = await ProjectMembers.findOne({
                    user_id: userData.id,
                    project_id: projectId
                })
                    .populate({
                        path: 'project_id',         // Populate project_id trước
                        populate: { path: 'owner_id' } // Sau đó populate owner từ project_id
                    });
                res.status(200).json({ project });
            });
        }
        catch (error) {
            console.error('Error getting project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },

    deleteProject: async (req, res) => {
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
                // console.log(req.params);

                const { projectId } = req.params;

                // console.log(projectId);
                // console.log(userData.id);

                // Kiểm tra xem người dùng có quyền xóa dự án không
                const projectMember = await ProjectMembers.findOne({
                    project_id: projectId,
                    user_id: userData.id,
                    role: 'admin',
                });

                if (!projectMember) {
                    return res.status(403).json({ message: 'You do not have permission to delete this project' });
                }

                // Xóa các thành viên trong dự án

                const tasks = await Task.find({ project_id: projectId });
                const taskIds = tasks.map(task => task._id); // Lấy danh sách taskId

                // console.log('taskIds:', taskIds);

                // Xóa tất cả các thành viên tham gia công việc (TaskMembers) dựa trên taskId
                await TaskMembers.deleteMany({ task_id: { $in: taskIds } });

                // Xóa tất cả công việc trong dự án
                await Task.deleteMany({ project_id: projectId });

                // Xóa tất cả thành viên trong dự án
                await ProjectMembers.deleteMany({ project_id: projectId });

                await Project.findByIdAndDelete(projectId);

                // Phản hồi
                res.status(200).json({
                    message: 'Project deleted successfully',
                });
            });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },




};

module.exports = projectsController;
