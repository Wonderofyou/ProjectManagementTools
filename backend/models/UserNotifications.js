const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserNotificationSchema = new Schema({
    user_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'user', required: true
    }, // Người nhận thông báo
    notification_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'Notification', required: true
    }, // ID thông báo
    read:
    {
        type: Boolean,
        default: false
    }, // Trạng thái đã đọc (mặc định là chưa đọc)
});

const UserNotification = mongoose.model('UserNotification', UserNotificationSchema);

module.exports = UserNotification;
