import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Повернути класи для конкретного тижня (odd/even)
router.get('/all', async (req, res) => {
  try {
    const weekType = req.query.week || 'odd'; // 'odd' або 'even'
    const isOddWeek = weekType.toLowerCase() === 'odd';
    
    // Знаходимо всі розклади
    const allSchedules = await Schedule.find({}).sort({ date: 1 });
    
    // Знаходимо поточний тиждень
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffDays = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.ceil((diffDays + 1) / 7);
    
    console.log('Current week number:', currentWeekNumber);
    
    // Знаходимо всі унікальні номери тижнів
    const weekNumbers = [...new Set(allSchedules.map(s => s.weekNumber))].sort((a, b) => a - b);
    console.log('Available week numbers:', weekNumbers);
    
    // Знаходимо найближчий тиждень відповідної парності
    let targetWeekNumber = null;
    
    // Шукаємо серед доступних тижнів
    for (const weekNum of weekNumbers) {
      const isEvenWeek = weekNum % 2 === 0;
      const hasCorrectParity = isOddWeek ? !isEvenWeek : isEvenWeek;
      
      if (hasCorrectParity) {
        if (!targetWeekNumber || Math.abs(weekNum - currentWeekNumber) < Math.abs(targetWeekNumber - currentWeekNumber)) {
          targetWeekNumber = weekNum;
        }
      }
    }
    
    console.log('Target week number:', targetWeekNumber);
    
    // Фільтруємо розклад для цього тижня
    const result = targetWeekNumber 
      ? allSchedules.filter(s => s.weekNumber === targetWeekNumber)
      : [];
    
    console.log('Result count:', result.length);
    res.json(result);
    
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json([]);
  }
});

router.put('/update-day', async (req, res) => {
  try {
    const { dayOfWeek, classes, weekType } = req.body;

    const isOdd = weekType === "odd";

    const updated = await Schedule.updateMany(
      { dayOfWeek, weekNumber: { $mod: [2, isOdd ? 1 : 0] } },
      { $set: { classes } }
    );

    res.json({ success: true, updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update" });
  }
});


export default router;