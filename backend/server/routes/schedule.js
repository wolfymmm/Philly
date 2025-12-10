import express from 'express';
import Schedule from '../models/Schedule.js';
import auth from '../middleware/auth.js'; // 🔥 Імпорт middleware

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

// GET /today - Розклад на сьогодні для поточного юзера
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const weekType = getAcademicWeekType(today);
    const isOddWeek = weekType === 'odd';

    console.log(`[API] User ${req.user.email} checking TODAY: ${dayOfWeek} (${weekType})`);

    // 🔥 ФІЛЬТР: user: req.user.id
    const schedule = await Schedule.findOne({
      user: req.user.id, // Тільки для цього юзера
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

// GET /tomorrow - Розклад на завтра для поточного юзера
router.get('/tomorrow', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const weekType = getAcademicWeekType(tomorrow);
    const isOddWeek = weekType === 'odd';

    console.log(`[API] User ${req.user.email} checking TOMORROW: ${dayOfWeek} (${weekType})`);

    // 🔥 ФІЛЬТР: user: req.user.id
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

// GET /all - Весь розклад поточного юзера (з фільтром по тижню)
router.get('/all', async (req, res) => {
  try {
    const { week } = req.query; // 'odd' або 'even'
    
    // 🔥 Початковий фільтр: ТІЛЬКИ цей юзер
    let filter = { user: req.user.id };

    console.log(`[API] Fetching ALL schedules for user ${req.user.email}. Week: ${week}`);

    if (week) {
      const isOddRequested = week.toLowerCase() === 'odd';
      // Додаємо фільтр по тижню
      filter.weekNumber = { $mod: [2, isOddRequested ? 1 : 0] };
    }

    const schedules = await Schedule.find(filter).sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// POST / - Створити запис розкладу (прив'язаний до юзера)
router.post('/', async (req, res) => {
  try {
    const newSchedule = new Schedule({
      ...req.body,
      user: req.user.id // 🔥 Автоматична прив'язка
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;