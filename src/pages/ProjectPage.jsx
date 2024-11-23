import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedProjectUsers, setSelectedProjectUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignErrorMessage, setAssignErrorMessage] = useState(null);


  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUserId) {
      console.error("User ID not found in localStorage.");
      setError("User ID is not available.");
      setLoading(false);
      return;
    }

    const fetchAssignedProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/projects/user/${loggedInUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projectsData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setProjects(projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedProjects();
  }, [token, loggedInUserId]);

  const handleClickProject = (projectId) => {
    navigate(`/todo-list/${projectId}`);
  };

  const handleAddProject = async () => {
    setIsAdding(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/projects",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((prevProjects) => [...prevProjects, response.data]);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
    } catch (err) {
      console.error("Failed to add project:", err);
      setError("Failed to add project. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewAssignedUsers = async (projectId) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/setting_user_project/${projectId}/assignUser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Tambahkan token jika diperlukan
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned users");
      }

      const data = await response.json();
      setAssignedUsers(data); // Set data yang didapat dari API ke state
      setShowModal(true); // Tampilkan modal
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  const handleDeleteProject = async (event, projectId) => {
    event.stopPropagation();

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setProjects(projects.filter((project) => project.id !== projectId));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleEditProjectSave = async () => {
    if (!selectedProject?.id) {
      console.error("Project ID is missing");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/projects/${selectedProject.id}`,
        selectedProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id ? response.data : project
        )
      );
      setIsEditModalOpen(false); // Tutup modal setelah berhasil
      setIsRefreshing(true); // Tampilkan indikator

      setTimeout(() => {
        setIsRefreshing(false); // Sembunyikan indikator
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("Failed to update project. Please try again.");
    }
  };
  

  const handleAssignUser = async () => {
    if (!selectedProject || !selectedUser) {
      console.error("Project or User not selected");
      return; // Jangan lanjutkan jika selectedProject atau selectedUser kosong
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/setting_user_project/${selectedProject.id}/assignUser/${selectedUser.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setIsAssignModalOpen(false);
        setIsRefreshing(true); // Tampilkan indikator loading
  
        setTimeout(() => {
          setIsRefreshing(false); // Sembunyikan indikator loading
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAssignErrorMessage("User sudah terdaftar di project."); // Pesan error untuk 409 Conflict
      } else {
        console.error("Failed to assign user:", err);
        setAssignErrorMessage("Failed to assign user. Please try again.");
      }
    }
  };
  

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/search/${searchEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Error searching for users:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 ml-64 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p className="text-3xl font-semibold">Loading Project list...</p>
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold">Assigned Projects</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add New Project
            </button>
          </div>
          {projects.length === 0 ? (
            <p>No projects assigned to you.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
  key={project.id}
  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
  onClick={() => handleClickProject(project.id)} // Menambahkan onClick untuk navigasi
>
  <img
    src={project.image || "/default-image.jpg"}
    alt={project.name}
    className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110"
  />
  <div className="p-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
      {project.name}
    </h2>
    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
      {project.description}
    </p>
    <div className="mt-2">
      <h3 className="font-semibold text-gray-800">Assigned Users:</h3>
      <div className="flex flex-wrap">
        {Array.isArray(project.assigned_users) &&
          project.assigned_users.slice(0, 3).map((user, index) => (
            <span
              key={index}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-800 mr-2 mb-2"
            >
              {user}
            </span>
          ))}
        {Array.isArray(project.assigned_users) && project.assigned_users.length > 3 && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Mencegah event bubble untuk navigasi
              handleViewAssignedUsers(project.assigned_users);
            }}
            className="text-blue-500 underline"
          >
            +{project.assigned_users.length - 3} more
          </button>
        )}
      </div>
    </div>
    <div className="flex justify-start mt-4">
      {/* Tombol Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Mencegah event bubble untuk navigasi
          setSelectedProject(project); // Pilih project yang akan diedit
          setIsEditModalOpen(true); // Buka modal
        }}
        className="bg-yellow-500 text-white rounded-full px-3 py-1 text-sm mr-2"
      >
        Edit
      </button>

      {/* Tombol Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Mencegah event bubble untuk navigasi
          handleDeleteProject(e, project.id);
        }}
        className="bg-red-500 text-white rounded-full px-3 py-1 text-sm mr-2"
      >
        Delete
      </button>

      {/* Tombol Assign User */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Mencegah event bubble untuk navigasi
          setSelectedProject(project);
          setIsAssignModalOpen(true);
        }}
        className="bg-green-500 text-white rounded-full px-3 py-1 text-sm"
      >
        Assign User
      </button>
    </div>
  </div>
</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal for adding project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
            <textarea
              placeholder="Project Description"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing project */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
              value={selectedProject?.name || ""}
              onChange={(e) =>
                setSelectedProject({ ...selectedProject, name: e.target.value })
              }
            />

            <textarea
              placeholder="Project Description"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
              value={selectedProject?.description}
              onChange={(e) =>
                setSelectedProject({
                  ...selectedProject,
                  description: e.target.value,
                })
              }
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProjectSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for assigning user */}
      {isAssignModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-96">
      <h3 className="text-xl font-semibold mb-4">Assign User</h3>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        placeholder="Search by email"
      />
      <button
        onClick={handleSearchUser}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>

      <div className="mt-4">
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className={`flex justify-between items-center mb-2 px-3 py-2 rounded-md ${
                  selectedUser?.id === user.id
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-white border border-gray-300"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <span>{user.email}</span>
                {selectedUser?.id === user.id && (
                  <span className="text-green-600 text-sm font-semibold">
                    Selected
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
        <button
          onClick={handleAssignUser}
          className={`mt-4 w-full ${
            selectedUser
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white text-sm px-4 py-2 rounded-md`}
          disabled={!selectedUser}
        >
          Assign
        </button>
        <button
          onClick={() => setIsAssignModalOpen(false)}
          className="mt-4 w-full bg-red-300 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>

      {/* Menampilkan pesan error jika ada */}
      {assignErrorMessage && (
        <p className="text-red-500 text-center mt-4">{assignErrorMessage}</p>
      )}

      {/* Tambahkan indikator loading */}
      {isRefreshing && (
        <p className="text-blue-500 text-center mt-4">Loading...</p>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ProjectPage;
