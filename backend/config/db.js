const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true, // Sử dụng trình phân tích cú pháp mới
            useUnifiedTopology: true, // Cải thiện khả năng kết nối
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Thoát ứng dụng khi không thể kết nối
    }
};

module.exports = connectDB;
