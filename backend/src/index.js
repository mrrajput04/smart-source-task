const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const routes = require("./routes")
const connectDB = require('./config/db');
const path = require("path")
const cors = require("cors")


const app = express();
connectDB();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://smart-task-frontend-tp1d.vercel.app/'],
    credentials: true
  }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", routes.userRoutes)
app.use("/api/videos", routes.videoRoutes)

const PORT = process.env.PORT || 8080


app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})