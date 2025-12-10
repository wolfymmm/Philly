import express from 'express';
import Task from '../models/Tasks.js'; // Переконайся, що файл називається Task.js
import auth from '../middleware/auth.js'; // Імпорт middleware авторизації

const router = express.Router();

// ЗАХИСТ: Застосовуємо auth middleware до всіх маршрутів нижче
router.use(auth);

// GET /api/tasks - отримати всі задачі ПОТОЧНОГО користувача
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, sortBy = 'dueDate' } = req.query;
    
    // Початковий фільтр обов'язково містить ID користувача
    let filter = { user: req.user.id };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ [sortBy]: 1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/tasks/upcoming - отримати майбутні задачі юзера
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      user: req.user.id, // 🔥 Тільки свої
      dueDate: { $gte: today },
      status: { $in: ['pending', 'in progress'] }
    }).sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks/today - задачі на сьогодні для юзера
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      user: req.user.id, // 🔥 Тільки свої
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'in progress'] }
    }).sort({ priority: -1, dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks/overdue - прострочені задачі юзера
router.get('/overdue', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      user: req.user.id, // 🔥 Тільки свої
      dueDate: { $lt: today },
      status: { $in: ['pending', 'in progress'] }
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks/:id - отримати конкретну задачу (з перевіркою власника)
router.get('/:id', async (req, res) => {
  try {
    // Шукаємо по ID задачі ТА ID юзера
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tasks - створити нову задачу
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id // 🔥 Прив'язуємо задачу до поточного користувача
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/tasks/:id - оновити задачу
router.put('/:id', async (req, res) => {
  try {
    // Використовуємо findOneAndUpdate з фільтром по user, щоб не можна було змінити чужу задачу
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id - видалити задачу
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/tasks/:id/status - оновити статус
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;