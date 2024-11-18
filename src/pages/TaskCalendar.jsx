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
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'https://todolist-api.ridhoyudiana.my.id/api/projects/1/todoLists/1/tasks',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedTasks = response.data.map((task) => ({
          id: task.id,
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
        setEvents(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [token]);

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
              eventClick={(info) => {
                alert(
                  `Task: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`
                );
              }}
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
    </>
  );
};

export default TaskCalendar;
