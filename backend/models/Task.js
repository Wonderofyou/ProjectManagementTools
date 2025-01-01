const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "On Progress", "Finish"], // Thêm enum để giới hạn giá trị
            default: "Pending"
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"], // Thêm enum để giới hạn giá trị
            default: "Medium"
        },
        start_date: {
            type: Date,
            default: Date.now // Sửa lỗi cú pháp từ "require: Date.now" thành "default: Date.now"
        },
        end_date: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // Sửa để giá trị mặc định là 10 ngày sau
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Task = mongoose.model('Task', TaskSchema); // Sửa lại tên model để không bị trùng lặp

module.exports = Task;
