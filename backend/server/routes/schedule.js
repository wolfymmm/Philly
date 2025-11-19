import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Повернути всі класи для конкретного тижня (1 = непарний, 2 = парний)
router.get('/all', async (req, res) => {
  try {
    const weekType = Number(req.query.week) || 1;
    const parity = weekType === 1 ? 1 : 0;

    const schedules = await Schedule.find({
      $expr: { $eq: [{ $mod: ["$weekNumber", 2] }, parity] }
    }).sort({ date: 1 });

    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

export default router;
