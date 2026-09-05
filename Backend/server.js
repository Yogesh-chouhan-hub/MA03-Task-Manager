require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const taskRoute = require("./routes/TaskRoute");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ma03-task-manager.netlify.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/tasks", taskRoute);
app.use("/", authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
