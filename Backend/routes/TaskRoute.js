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

router.use(AuthMiddleware);
router.post("/", createTask);
router.get("/", getTasks);
router.delete("/completed", deleteCompletedTasks);
router.get("/:taskId", getTask);
router.put("/:taskId", updateTask);
router.patch("/:taskId/toggle", toggleTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
