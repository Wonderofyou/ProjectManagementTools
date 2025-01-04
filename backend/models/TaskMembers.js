const mongoose = require('mongoose');

// Tạo schema cho ProjectMembers
const TaskMembersSchema = new mongoose.Schema(
    {
        task_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task', // Tham chiếu tới Task model
            required: true, // Bắt buộc phải có task_id
        },
        assignee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Tham chiếu tới User model
            required: true, // Bắt buộc phải có user_id
        },
        assigned_at: {
            type: Date,
            default: Date.now, // Mặc định là thời gian hiện tại khi gia nhập
        },
        status: {
            type: String,
            enum: ["Pending", "On Progress", "Finish"], // Thêm enum để giới hạn giá trị
            default: "Pending"
        },
        assignee_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Tham chiếu tới User model
            required: true, // Bắt buộc phải có user_id
        },
    },
    {
        timestamps: true, // Tạo trường createdAt và updatedAt tự động
    }
);

// Tạo model từ schema
const TaskMembers = mongoose.model('TaskMembers', TaskMembersSchema);

module.exports = TaskMembers;
