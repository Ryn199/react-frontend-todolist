// src/pages/DashboardPage.js
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Impor useAuth untuk mengambil data user
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardPage = () => {
  const { user, token, login, logout } = useAuth();  // Ambil user dan token dari AuthContext

  // Cek apakah token ada, jika tidak, arahkan untuk login
  useEffect(() => {
    if (!token) {
      // Arahkan pengguna ke halaman login jika tidak ada token
      // Di sini bisa diarahkan ke halaman login jika token tidak ada
      console.log('User is not logged in!');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          <div className="flex-1 p-6">
            {/* Tampilkan informasi pengguna */}
            {user ? (
              <>
                <h2 className="text-3xl font-semibold mb-4">
                  Welcome, {user.username}
                </h2>
                <p className="text-lg text-gray-600">Email: {user.email}</p>
              </>
            ) : (
              <p className="text-lg text-gray-600">Loading user data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
