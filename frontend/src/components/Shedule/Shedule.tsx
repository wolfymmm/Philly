import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Shedule.scss';

interface ClassItem {
  subject: string;
  startTime: string;
  endTime: string;
  teacher: string;
  type: string;
}

interface ScheduleDoc {
  dayOfWeek: string;  
  classes: ClassItem[];
  date: string;
  weekNumber: number;
  isHoliday: boolean;
}

function Shedule() {
  const [weekType, setWeekType] = useState<number>(1); 
  const [scheduleData, setScheduleData] = useState<Record<string, ClassItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const weekParam = weekType === 1 ? 'odd' : 'even';

        const res = await axios.get<ScheduleDoc[]>(
          `http://localhost:5000/api/schedules/all?week=${weekParam}`
        );

        const grouped: Record<string, ClassItem[]> = {};

        res.data.forEach(doc => {
          const day = doc.dayOfWeek.toLowerCase();
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(...doc.classes);
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error(err);
        setError('Failed to load schedule');
        setScheduleData({});
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [weekType]);

  const sortClassesByTime = (classes: ClassItem[]) => {
    return [...classes].sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) {
    return (
      <div className="schedule-container">
        <div className="loading">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <h3>Schedule</h3>

      <div className="week-toggle">
        <button
          className={weekType === 1 ? 'active' : ''}
          onClick={() => setWeekType(1)}
        >
          1st week
        </button>
        <button
          className={weekType === 2 ? 'active' : ''}
          onClick={() => setWeekType(2)}
        >
          2nd week
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="schedule-grid">
        {Object.keys(scheduleData).map(day => {
          const classesForDay = scheduleData[day] || [];
          const sortedClasses = sortClassesByTime(classesForDay);

          return (
            <div key={day} className="day-column">
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

              {sortedClasses.length > 0 ? (
                sortedClasses.map((cls, index) => (
                  <div key={index} className="class-card horizontal">
                    <div className="time-block">
                      {cls.startTime} - {cls.endTime}
                    </div>
                    <div className="info-block">
                      <p className="subject"><strong>{cls.subject}</strong></p>
                      <p className="teacher">{cls.teacher}</p>
                      <p className="type">
                        <span className={`type-badge ${cls.type.toLowerCase()}`}>
                          {cls.type}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-classes">No classes</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Shedule;
