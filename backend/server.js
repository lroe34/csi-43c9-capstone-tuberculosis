const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const usersRoute = require("./routes/users");

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:3000", process.env.NEXT_PUBLIC_API_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", usersRoute);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
