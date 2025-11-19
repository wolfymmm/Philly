import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Shedule.scss';

interface ClassItem {
  subject: string;
  startTime: string;
  endTime: string;
  teacher: string;
  room: string;
  type: string;
}

interface ScheduleDoc {
  dayOfWeek: string;
  classes: ClassItem[];
  date: string;
  weekNumber: number;
  isHoliday: boolean;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function Shedule() {
  const [weekType, setWeekType] = useState<number>(1); // 1 = непарний, 2 = парний
  const [scheduleData, setScheduleData] = useState<Record<string, ClassItem[]>>({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get<ScheduleDoc[]>(`http://localhost:5000/api/schedules/all?week=${weekType}`);
        
        // Групуємо всі класи по днях тижня
        const grouped: Record<string, ClassItem[]> = {};
        for (const day of daysOfWeek) grouped[day] = [];

        res.data.forEach(doc => {
          const day = doc.dayOfWeek.toLowerCase();
          if (!grouped[day]) grouped[day] = [];
          grouped[day] = grouped[day].concat(doc.classes);
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error(err);
        setScheduleData({});
      }
    };

    fetchSchedule();
  }, [weekType]);

  return (
    <div className="schedule-container">
      <h3>Розклад занять</h3>
      <div className="week-toggle">
        <button
          className={weekType === 1 ? 'active' : ''}
          onClick={() => setWeekType(1)}
        >
          Week 1
        </button>
        <button
          className={weekType === 2 ? 'active' : ''}
          onClick={() => setWeekType(2)}
        >
          Week 2
        </button>
      </div>

      <div className="schedule-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {scheduleData[day] && scheduleData[day].length > 0 ? (
              scheduleData[day].map((cls, index) => (
                <div key={index} className="class-card">
                  <p><strong>{cls.subject}</strong></p>
                  <p>{cls.startTime} - {cls.endTime}</p>
                  <p>{cls.room}</p>
                  <p>{cls.teacher}</p>
                </div>
              ))
            ) : (
              <p>No classes</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shedule;
