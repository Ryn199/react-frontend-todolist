import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addProject } from '../store/slices/projectsSlice'; // Import action addProject
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false); // State untuk loading modal

  const token = localStorage.getItem('token');
  const { projects, status, error } = useSelector((state) => state.projects);

  const handleClick = (projectId) => {
    navigate(`/todo-list/${projectId}`);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects(token));
    }
  }, [dispatch, token]);

  const handleAddProject = async () => {
    setIsAdding(true);
    try {
      await dispatch(addProject({ token, project: newProject })).unwrap();
      setModalOpen(false);
      setNewProject({ name: '', description: '' }); // Reset form
    } catch (err) {
      console.error('Failed to add project:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 ml-64 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-semibold">Projects</h2>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add Project
              </button>
            </div>

            {status === 'loading' && <p>Loading projects...</p>}
            {status === 'failed' && <p>Error: {error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  onClick={() => handleClick(project.id)}
                >
                  <img
                    src={project.image || '/default-image.jpg'}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-4 p-2 border rounded"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddProject}
                className={`px-4 py-2 rounded-md mr-2 ${
                  isAdding
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white'
                }`}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Save'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                disabled={isAdding}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPage;
