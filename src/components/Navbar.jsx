import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Pastikan sudah mengimpor useAuth

const Navbar = () => {
  const { logout } = useAuth(); // Mengambil fungsi logout dari AuthContext

  const handleLogout = () => {
    logout(); // Memanggil fungsi logout dari context
  };

  return (
    <nav className="bg-white text-gray-800 p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo / Link Dashboard */}
        <Link className="text-2xl font-semibold" to="/dashboard">
          Dashboard
        </Link>

        {/* Tombol untuk Mobile Menu */}
        <button
          className="lg:hidden text-gray-800 focus:outline-none"
          type="button"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">☰</span>
        </button>

        {/* Menu Navigasi */}
        <div className="hidden lg:flex space-x-6">
          <ul className="flex space-x-6">
            {/* Tombol Logout */}
            <li>
              <button
                className="text-white-800 hover:bg-blue-800 border border-gray-400 rounded px-4 py-2 bg-blue-600 text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tombol Menu untuk Mobile View */}
      <div className="lg:hidden bg-white p-4">
        <ul className="space-y-4">
          <li>
            <button
              className="text-gray-800 hover:text-gray-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
