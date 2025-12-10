import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Shedule.scss';

// === TYPES ===
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

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const EMPTY_CLASS: ClassItem = {
  subject: '',
  startTime: '08:30',
  endTime: '10:05',
  teacher: '',
  type: 'Lecture'
};

function Shedule() {
  const [weekType, setWeekType] = useState<number>(1);
  const [scheduleData, setScheduleData] = useState<Record<string, ClassItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editBuffer, setEditBuffer] = useState<Record<string, ClassItem[]>>({});

  // Отримання заголовків з токеном
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // ---------------------- LOAD SCHEDULE ---------------------------
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const weekParam = weekType === 1 ? "odd" : "even";

        // 🔥 Правильний URL (schedules)
        const res = await axios.get<ScheduleDoc[]>(
          `http://localhost:5000/api/schedule/all?week=${weekParam}`,
          getAuthHeaders()
        );

        const grouped: Record<string, ClassItem[]> = {};
        
        // Ініціалізуємо всі дні
        DAYS_ORDER.forEach(day => {
          grouped[day] = [];
        });

        res.data.forEach((doc) => {
          const day = doc.dayOfWeek.toLowerCase();
          if (grouped[day]) {
            grouped[day] = doc.classes;
          }
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule. Please login.");
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

  // ---------------------- EDITING LOGIC ---------------------------

  const handleAddClass = (day: string) => {
    setEditBuffer(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { ...EMPTY_CLASS }]
    }));
  };

  const handleDeleteClass = (day: string, index: number) => {
    setEditBuffer(prev => {
      const updatedClasses = [...prev[day]];
      updatedClasses.splice(index, 1);
      return {
        ...prev,
        [day]: updatedClasses
      };
    });
  };

  const handleChangeClass = (day: string, index: number, field: keyof ClassItem, value: string) => {
    setEditBuffer(prev => {
      const updatedClasses = [...prev[day]];
      updatedClasses[index] = { ...updatedClasses[index], [field]: value };
      return {
        ...prev,
        [day]: updatedClasses
      };
    });
  };

  // ---------------------- SAVE CHANGES (ВИПРАВЛЕНО) ---------------------------
  const handleSave = async () => {
    try {
      const weekParam = weekType === 1 ? "odd" : "even";

      // Проходимо по всіх днях і оновлюємо їх
      for (const day of DAYS_ORDER) {
        // Якщо є дані для редагування цього дня
        if (editBuffer[day]) {
           // 🔥 ВИПРАВЛЕНО:
           // 1. URL: /api/schedules/update-day (множина + update-day)
           // 2. Method: PUT (оновлення)
           // 3. Body: додали weekType, щоб бекенд знав який тиждень редагувати
           await axios.put(`http://localhost:5000/api/schedule/update-day`, {
            dayOfWeek: day,
            classes: editBuffer[day],
            weekType: weekParam 
          }, getAuthHeaders());
        }
      }
      
      // Оновлюємо локальний стан
      setScheduleData(editBuffer);
      setIsEditing(false);
      alert("Schedule saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save schedule. Check console for details.");
    }
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

      <div className="top-bar">
        <div className="week-toggle">
          <button
            className={weekType === 1 ? "active" : ""}
            onClick={() => setWeekType(1)}
          >
            1st week
          </button>

          <button
            className={weekType === 2 ? "active" : ""}
            onClick={() => setWeekType(2)}
          >
            2nd week
          </button>
        </div>

        <div className="edit-controls">
          {!isEditing ? (
            <button
              className="edit-btn"
              onClick={() => {
                setEditBuffer(JSON.parse(JSON.stringify(scheduleData)));
                setIsEditing(true);
              }}
            >
              Edit Schedule
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="schedule-grid">
        {DAYS_ORDER.map((day) => {
          const classesForDay = isEditing
            ? editBuffer[day] || []
            : scheduleData[day] || [];

          const displayClasses = isEditing ? classesForDay : sortClassesByTime(classesForDay);

          return (
            <div key={day} className="day-column">
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

              {displayClasses.length > 0 ? (
                displayClasses.map((cls, index) => (
                  <div key={index} className="class-card horizontal">
                    {!isEditing ? (
                      <>
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
                      </>
                    ) : (
                      <div className="edit-card-content">
                        <div className="edit-header">
                            <span className="class-num">#{index + 1}</span>
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteClass(day, index)}
                            >
                                🗑️
                            </button>
                        </div>
                        
                        <label>Subject:</label>
                        <input
                          value={cls.subject}
                          onChange={(e) => handleChangeClass(day, index, 'subject', e.target.value)}
                          placeholder="Subject Name"
                        />

                        <div className="time-row">
                            <div>
                                <label>Start:</label>
                                <input
                                value={cls.startTime}
                                type="time"
                                onChange={(e) => handleChangeClass(day, index, 'startTime', e.target.value)}
                                />
                            </div>
                            <div>
                                <label>End:</label>
                                <input
                                value={cls.endTime}
                                type="time"
                                onChange={(e) => handleChangeClass(day, index, 'endTime', e.target.value)}
                                />
                            </div>
                        </div>

                        <label>Teacher:</label>
                        <input
                          value={cls.teacher}
                          onChange={(e) => handleChangeClass(day, index, 'teacher', e.target.value)}
                        />

                        <label>Type:</label>
                        <select
                          value={cls.type}
                          onChange={(e) => handleChangeClass(day, index, 'type', e.target.value)}
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Practice">Practice</option>
                          <option value="Lab">Lab</option>
                          <option value="Exam">Exam</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-classes">No classes</p>
              )}

              {isEditing && (
                <button className="add-class-btn" onClick={() => handleAddClass(day)}>
                    + Add Class
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Shedule;