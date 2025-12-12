import express from 'express';
import Schedule from '../models/Schedule.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();

router.use(auth);

const SEMESTER_START = new Date('2025-12-08'); 

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

// Функція для створення порожнього розкладу
const createEmptyScheduleForUser = async (userId) => {
  try {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedules = [];

    // Створюємо розклад для кожного дня для обох типів тижнів
    for (const day of daysOfWeek) {
      // Непарний тиждень (weekNumber: 1)
      schedules.push({
        user: userId,
        dayOfWeek: day,
        weekNumber: 1,
        classes: []
      });

      // Парний тиждень (weekNumber: 2)
      schedules.push({
        user: userId,
        dayOfWeek: day,
        weekNumber: 2,
        classes: []
      });
    }

    await Schedule.insertMany(schedules);
    console.log(`Created empty schedule for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error creating schedule:', error);
    return false;
  }
};

// Middleware для перевірки наявності розкладу
const checkAndCreateSchedule = async (req, res, next) => {
  try {
    const hasSchedule = await Schedule.exists({ user: req.user.id });
    
    if (!hasSchedule) {
      console.log(`User ${req.user.email} has no schedule. Creating...`);
      await createEmptyScheduleForUser(req.user.id);
    }
    
    next();
  } catch (error) {
    console.error('Schedule check error:', error);
    next();
  }
};

// Застосовуємо middleware до всіх маршрутів
router.use(checkAndCreateSchedule);

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
      weekNumber: isOddWeek ? 1 : 2  // 1 для odd, 2 для even
    });

    if (!schedule) {
      return res.json({ 
        message: 'No classes today', 
        classes: [], 
        weekInfo: weekType,
        dayOfWeek: dayOfWeek,
        weekNumber: isOddWeek ? 1 : 2
      });
    }
    
    res.json({ 
      ...schedule.toObject(), 
      weekInfo: weekType 
    });
  } catch (err) {
    console.error('Today schedule error:', err);
    res.status(500).json({ message: err.message });
  }
});

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
      weekNumber: isOddWeek ? 1 : 2
    });

    if (!schedule) {
      return res.json({ 
        message: 'No classes tomorrow', 
        classes: [], 
        weekInfo: weekType,
        dayOfWeek: dayOfWeek,
        weekNumber: isOddWeek ? 1 : 2
      });
    }
    
    res.json({ 
      ...schedule.toObject(), 
      weekInfo: weekType 
    });
  } catch (err) {
    console.error('Tomorrow schedule error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Основний маршрут для отримання розкладу
router.get('/all', async (req, res) => {
  try {
    const { week } = req.query; 
    let filter = { user: req.user.id };

    console.log(`[API] Fetching ALL schedules for user ${req.user.email}. Week: ${week}`);

    if (week) {
      // Конвертуємо "odd"/"even" в 1/2
      const isOddRequested = week.toLowerCase() === 'odd';
      filter.weekNumber = isOddRequested ? 1 : 2;
    }

    // Сортуємо за днем тижня та номером тижня
    const schedules = await Schedule.find(filter).sort({ 
      dayOfWeek: 1,
      weekNumber: 1 
    });
    
    res.json(schedules);
  } catch (err) {
    console.error('All schedule error:', err);
    res.status(500).json([]);
  }
});

// Оновлення розкладу для конкретного дня та типу тижня
router.put('/update-day', async (req, res) => {
  try {
    const { dayOfWeek, classes, weekType } = req.body;
    
    if (!dayOfWeek || !weekType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing dayOfWeek or weekType' 
      });
    }

    const isOdd = weekType.toLowerCase() === 'odd';
    const weekNumber = isOdd ? 1 : 2;
    
    console.log(`[API] Updating ${dayOfWeek} (week ${weekNumber}) for user ${req.user.email}`);

    // Оновлюємо або створюємо запис
    const schedule = await Schedule.findOneAndUpdate(
      { 
        user: req.user.id,
        dayOfWeek: dayOfWeek.toLowerCase(),
        weekNumber: weekNumber
      },
      { 
        $set: { classes: classes || [] } 
      },
      { 
        new: true,           // Повертає оновлений документ
        upsert: true,        // Створює якщо не існує
        runValidators: true  // Запускає валідацію
      }
    );

    res.json({ 
      success: true, 
      updatedCount: 1,
      schedule: schedule,
      message: `Schedule updated for ${dayOfWeek} (${weekType} week)`
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating schedule',
      error: err.message 
    });
  }
});

// Створення нового розкладу (за потреби)
router.post('/', async (req, res) => {
  try {
    const newSchedule = new Schedule({
      ...req.body,
      user: req.user.id
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    console.error('Create schedule error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Маршрут для отримання конкретного дня
router.get('/day/:dayName', async (req, res) => {
  try {
    const { dayName } = req.params;
    const { week } = req.query;
    
    let filter = { 
      user: req.user.id,
      dayOfWeek: dayName.toLowerCase()
    };

    if (week) {
      const isOdd = week.toLowerCase() === 'odd';
      filter.weekNumber = isOdd ? 1 : 2;
    }

    const schedules = await Schedule.find(filter).sort({ weekNumber: 1 });
    
    res.json(schedules);
  } catch (err) {
    console.error('Day schedule error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Маршрут для ініціалізації розкладу (можна викликати з фронтенду)
router.post('/initialize', async (req, res) => {
  try {
    const hasSchedule = await Schedule.exists({ user: req.user.id });
    
    if (hasSchedule) {
      return res.json({ 
        success: true, 
        message: 'Schedule already exists',
        initialized: false 
      });
    }

    const created = await createEmptyScheduleForUser(req.user.id);
    
    if (created) {
      res.json({ 
        success: true, 
        message: 'Schedule initialized successfully',
        initialized: true 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to initialize schedule' 
      });
    }
  } catch (err) {
    console.error('Initialize error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error initializing schedule',
      error: err.message 
    });
  }
});

export default router;