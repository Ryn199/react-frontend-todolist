import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaCog, FaCalendarAlt } from 'react-icons/fa'; // Tambahkan ikon kalender

const Sidebar = () => {
  const location = useLocation(); // Mengambil informasi lokasi saat ini

  // Fungsi untuk memeriksa apakah link sedang aktif
  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-gray-800 hover:text-white hover:bg-blue-600';

  return (
    <div className="flex flex-col w-64 bg-white text-gray-800 fixed top-0 left-0 h-full p-6 shadow-md">
      {/* Sidebar Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-blue-700">R~List</h2>
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
    </div>
  );
};

export default Sidebar;
