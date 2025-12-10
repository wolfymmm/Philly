import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js'; // <--- 1. Імпортуємо middleware

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey123';

// === РЕЄСТРАЦІЯ (Без змін) ===
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, avatar } = req.body;
    // ... (ваш код реєстрації залишається без змін) ...
    // Для стислості я його згорнув, він у вас правильний
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, firstName, lastName, avatar: avatar || '/pig.svg' });
    await user.save();
    
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// === ЛОГІН (Без змін) ===
router.post('/login', async (req, res) => {
  // ... (ваш код логіна залишається без змін) ...
    try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email/Password required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// === ОТРИМАННЯ ПРОФІЛЮ (Можна спростити через middleware) ===
// Використовуємо middleware 'auth', щоб не писати розшифровку токена вручну
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === ОНОВЛЕННЯ ПРОФІЛЮ (НОВИЙ КОД) ===
// 2. Додаємо PUT запит, захищений middleware 'auth'
router.put('/profile', auth, async (req, res) => {
  try {
    // req.user.id ми маємо завдяки middleware auth
    const userId = req.user.id; 
    const { firstName, lastName, email, avatar } = req.body;

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Якщо користувач змінює email, перевіряємо, чи він не зайнятий іншим юзером
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'This email is already in use' });
      }
      user.email = email;
    }

    // Оновлюємо інші поля
    // Використовуємо оператор || user.field, щоб не стерти дані, якщо поле пусте
    // Але у вашому випадку фронтенд надсилає поточні значення, тому можна просто присвоїти
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (avatar !== undefined) user.avatar = avatar;

    // Зберігаємо (це оновить поле updatedAt автоматично через вашу модель)
    const updatedUser = await user.save();

    console.log('✅ Profile updated for:', updatedUser.email);

    // Повертаємо оновлені дані (без пароля)
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (err) {
    console.error('🔥 Profile update error:', err);
    res.status(500).json({ message: 'Server error during update' });
  }
});

export default router;