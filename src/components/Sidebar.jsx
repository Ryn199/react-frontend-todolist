import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaCog, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'; // Menambahkan ikon logout
import { useAuth } from '../context/AuthContext'; // Impor useAuth untuk mendapatkan context

const Sidebar = () => {
  const location = useLocation(); // Mengambil informasi lokasi saat ini
  const { logout, loading } = useAuth(); // Ambil logout dan loading dari AuthContext

  // Fungsi untuk memeriksa apakah link sedang aktif
  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-gray-800 hover:text-white hover:bg-blue-600';

  // Fungsi untuk menangani logout dengan konfirmasi
  const handleLogout = () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?'); // Menampilkan konfirmasi
    if (isConfirmed) {
      logout(); // Memanggil logout dari context
    } else {
      console.log('Logout cancelled.');
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white text-gray-800 fixed top-0 left-0 h-full p-6 shadow-md">
      {/* Sidebar Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-blue-700">Todo List</h2>
        <p className="text-sm text-gray-600">To do List & management</p>
      </div>

      {/* Main Menu */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-500">Main Menu</h4>
        <ul className="space-y-2">
          <li>
            <Link className={`flex items-center py-2 px-4 rounded ${isActive('/dashboard')}`} to="/dashboard">
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link className={`flex items-center py-2 px-4 rounded ${isActive('/projects')}`} to="/projects">
              <FaProjectDiagram className="mr-3" />
              Projects
            </Link>
          </li>
          <li>
            <Link className={`flex items-center py-2 px-4 rounded ${isActive('/task-calendar')}`} to="/task-calendar">
              <FaCalendarAlt className="mr-3" />
              Task Calendar
            </Link>
          </li>
        </ul>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Settings Menu */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-500">Settings</h4>
        <ul className="space-y-2">
          <li>
            <Link className={`flex items-center py-2 px-4 rounded ${isActive('/settings')}`} to="/settings">
              <FaCog className="mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout} // Memanggil fungsi handleLogout saat tombol di klik
          className="flex items-center py-2 px-4 rounded text-gray-800 hover:text-white hover:bg-blue-600 w-full mt-4"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <span className="mr-3">Logging out...</span>
              <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <FaSignOutAlt className="mr-3" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
