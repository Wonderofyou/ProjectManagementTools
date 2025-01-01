const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvitationSchema = new Schema(
    {
        project_id:
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        }, // Dự án liên quan đến lời mời
        inviter_id:
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, // Người gửi lời mời
        invitee_id:
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, // Người nhận lời mời
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending'
        }, // Trạng thái lời mời
        created_at:
        {
            type: Date,
            default: Date.now
        }, // Thời gian tạo lời mời
        updated_at:
        {
            type: Date,
            default: Date.now
        }, // Thời gian cập nhật trạng thái
    });

const Invitation = mongoose.model('Invitation', InvitationSchema);

module.exports = Invitation;
