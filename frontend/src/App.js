import "./App.css";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // 🔹 GET tasks
  const fetchTasks = () => {
    fetch(`${API_URL}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 ADD task
  const addTask = () => {
    if (title.trim() === "") return;

    fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then(() => {
        setTitle("");
        fetchTasks(); // 🔹 re-fetch from DB
      });
  };

  // 🔹 COMPLETE task
  const completeTask = (task) => {
    fetch(`${API_URL}/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    }).then(() => fetchTasks());
  };

  // 🔹 DELETE task ✅ FIXED
  const deleteTask = (id) => {
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchTasks(); // 🔥 MongoDB se fresh data
      })
      .catch((err) => console.error(err));
  };

  // 🔹 EDIT
  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;

    fetch(`${API_URL}/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    }).then(() => {
      setEditingTask(null);
      fetchTasks();
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
              <button onClick={() => completeTask(task)}>Complete</button>{" "}
              <button onClick={() => openEdit(task)}>Edit</button>{" "}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
      </ul>

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
            <button onClick={() => setEditingTask(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
