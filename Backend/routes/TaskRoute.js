const express = require("express");

const router = express.Router();

const AuthMiddleware = require("../Middlewares/AuthUser");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
} = require("../controllers/TaskController");

// All task routes are protected
router.use(AuthMiddleware);

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Delete all completed tasks
router.delete("/completed", deleteCompletedTasks);

// Get single task
router.get("/:taskId", getTask);

// Update task
router.put("/:taskId", updateTask);

// Toggle completed
router.patch("/:taskId/toggle", toggleTask);

// Delete single task
router.delete("/:taskId", deleteTask);

module.exports = router;
