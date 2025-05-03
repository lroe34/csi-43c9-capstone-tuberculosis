const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const usersRoute = require("./routes/users");
const uploadRoute = require("./routes/upload");
const metricsRoute = require("./routes/metrics");
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // pls cooperate wth me :(
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.options("*", cors());

app.use("/api/users", usersRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/metrics", metricsRoute);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
