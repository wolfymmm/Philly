// seedUsers.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.ts'; // твоя модель User

const MONGO_URI = 'mongodb://localhost:27017/Philly';

const Users = [
  { username: 'admin', email: 'admin@example.com', password: '123456' },
  { username: 'yana', email: 'yana@example.com', password: 'password123' },
  { username: 'max', email: 'max@example.com', password: 'qwerty123' }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Очищуємо колекцію перед вставкою
    await User.deleteMany({});
    console.log('Users collection cleared');

    for (let user of Users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });
      console.log(`User ${user.username} created`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
