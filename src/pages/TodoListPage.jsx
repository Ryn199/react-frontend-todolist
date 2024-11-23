import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoLists } from "../store/slices/todoListSlice";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TodoListPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { todoLists, status, error } = useSelector((state) => state.todoLists);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddTodoListModal, setShowAddTodolist] = useState(false);
  const [newTodo, setNewTodo] = useState({ name: "", description: "" });

  const [editTodo, setEditTodo] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "incomplete",
    start_time: "",
    end_time: "",
    todoListId: null,
  });
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "",
    todo_list_id: "",
  });
  // Untuk membuka modal dan mengisi data task
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setUpdatedTask({
      title: task.title,
      description: task.description,
      start_time: task.start_time,
      end_time: task.end_time,
      status: task.status,
      todo_list_id: task.todo_list_id,
    });
    setShowEditModal(true); // Show the Edit Modal
  };

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const navigate = useNavigate();
  const { todoListId } = useParams();

  useEffect(() => {
    if (projectId && token) {
      dispatch(fetchTodoLists({ projectId, token }));
    }
  }, [dispatch, projectId, token]);

  const handleAddTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.status ||
      !newTask.start_time ||
      !newTask.end_time ||
      !newTask.todoListId
    ) {
      console.log(newTask);
      alert("All fields must be filled!");
      return;
    }

    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${newTask.todoListId}/tasks`,
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
      dispatch(fetchTodoLists({ projectId, token }));
      setShowAddTaskModal(false);
    } else {
      console.error("Failed to add task");
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteTask = async (taskId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (isConfirmed) {
      const response = await fetch(
        `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${newTask.todoListId}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(fetchTodoLists({ projectId, token }));
      } else {
        console.error("Failed to delete task");
      }
    }
  };

  const handleEditTodoList = async () => {
    if (!editTodo.name || !editTodo.description) return;

    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${editTodo.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editTodo),
      }
    );

    if (response.ok) {
      dispatch(fetchTodoLists({ projectId, token }));
      setIsEditing(false);
    } else {
      console.error("Gagal mengedit Todo List");
    }
  };

  const handleAddTodoList = async () => {
    if (!newTodo.name || !newTodo.description) return;

    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      }
    );

    if (response.ok) {
      dispatch(fetchTodoLists({ projectId, token }));
      setShowAddTodolist(false);
      setNewTodo({ name: "", description: "" }); // Reset state
    } else {
      console.error("Gagal menambah Todo List");
    }
  };

  const handleEditTaskSave = async () => {
    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${updatedTask.todo_list_id}/tasks/${selectedTask.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      }
    );

    if (response.ok) {
      // Memperbarui daftar todoLists setelah berhasil
      dispatch(fetchTodoLists({ projectId, token }));
      setShowEditModal(false); // Tutup modal
    } else {
      console.error("Failed to update task");
    }
  };

  const handleDeleteTodoList = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      dispatch(fetchTodoLists({ projectId, token }));
    } else {
      console.error("Gagal menghapus Todo List");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6">
            <a href="/projects" className="hover:text-blue-600">
              Assigned Projects
            </a>{" "}
            <span>&gt;</span> Todo Lists
          </h2>

          {/* Button to open modal */}
          <button
            onClick={() => setShowAddTodolist(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md mb-6 hover:bg-blue-700"
          >
            Add Todo List
          </button>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md mb-6 hover:bg-blue-700 ml-4"
          >
            Add Task
          </button>

          {status === "loading" && <p>Loading todo lists...</p>}
          {status === "failed" && (
            <p className="text-red-600">Error: {error}</p>
          )}
          {status === "succeeded" && todoLists.length === 0 && (
            <p>No todo lists found for this project.</p>
          )}

          {status === "succeeded" && todoLists.length > 0 && (
            <div className="space-y-6">
              {todoLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-white shadow-lg rounded-lg p-6 relative"
                >
                  {/* Kebab Menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleDropdown(list.id)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v.01M12 12v.01M12 18v.01"
                        />
                      </svg>
                    </button>

                    {dropdownOpen[list.id] && (
                      <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-lg text-gray-700 z-10">
                        <button
                          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            setEditTodo(list);
                            setIsEditing(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleDeleteTodoList(list.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold">{list.name}</h3>
                  <p className="text-gray-600 mt-2">{list.description}</p>

                  <div className="mt-4">
                    {list.tasks && list.tasks.length > 0 ? (
                      list.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-md mt-2 ${
                            task.status === "completed"
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-gray-700">{task.description}</p>
                          <p
                            className={`text-sm ${
                              task.status === "completed"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            <span className="font-semibold text-gray-600">
                              Status:{" "}
                            </span>
                            {task.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due Date:{" "}
                            {new Date(task.end_time).toLocaleDateString()}
                          </p>

                          {/* Edit and Delete buttons */}
                          <div className="mt-4 flex space-x-4">
                            <button
                              onClick={() => handleEditClick(task)}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            >
                              Change
                            </button>

                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No tasks found.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Edit Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTaskSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  value={updatedTask.title}
                  onChange={(e) =>
                    setUpdatedTask({ ...updatedTask, title: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <input
                  type="text"
                  value={updatedTask.description}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  type="datetime-local"
                  value={updatedTask.start_time}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      start_time: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  type="datetime-local"
                  value={updatedTask.end_time}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      end_time: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={updatedTask.status}
                  onChange={(e) =>
                    setUpdatedTask({ ...updatedTask, status: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Task</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Task Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTask.status} // Mengikat nilai select ke status yang ada pada state
                onChange={(e) => {
                  setNewTask({ ...newTask, status: e.target.value }); // Memperbarui state dengan nilai yang dipilih
                }}
              >
                <option value="incomplete">Incomplete</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="overdue">Overdue</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) =>
                  setNewTask({ ...newTask, start_time: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) =>
                  setNewTask({ ...newTask, end_time: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Todo List
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTask.todoListId || ""} // Pastikan state todoListId terikat dengan benar
                onChange={
                  (e) => setNewTask({ ...newTask, todoListId: e.target.value }) // Update todoListId
                }
              >
                <option value="">Pilih</option> {/* Opsi default "Pilih" */}
                {todoLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="ml-4 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add todolist modal */}
      {showAddTodoListModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Add Todo List
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTodoList(); // Panggil fungsi untuk menambah todo list
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  value={newTodo.name}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, name: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTodolist(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit todolist Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Todo List</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editTodo.name}
                onChange={(e) =>
                  setEditTodo({ ...editTodo, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editTodo.description}
                onChange={(e) =>
                  setEditTodo({ ...editTodo, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTodoList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TodoListPage;
