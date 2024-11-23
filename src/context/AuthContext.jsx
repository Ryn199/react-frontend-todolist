import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Tidak perlu lagi mengambil data user dari API setelah login, cukup simpan data dari login
  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user')); // Cek apakah data user ada di localStorage
      if (storedUser) {
        setUser(storedUser); // Set user dari localStorage jika ada
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://todolist-api.ridhoyudiana.my.id/api/login', { email, password });
      const { username, email: userEmail, token: userToken } = response.data.data;

      // Update user state setelah login berhasil
      setUser({ username, email: userEmail });
      setToken(userToken);
      localStorage.setItem('token', userToken); // Simpan token di localStorage
      localStorage.setItem('user', JSON.stringify({ username, email: userEmail })); // Simpan data user di localStorage
      localStorage.setItem('user_id', response.data.data.user_id); // Menyimpan user_id 

    } catch (error) {
      throw error; // Menangani error pada LoginPage
    }
  };

  const logout = async () => {
    try {
      // Mengirim permintaan POST untuk logout dan menghapus session di server
      await axios.post(
        'https://todolist-api.ridhoyudiana.my.id/api/logout', 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Menyertakan token pada header Authorization
          },
        }
      );
  
      // Menghapus user dan token dari state dan localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');  // Menghapus token dari localStorage
      localStorage.removeItem('user');   // Menghapus data user dari localStorage
    } catch (error) {
      console.error("Error during logout:", error);
      // Anda bisa menangani error jika terjadi masalah saat logout dari server
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
