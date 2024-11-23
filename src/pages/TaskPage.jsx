import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const TaskPage = () => {
  const { projectId, todoListId } = useParams(); // Ambil projectId dan todoListId dari URL params
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "in_progress", // default status
    start_time: "",
    end_time: "",
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const baseUrl = "https://todolist-api.ridhoyudiana.my.id"; // Ganti dengan base URL yang sesuai

  // Ambil tasks berdasarkan projectId dan todoListId
  useEffect(() => {
    if (projectId && todoListId && token) {
      const fetchTasks = async () => {
        try {
          const response = await fetch(
            `${baseUrl}/api/projects/${projectId}/todoLists/${todoListId}/tasks`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setTasks(data);
            setStatus("success");
          } else {
            throw new Error("Failed to fetch tasks");
          }
        } catch (error) {
          setError(error.message);
          setStatus("error");
        }
      };

      fetchTasks();
    }
  }, [projectId, todoListId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${baseUrl}/api/projects/${projectId}/todoLists/${todoListId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        // After adding, refresh the task list
        const addedTask = await response.json();
        setTasks((prev) => [...prev, addedTask]);
        setNewTask({
          title: "",
          description: "",
          status: "in_progress",
          start_time: "",
          end_time: "",
        });
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  if (status === "loading") {
    return <div>Loading tasks...</div>;
  }

  if (status === "error") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Tasks for Project {projectId} - Todo List {todoListId}
          </h1>

          {/* Daftar Tasks */}
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="p-4 bg-white shadow-md rounded-lg">
                  <h3 className="text-lg font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">Status: {task.status}</p>
                  <p className="text-sm text-gray-500">
                    Start Time: {task.start_time} - End Time: {task.end_time}
                  </p>
                </div>
              ))
            ) : (
              <div>No tasks found for this todo list.</div>
            )}
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleSubmit} className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-bold mb-4">Add a New Task</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
                <option value="cancelled">Cancelled</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={newTask.start_time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={newTask.end_time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded"
            >
              Add Task
            </button>
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TaskPage;
