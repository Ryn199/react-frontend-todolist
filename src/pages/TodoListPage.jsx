import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoLists } from "../store/slices/todoListSlice";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const TodoListPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  // Ambil token dari localStorage
  const token = localStorage.getItem("token");

  // Ambil data dan status dari Redux store
  const { todoLists, status, error } = useSelector((state) => state.todoLists);

  // Fetch data todo list berdasarkan projectId dan token
  useEffect(() => {
    if (projectId && token) {
      dispatch(fetchTodoLists({ projectId, token })); // Kirim token bersama projectId
    }
  }, [dispatch, projectId, token]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          {/* ml-64 untuk memberikan ruang agar konten tidak tertutup Sidebar */}
          <div className="flex-1 p-6">
            <h2 className="text-3xl font-semibold mb-6">Todo Lists</h2>

            {/* Tampilkan status */}
            {status === "loading" && <p>Loading todo lists...</p>}
            {status === "failed" && <p>Error: {error}</p>}

            {/* Tampilkan todo lists */}
            <div className="space-y-6">
              {todoLists.length === 0 ? (
                <p>No todo lists found for this project.</p>
              ) : (
                todoLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-white shadow-lg rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold">{list.name}</h3>
                    <p className="text-gray-600">{list.description}</p>
                    <div className="mt-4">
                      {list.tasks.map((task) => (
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
                            {task.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TodoListPage;
