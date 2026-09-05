import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const handleTaskChange = (e) => {
    const { name, value } = e.target;

    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        toast.success("Task added successfully");
        setTasks([...tasks, data.task]);
        setTaskData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        setTasks(tasks.map((task) => (task._id === taskId ? data.task : task)));
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setTasks(tasks.filter((task) => task._id !== taskId));

        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };
  const deleteCompletedTasks = async () => {
    const completedCount = tasks.filter((task) => task.completed).length;
    if (completedCount === 0) {
      toast.info("No completed tasks to delete");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all completed tasks?",
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/tasks/completed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        setTasks(tasks.filter((task) => !task.completed));
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete completed tasks",
      );
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${editingTaskId}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (data.success) {
        setTasks(
          tasks.map((task) => (task._id === editingTaskId ? data.task : task)),
        );
        toast.success("Task updated successfully");
        setTaskData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
        });
        setEditingTaskId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const startEditTask = (task) => {
    setTaskData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
    });

    setEditingTaskId(task._id);
    setShowForm(true);
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/`,
          {},
          { withCredentials: true },
        );
        if (!data.status) {
          navigate("/login");
          return;
        }
        setUsername(data.user);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    verifyUser();
  }, [navigate]);

  // Get tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (data.success) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setError(error.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [navigate]);

  const Logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true },
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sort === "Oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sort === "Due Date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sort === "Priority") {
        const priorityValue = {
          High: 1,
          Medium: 2,
          Low: 3,
        };
        return priorityValue[a.priority] - priorityValue[b.priority];
      }
      return 0;
    });

  return (
    <>
      <div className="dashboard">
        <header className="dashboard_header">
          <div>
            <h1>Task Manager</h1>
            <p>Welcome, {username}</p>
          </div>

          <button onClick={Logout}>Logout</button>
        </header>

        <main className="dashboard_content">
          <div className="dashboard_top">
            <h2>My Tasks</h2>

            <div className="task_controls">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Due Date">Due Date</option>
                <option value="Priority">Priority</option>
              </select>
            </div>

            <div className="task_top_buttons">
              <button onClick={() => setShowForm(!showForm)}>+ Add Task</button>

              <button
                className="delete_completed_btn"
                onClick={deleteCompletedTasks}
              >
                Delete Completed
              </button>
            </div>
          </div>
          {showForm && (
            <form
              className="task_form"
              onSubmit={editingTaskId ? handleEditTask : handleAddTask}
            >
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={taskData.title}
                onChange={handleTaskChange}
              />

              <textarea
                name="description"
                placeholder="Task description"
                value={taskData.description}
                onChange={handleTaskChange}
              />

              <select
                name="priority"
                value={taskData.priority}
                onChange={handleTaskChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleTaskChange}
              />

              <button type="submit">
                {editingTaskId ? "Update Task" : "Add Task"}
              </button>

              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          )}

          <div className="task_stats">
            <div>
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
            <div>
              <h3>{tasks.filter((task) => !task.completed).length}</h3>
              <p>Pending</p>
            </div>
            <div>
              <h3>{tasks.filter((task) => task.completed).length}</h3>
              <p>Completed</p>
            </div>
            <div>
              <h3>{tasks.filter((task) => isOverdue(task)).length}</h3>
              <p>Overdue</p>
            </div>
          </div>

          <div className="task_list">
            {loading ? (
              <p className="task_message">Loading tasks...</p>
            ) : error ? (
              <p className="task_message">{error}</p>
            ) : filteredTasks.length === 0 ? (
              <p className="task_message">
                {search || filter !== "All"
                  ? "No tasks found."
                  : "No tasks yet."}
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div className="task_card" key={task._id}>
                  <h3 className={task.completed ? "completed_task" : ""}>
                    {task.title}
                  </h3>

                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>
                    Created:{" "}
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                  <p>
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-GB")
                      : "No due date"}
                  </p>
                  <p>Status: {task.completed ? "Completed" : "Pending"}</p>

                  {isOverdue(task) && <p className="overdue_text">Overdue</p>}

                  <div className="task_actions">
                    <button onClick={() => toggleTask(task._id)}>
                      {task.completed ? "Mark Pending" : "Complete"}
                    </button>
                    <button onClick={() => startEditTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
