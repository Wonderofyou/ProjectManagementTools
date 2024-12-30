const mongoose = require('mongoose');
const { create } = require('./User');

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
            require: Date.now
        },
        end_date: {
            type: Date,
            default: Date.now + 10
        },
        status: {
            type: String,
            default: "Start"
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
        }
    }
);

const UsersModel = mongoose.model('User', UserSchema); // Creating the model from the schema

module.exports = UsersModel;
