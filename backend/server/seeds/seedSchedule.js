import mongoose from 'mongoose';
import Schedule from '../models/Schedule.js'; 
import dotenv from 'dotenv';

dotenv.config();

// ID користувача (Яна Марусіна)
const userId = '693893a31b6ea7e676719b31';

const dayNames = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const scheduleTemplates = {
  odd: {
    monday: [
      { subject: 'DevOps technologies', startTime: '08:30', endTime: '10:05', teacher: 'Vadim Kolumbet', type: 'Practice' },
      { subject: 'English', startTime: '12:20', endTime: '13:55', teacher: 'Kostyantyn Lisetskyi', type: 'Practice' }
    ],
    tuesday: [
      { subject: 'Basics of Big Data Analytics', startTime: '08:30', endTime: '10:05', teacher: 'Valeriy Shvaiko', type: 'Lecture' },
      { subject: 'Fundamentals of translator development', startTime: '12:20', endTime: '13:55', teacher: 'Yurii Statyvka', type: 'Lecture' }
    ],
    wednesday: [
      { subject: 'Fundamentals of translator development', startTime: '10:25', endTime: '12:00', teacher: 'Yurii Statyvka', type: 'Practice' },
      { subject: 'Basics of Big Data Analytics', startTime: '12:20', endTime: '13:55', teacher: 'Valeriy Shvaiko', type: 'Practice' }
    ],
    thursday: [
      { subject: 'Software Quality and Testing', startTime: '08:30', endTime: '10:05', teacher: 'Ivan Varava', type: 'Lecture' },
      { subject: 'Parallel and distributed computing', startTime: '10:25', endTime: '12:00', teacher: 'Ivan Varava', type: 'Lecture' },
      { subject: 'DevOps technologies', startTime: '14:15', endTime: '15:50', teacher: 'Vadim Kolumbet', type: 'Lecture' }
    ],
    friday: [],
    saturday: [
      { subject: 'Asynchronous programming', startTime: '10:25', endTime: '12:00', teacher: 'Yuriy Yeroshkin', type: 'Lecture' }
    ],
    sunday: []
  },

  even: {
    monday: [
      { subject: 'English', startTime: '12:20', endTime: '13:55', teacher: 'Kostyantyn Lisetskyi', type: 'Practice' },
      { subject: 'Software Quality and Testing', startTime: '14:15', endTime: '15:50', teacher: 'Ivan Varava', type: 'Practice' }
    ],
    tuesday: [
      { subject: 'Basics of Big Data Analytics', startTime: '08:30', endTime: '10:05', teacher: 'Valeriy Shvaiko', type: 'Lecture' },
      { subject: 'Fundamentals of translator development', startTime: '12:20', endTime: '13:55', teacher: 'Yurii Statyvka', type: 'Lecture' }
    ],
    wednesday: [
      { subject: 'Fundamentals of translator development', startTime: '10:25', endTime: '12:00', teacher: 'Yuriy Statyvka', type: 'Practice' },
      { subject: 'Parallel and distributed computing', startTime: '14:15', endTime: '15:50', teacher: 'Ivan Varava', type: 'Practice' }
    ],
    thursday: [
      { subject: 'Software Quality and Testing', startTime: '08:30', endTime: '10:05', teacher: 'Ivan Varava', type: 'Lecture' },
      { subject: 'Parallel and distributed computing', startTime: '10:25', endTime: '12:20', teacher: 'Ivan Varava', type: 'Lecture' },
      { subject: 'DevOps technologies', startTime: '14:15', endTime: '15:50', teacher: 'Vadim Kolumbet', type: 'Lecture' }
    ],
    friday: [],
    saturday: [
      { subject: 'Asynchronous programming', startTime: '10:25', endTime: '12:05', teacher: 'Yuriy Yeroshkin', type: 'Lecture' },
      { subject: 'Asynchronous programming', startTime: '12:20', endTime: '13:55', teacher: 'Oleh Heiko', type: 'Practice' }
    ],
    sunday: []
  }
};

const seedSchedule = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Philly');
    console.log('✅ Connected to database');

    // 🔥 КРОК 1: Очищаємо розклад ТІЛЬКИ для цього користувача
    // Це видалить усі старі записи Яни, щоб не було дублікатів
    const deleted = await Schedule.deleteMany({ user: userId }); 
    console.log(`🧹 Cleared ${deleted.deletedCount} existing schedule entries for user ${userId}`);

    const today = new Date();

    // Знаходимо понеділок поточного тижня
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    mondayOfCurrentWeek.setHours(0, 0, 0, 0); 

    // Розрахунок номеру тижня
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffDays = Math.floor((mondayOfCurrentWeek - startOfYear) / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.ceil((diffDays + 1) / 7);

    const savedSchedules = [];

    // 🔥 КРОК 2: Генеруємо нові дані
    // Генеруємо розклад від -2 до +4 тижнів (всього 7 тижнів)
    for (let weekOffset = -2; weekOffset <= 4; weekOffset++) {
      const weekNumber = currentWeekNumber + weekOffset;
      const isEven = weekNumber % 2 === 0;
      const template = isEven ? scheduleTemplates.even : scheduleTemplates.odd;

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayName = dayNames[dayIndex];

        const date = new Date(mondayOfCurrentWeek);
        date.setDate(mondayOfCurrentWeek.getDate() + (weekOffset * 7) + dayIndex);
        date.setHours(0, 0, 0, 0);

        const classesForDay = template[dayName] || [];

        savedSchedules.push({
          user: userId, // Прив'язка до Яни
          dayOfWeek: dayName,
          date: date,
          weekNumber: weekNumber,
          classes: classesForDay,
          isHoliday: dayName === 'friday' || dayName === 'sunday'
        });
      }
    }

    // 🔥 КРОК 3: Вставляємо чисті дані
    await Schedule.insertMany(savedSchedules);
    
    console.log(`✅ Added ${savedSchedules.length} NEW schedule days for user ${userId}`);
    console.log(`📅 Current week number: ${currentWeekNumber}`);

    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  } catch (err) {
    console.error('❌ ERROR seeding schedule:', err);
  }
};

seedSchedule();