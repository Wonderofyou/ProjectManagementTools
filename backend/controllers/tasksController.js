const Task = require("../models/Task");
const ProjectMembers = require("../models/ProjectMembers");
const jwt = require("jsonwebtoken");

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

                const { project_id, kanban_id, name, description, status, priority, start_date, end_date } = req.body;

                // Kiểm tra xem người dùng có quyền trong dự án không
                const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });
                if (!isMember) {
                    return res.status(403).json({ message: "You are not authorized to create tasks for this project" });
                }

                // Tạo task mới
                const newTask = await Task.create({
                    project_id,
                    kanban_id,
                    created_by: userData.id,
                    name,
                    description,
                    status: status || "Pending",
                    priority: priority || "Medium",
                    start_date: start_date || Date.now(),
                    end_date: end_date || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                });

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

                const { project_id } = req.query;

                // Kiểm tra quyền trong dự án
                const isMember = await ProjectMembers.findOne({ project_id, user_id: userData.id });
                if (!isMember) {
                    return res.status(403).json({ message: "You are not authorized to view tasks for this project" });
                }

                // Lấy danh sách các task
                const tasks = await Task.find({ project_id });

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
};

module.exports = tasksController;
