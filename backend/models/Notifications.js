const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    created_by:
    {
        type: Schema.Types.ObjectId,
        ref: 'user', required: true
    }, // Người tạo thông báo
    title:
    {
        type: String,
        required: true
    }, // Tiêu đề thông báo
    content:
    {
        type: String,
        required: true
    }, // Nội dung chi tiết
    type:
    {
        type: Number,
        required: true, enum: [0, 1, 2]
    }, // Loại thông báo (0: hệ thống, 1: người dùng, 2: khác)
    created_at:
    {
        type: Date,
        default: Date.now
    }, // Thời gian tạo thông báo
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
