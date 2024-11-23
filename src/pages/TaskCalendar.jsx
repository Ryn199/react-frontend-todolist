import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const TaskCalendar = () => {
  const [events, setEvents] = useState([]); // Untuk menampung events yang akan ditampilkan di kalender
  const [tasks, setTasks] = useState([]); // Untuk menyimpan semua task yang diambil dari API
  const [selectedTask, setSelectedTask] = useState(null); // Untuk menyimpan task yang dipilih
  const [showModal, setShowModal] = useState(false); // Untuk mengontrol apakah modal terbuka atau tidak
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Mengambil data dari API
        const response = await axios.get(
          'http://localhost:8000/api/projects/tasks/user/1', // API endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Menampilkan response untuk memverifikasi data yang diterima
        console.log('API Response:', response.data);

        // Memformat data yang diterima agar cocok dengan struktur FullCalendar
        const formattedTasks = response.data.map((task) => ({
          id: task.id,  // Pastikan ini sesuai dengan event.id
          title: task.title,
          start: task.start_time,
          end: task.end_time,
          color:
            task.status === 'completed'
              ? 'green'
              : task.status === 'overdue'
              ? 'red'
              : 'blue',
        }));

        // Menyimpan data events yang sudah diformat untuk ditampilkan di kalender
        setEvents(formattedTasks);
        setTasks(response.data);  // Menyimpan semua task untuk akses detail
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleEventClick = (info) => {
    // Menampilkan log untuk mengetahui event yang diklik
    console.log('Event clicked:', info);

    // Menemukan task berdasarkan ID event yang diklik
    const clickedTask = tasks.find((task) => task.id === parseInt(info.event.id));

    // Menampilkan detail task yang dipilih dan membuka modal
    if (clickedTask) {
      console.log('Selected Task:', clickedTask);
      setSelectedTask(clickedTask);
      setShowModal(true); // Membuka modal
    } else {
      console.log('Task not found for event ID:', info.event.id);
    }
  };

  // Menutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null); // Reset selected task ketika modal ditutup
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 ml-64 overflow-y-auto">
            <h2 className="text-3xl font-semibold mb-4">Task Calendar</h2>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick} // Menangani klik event untuk menampilkan detail
              headerToolbar={{
                start: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
            />
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal untuk menampilkan detail task */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Task Details</h3>
            <p><strong>Title:</strong> {selectedTask.title}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Start Time:</strong> {selectedTask.start_time}</p>
            <p><strong>End Time:</strong> {selectedTask.end_time}</p>
            <div className="mt-4">
              
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCalendar;
