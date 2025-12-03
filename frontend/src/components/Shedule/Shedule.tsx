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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editBuffer, setEditBuffer] = useState<Record<string, ClassItem[]>>({});

  // ---------------------- LOAD SCHEDULE ---------------------------
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const weekParam = weekType === 1 ? "odd" : "even";

        const res = await axios.get<ScheduleDoc[]>(
          `http://localhost:5000/api/schedules/all?week=${weekParam}`
        );

        const grouped: Record<string, ClassItem[]> = {};

        res.data.forEach((doc) => {
          const day = doc.dayOfWeek.toLowerCase();
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(...doc.classes);
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule");
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

  // ---------------------- SAVE CHANGES ---------------------------
  const handleSave = async () => {
    try {
      for (const day of Object.keys(editBuffer)) {
        await axios.put(`http://localhost:5000/api/schedules/update-day`, {
          dayOfWeek: day,
          classes: editBuffer[day],
          weekType: weekType === 1 ? "odd" : "even",
        });
      }

      setScheduleData(editBuffer);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save schedule");
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
        Edit
      </button>
    ) : (
      <>
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </>
    )}
  </div>

</div>


      {error && <div className="error-message">{error}</div>}

      {/* ----------------------------- MAIN GRID ----------------------------- */}
      <div className="schedule-grid">
        {Object.keys(scheduleData).map((day) => {
          const classesForDay = isEditing
            ? editBuffer[day] || []
            : scheduleData[day] || [];

          const sortedClasses = sortClassesByTime(classesForDay);

          return (
            <div key={day} className="day-column">
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

              {sortedClasses.length > 0 ? (
                sortedClasses.map((cls, index) => (
                  <div key={index} className="class-card horizontal">
                    {!isEditing ? (
                      <>
                        <div className="time-block">
                          {cls.startTime} - {cls.endTime}
                        </div>

                        <div className="info-block">
                          <p className="subject">
                            <strong>{cls.subject}</strong>
                          </p>
                          <p className="teacher">{cls.teacher}</p>
                          <p className="type">
                            <span
                              className={`type-badge ${cls.type.toLowerCase()}`}
                            >
                              {cls.type}
                            </span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* SUBJECT */}
                        <input
                          value={editBuffer[day][index].subject}
                          onChange={(e) => {
                            const updated = { ...editBuffer };
                            updated[day][index].subject = e.target.value;
                            setEditBuffer(updated);
                          }}
                        />

                        {/* START TIME */}
                        <input
                          value={editBuffer[day][index].startTime}
                          onChange={(e) => {
                            const updated = { ...editBuffer };
                            updated[day][index].startTime = e.target.value;
                            setEditBuffer(updated);
                          }}
                        />

                        {/* END TIME */}
                        <input
                          value={editBuffer[day][index].endTime}
                          onChange={(e) => {
                            const updated = { ...editBuffer };
                            updated[day][index].endTime = e.target.value;
                            setEditBuffer(updated);
                          }}
                        />

                        {/* TEACHER */}
                        <input
                          value={editBuffer[day][index].teacher}
                          onChange={(e) => {
                            const updated = { ...editBuffer };
                            updated[day][index].teacher = e.target.value;
                            setEditBuffer(updated);
                          }}
                        />

                        {/* TYPE */}
                        <select
                          value={editBuffer[day][index].type}
                          onChange={(e) => {
                            const updated = { ...editBuffer };
                            updated[day][index].type = e.target.value;
                            setEditBuffer(updated);
                          }}
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Practice">Practice</option>
                        </select>
                      </>
                    )}
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
