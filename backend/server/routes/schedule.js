import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Розклад на сьогодні
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const schedule = await Schedule.findOne({ 
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });
    
    if (!schedule) {
      return res.json({ message: 'No classes today', classes: [] });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Розклад на завтра
router.get('/tomorrow', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const schedule = await Schedule.findOne({ 
      date: { 
        $gte: tomorrow, 
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });
    
    if (!schedule) {
      return res.json({ message: 'No classes tomorrow', classes: [] });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Розклад по днях тижня
router.get('/day/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const schedules = await Schedule.find({ 
      dayOfWeek: day.toLowerCase(),
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(1);
    
    if (!schedules || schedules.length === 0) {
      return res.json([]);
    }
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;