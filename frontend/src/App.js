import "./App.css";
import { useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔹 Edit states
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔹 Filter state
  const [filter, setFilter] = useState("all");

  // 🔹 GET tasks
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/tasks`)

      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 ADD task
  const addTask = () => {
    if (title.trim() === "") return;

    fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([newTask, ...tasks]);
        setTitle("");
      });
  };

  // 🔹 COMPLETE task (explicit value send)
  const completeTask = (task) => {
    fetch(`${API_URL}/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          )
        );
      });
  };

  // 🔹 DELETE task
  const deleteTask = (id) => {
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((t) => t._id !== id));
    });
  };

  // 🔹 OPEN EDIT MODAL
  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  // 🔹 SAVE EDIT (title update)
  const saveEdit = () => {
    if (!editTitle.trim()) return;

    fetch(`${API_URL}/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          )
        );
        setEditingTask(null);
      });
  };

  return (
    <div className="container">
      <h2>Student Task Manager</h2>

      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      {/* 🔹 FILTER BUTTONS */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul>
        {tasks
          .filter((task) => {
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
            return true;
          })
          .map((task) => (
            <li key={task._id}>
              {task.title} — {task.completed ? "✅" : "❌"}{" "}
              <button onClick={() => completeTask(task)}>
                Complete
              </button>{" "}
              <button onClick={() => openEdit(task)}>
                Edit
              </button>{" "}
              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>

      {/* 🔹 EDIT MODAL */}
      {editingTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <br />
            <button onClick={saveEdit}>Save</button>{" "}
            <button onClick={() => setEditingTask(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
