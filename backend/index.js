const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute");
const connectDB = require("./config/db");
dotenv.config();

connectDB();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
app.use(cookieParser());
app.use(express.json());


app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/projects", projectRoute);

app.listen(8000, () => {
  console.log("Server is running");
});
