// middleware/auth.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey123';

const auth = (req, res, next) => {
  // 1. Отримуємо токен із заголовка Authorization
  // Формат: "Bearer <token>"
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Відрізаємо слово "Bearer " (перші 7 символів)
  const token = authHeader.replace('Bearer ', '');

  try {
    // 2. Розшифровуємо токен
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 3. Записуємо ID користувача в об'єкт запиту
    // Тепер у всіх наступних функціях ми зможемо використовувати req.user.id
    req.user = decoded; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;