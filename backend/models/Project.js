const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        start_date: {
            type: Date,
            default: Date.now // Sửa lỗi cú pháp từ "require: Date.now" thành "default: Date.now"
        },
        end_date: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // Sửa để giá trị mặc định là 10 ngày sau
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
        },
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        progress: {  // Thêm thuộc tính progress kiểu số thực
            type: Number,
            default: 0.0, // Giá trị mặc định là 0.0
            min: 0,  // Đảm bảo giá trị không nhỏ hơn 0
            max: 100, // Đảm bảo giá trị không lớn hơn 100
        }
    }
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
