const Task = require("../models/Task");
const ProjectMembers = require("../models/ProjectMembers");
const TaskMembers = require("../models/TaskMembers");
const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
const mongoose = require('mongoose');

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const tasksController = {
    // Cập nhật trạng thái của task
    updateTaskStatus: async (req, res) => {
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

                const { task_id } = req.params; // Lấy `task_id` từ params
                const { status } = req.body; // Lấy `status` từ body

                // Kiểm tra xem `status` có hợp lệ không
                const validStatuses = ["Pending", "In Progress", "Completed"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }

                // Kiểm tra quyền truy cập task
                const isAssignee = await TaskMembers.findOne({
                    task_id: task_id,
                    assignee_id: userData.id,
                });

                if (!isAssignee) {
                    return res.status(403).json({ message: "You are not authorized to update this task's status" });
                }


                // Cập nhật trạng thái task
                const updatedTask = await Task.findByIdAndUpdate(
                    task_id,
                    { status },
                    { new: true } // Trả về task đã cập nhật
                );

                if (!updatedTask) {
                    return res.status(404).json({ message: "Task not found" });
                }

                // Phản hồi
                res.status(200).json({
                    message: "Task status updated successfully",
                    task: updatedTask,
                });
            });
        } catch (error) {
            console.error("Error updating task status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Tạo task mới
    createTask: async (req, res) => {
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

                const { project_id } = req.params;
                // console.log("create project_id: ", project_id);
                // console.log("create userdat_id: ", userData.id);

                const isAdminOfThisProject = await ProjectMembers.findOne({
                    project_id: project_id,
                    user_id: userData.id,
                    role: "admin",
                });

                if (!isAdminOfThisProject) {
                    return res.status(403).json({ message: "You are not authorized to create tasks for this project" });
                }

                const { name, description, status, priority, start_date, end_date, assigned_members } = req.body;

                // const updatedAssignedMembers = Array.isArray(assigned_members) ? [...assigned_members] : [];

                // // Thêm userData.id vào danh sách nếu chưa có
                // if (!updatedAssignedMembers.includes(userData.id)) {
                //     updatedAssignedMembers.push(userData.id);
                // }

                // Tạo task mới
                const newTask = await Task.create({
                    project_id,
                    created_by: userData.id,
                    name,
                    description,
                    status: status,
                    priority: priority,
                    start_date: start_date || Date.now(),
                    end_date: end_date || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                });

                // Ghi nhận các thành viên được assign vào bảng TaskMembers
                if (Array.isArray(assigned_members) && assigned_members.length > 0) {
                    const taskMembersData = assigned_members.map(memberId => ({
                        task_id: newTask._id,
                        assignee_id: memberId,
                        assigned_by: userData.id,
                    }));

                    await TaskMembers.insertMany(taskMembersData);
                }

                // Phản hồi
                res.status(201).json({
                    message: "Task created successfully",
                    task: newTask,
                });
            });
        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Lấy danh sách các task của người dùng
    getTasks: async (req, res) => {
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

                const { project_id } = req.params;  // Changed to params from query

                // Kiểm tra quyền trong dự án
                const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });

                if (!isMember) {
                    return res.status(403).json({ message: "You are not authorized to view tasks for this project" });
                }

                // Lấy danh sách các task mà người dùng tham gia
                let tasks = await TaskMembers.find({
                    assignee_id: userData.id
                }).populate('task_id');

                // console.log("Tasks: ", tasks);

                // Lọc ra các task thuộc về dự án
                tasks = tasks.filter(task =>
                    task.task_id && task.task_id.project_id &&
                    task.task_id.project_id.equals(project_id) // So sánh ObjectId
                );

                tasks = tasks.filter((task, index, self) =>
                    index === self.findIndex((t) => (
                        t.task_id._id.toString() === task.task_id._id.toString()
                    ))
                );

                // console.log("Valid tasks: ", tasks);

                // Phản hồi
                res.status(200).json({
                    message: "Tasks retrieved successfully",
                    tasks,
                });
            });
        } catch (error) {
            console.error("Error getting tasks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Lấy danh sách các task để hiện thể trên trang report
    getTasksForReport: async (req, res) => {
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

                const { project_id } = req.params;  // Changed to params from query

                // Kiểm tra quyền trong dự án
                const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });

                if (!isMember) {
                    return res.status(403).json({ message: "You are not authorized to view tasks for this project" });
                }

                let tasksAndMembers = await TaskMembers.find()
                    .populate({
                        path: 'assignee_id', // Kết hợp với bảng User qua trường assignee_id
                        model: 'User', // Tên model của collection User
                    })
                    .populate({
                        path: 'task_id', // Kết hợp với bảng Task qua trường task_id
                        model: 'Task', // Tên model của collection Task
                    });

                // Lọc ra các task thuộc về dự án
                tasksAndMembers = tasksAndMembers.filter(task => task.task_id.project_id.equals(project_id));
                // task.task_id && task.task_id.project_id && task.user_id._id &&

                // console.log("Valid tasks: ", tasksAndMembers);

                // Phản hồi
                res.status(200).json({
                    message: "Tasks retrieved successfully",
                    tasksAndMembers,
                });
            });
        } catch (error) {
            console.error("Error getting tasks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },


    // Lấy danh sách các thành viên trong dự án
    getMembersInProject: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ message: "Authentication required" });
            }

            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                }

                const { project_id } = req.params;

                // const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });

                // if (!isMember) {
                //     return res.status(403).json({ message: "You are not authorized to view members for this project" });
                // }

                // Lấy danh sách thành viên trong dự án 
                const members = await ProjectMembers.find({
                    project_id: project_id,
                    // user_id: { $ne: userData.id } // Toán tử $ne để loại trừ user hiện tại
                }).populate('user_id')

                res.status(200).json({
                    message: "Members retrieved successfully",
                    members,
                });
            });
        } catch (error) {
            console.error("Error getting members:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};

module.exports = tasksController;