const mongoose = require('mongoose');

const KanbanBoardSchema = new mongoose.Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        name: {
            type: String,
            required: true,
        },
        content: {
            type: mongoose.Schema.Types.Mixed, // Để lưu trữ nội dung JSON linh hoạt
            required: true, // Có thể không bắt buộc nếu bạn không muốn yêu cầu nội dung
        },
    }
);

const KanbanBoard = mongoose.model('KanbanBoard', KanbanBoardSchema); // Sửa lại tên model để không bị trùng lặp

module.exports = KanbanBoard;
