// backend/routes/auth.ts
import express from 'express';
import User from '../models/User.ts'; // перевір, що шлях вірний
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'mysecretkey123'; // простий секрет для JWT

// Логін
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // без bcrypt
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Профіль
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ email: user.email });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const { username, email, avatar } = req.body;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Оновлюємо тільки ті поля, які передали
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json(user); // повертаємо повний user з новим avatar
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});


export default router;
