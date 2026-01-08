import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all"); // 🔹 FILTER STATE

  // GET tasks
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // ADD task
  const addTask = () => {
    if (title.trim() === "") return;

    fetch("http://localhost:5000/api/tasks", {
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

  // COMPLETE task
  const completeTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
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

  // DELETE task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((t) => t._id !== id));
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
              <button onClick={() => completeTask(task._id)}>
                Complete
              </button>{" "}
              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
