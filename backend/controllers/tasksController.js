const Task = require("../models/Task");
const ProjectMembers = require("../models/ProjectMembers");
const TaskMembers = require("../models/TaskMembers");
const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
const mongoose = require('mongoose');

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const tasksController = {
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


                const { name, description, status, priority, start_date, end_date, assigned_members } = req.body;

                const updatedAssignedMembers = Array.isArray(assigned_members) ? [...assigned_members] : [];

                // Thêm userData.id vào danh sách nếu chưa có
                if (!updatedAssignedMembers.includes(userData.id)) {
                    updatedAssignedMembers.push(userData.id);
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
                if (Array.isArray(updatedAssignedMembers) && updatedAssignedMembers.length > 0) {
                    const taskMembersData = updatedAssignedMembers.map(memberId => ({
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
                // console.log("reg parmas: ", req.params);
                // console.log("reg body: ", req.body);

                // if (!mongoose.Types.ObjectId.isValid(project_id)) {
                //     console.log("Invalid project_id");
                // }

                // console.log("get: ", project_id);
                // console.log("get: ", userData.id);

                // Kiểm tra quyền trong dự án
                const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });

                if (!isMember) {
                    return res.status(403).json({ message: "You are not authorized to view tasks for this project" });
                }

                // Lấy danh sách các task mà người dùng tham gia
                let tasks = await TaskMembers.find({
                    assignee_id: userData.id, // Điều kiện người được gán
                }).populate('task_id');

                // Lọc ra các task thuộc về dự án
                tasks = tasks.filter(task =>
                    task.task_id && task.task_id.project_id &&
                    task.task_id.project_id.equals(project_id) // So sánh ObjectId
                );

                console.log("Valid tasks: ", tasks);

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

                // Lấy danh sách thành viên trong dự án (không bao gồm user hiện tại)
                const members = await ProjectMembers.find({
                    project_id: project_id,
                    user_id: { $ne: userData.id } // Toán tử $ne để loại trừ user hiện tại
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