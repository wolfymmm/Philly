import express from 'express';
import User from '../models/User.js'; // Важливо: .js розширення
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
// Якщо немає змімінної оточення, використовуємо дефолтний ключ
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey123';

// === РЕЄСТРАЦІЯ ===
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, avatar } = req.body;

    console.log('📝 Registration attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      avatar: avatar || '/pig.svg'
    });

    await user.save();
    console.log('✅ User registered:', user.email);

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      SECRET_KEY, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      } 
    });

  } catch (err) {
    console.error('🔥 Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// === ЛОГІН ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      SECRET_KEY, 
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);
    res.json({ 
      token, 
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      } 
    });

  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === ОТРИМАННЯ ПРОФІЛЮ ===
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);

  } catch (err) {
    console.error('Profile error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;