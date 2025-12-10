import express from 'express';
import Schedule from '../models/Schedule.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();

// 🔥 ЗАХИСТ: Усі маршрути нижче вимагають токен
router.use(auth);

// === НАЛАШТУВАННЯ ===
const SEMESTER_START = new Date('2025-12-08'); 

// Функція для визначення: це 1-й (Odd) чи 2-й (Even) тиждень
const getAcademicWeekType = (dateToCheck) => {
  const start = new Date(SEMESTER_START);
  start.setHours(0, 0, 0, 0);
  
  const current = new Date(dateToCheck);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'odd';

  const weeksPassed = Math.floor(diffDays / 7);
  return weeksPassed % 2 === 0 ? 'odd' : 'even';
};

// GET /today - Розклад на сьогодні
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const weekType = getAcademicWeekType(today);
    const isOddWeek = weekType === 'odd';

    console.log(`[API] User ${req.user.email} checking TODAY: ${dayOfWeek} (${weekType})`);

    const schedule = await Schedule.findOne({
      user: req.user.id, 
      dayOfWeek: dayOfWeek,
      weekNumber: { $mod: [2, isOddWeek ? 1 : 0] } 
    });

    if (!schedule) {
      return res.json({ message: 'No classes today', classes: [], weekInfo: weekType });
    }
    
    res.json({ ...schedule.toObject(), weekInfo: weekType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /tomorrow - Розклад на завтра
router.get('/tomorrow', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const weekType = getAcademicWeekType(tomorrow);
    const isOddWeek = weekType === 'odd';

    console.log(`[API] User ${req.user.email} checking TOMORROW: ${dayOfWeek} (${weekType})`);

    const schedule = await Schedule.findOne({
      user: req.user.id,
      dayOfWeek: dayOfWeek,
      weekNumber: { $mod: [2, isOddWeek ? 1 : 0] }
    });

    if (!schedule) {
      return res.json({ message: 'No classes tomorrow', classes: [], weekInfo: weekType });
    }
    res.json({ ...schedule.toObject(), weekInfo: weekType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /all - Весь розклад (фільтр по тижню)
router.get('/all', async (req, res) => {
  try {
    const { week } = req.query; // 'odd' або 'even'
    let filter = { user: req.user.id };

    console.log(`[API] Fetching ALL schedules for user ${req.user.email}. Week: ${week}`);

    if (week) {
      const isOddRequested = week.toLowerCase() === 'odd';
      // $mod: [2, 1] -> непарні (1, 3, 5...)
      // $mod: [2, 0] -> парні (0, 2, 4...)
      filter.weekNumber = { $mod: [2, isOddRequested ? 1 : 0] };
    }

    const schedules = await Schedule.find(filter).sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// 🔥 PUT /update-day - Оновлення розкладу (для кнопки Save на фронтенді)
router.put('/update-day', async (req, res) => {
  try {
    // Frontend надсилає: dayOfWeek ('monday'), classes ([...]), weekType ('odd')
    const { dayOfWeek, classes, weekType } = req.body;
    
    if (!dayOfWeek || !weekType) {
        return res.status(400).json({ message: 'Missing dayOfWeek or weekType' });
    }

    const isOdd = weekType === 'odd';
    console.log(`[API] Updating ${dayOfWeek} (${weekType}) for user ${req.user.email}`);

    // Оновлюємо ВСІ записи в базі, які відповідають цьому дню і типу тижня
    // Наприклад: Оновити всі "Понеділки" на "Непарних" тижнях
    const result = await Schedule.updateMany(
      { 
        user: req.user.id,
        dayOfWeek: dayOfWeek.toLowerCase(),
        weekNumber: { $mod: [2, isOdd ? 1 : 0] } 
      },
      { 
        $set: { classes: classes } 
      }
    );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Error updating schedule' });
  }
});

// POST / - Створити один конкретний запис (якщо треба)
router.post('/', async (req, res) => {
  try {
    const newSchedule = new Schedule({
      ...req.body,
      user: req.user.id
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;