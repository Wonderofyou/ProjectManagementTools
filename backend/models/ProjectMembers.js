const mongoose = require('mongoose');

// Tạo schema cho ProjectMembers
const ProjectMembersSchema = new mongoose.Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project', // Tham chiếu tới Project model
            required: true, // Bắt buộc phải có project_id
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user', // Tham chiếu tới User model
            required: true, // Bắt buộc phải có user_id
        },
        role: {
            type: String,
            enum: ['admin', 'member'], // Các vai trò có thể có trong dự án
            default: 'member', // Mặc định là member
        },
        joined_at: {
            type: Date,
            default: Date.now, // Mặc định là thời gian hiện tại khi gia nhập
        },
    },
    {
        timestamps: true, // Tạo trường createdAt và updatedAt tự động
    }
);

// Tạo model từ schema
const ProjectMembers = mongoose.model('ProjectMembers', ProjectMembersSchema);

module.exports = ProjectMembers;
