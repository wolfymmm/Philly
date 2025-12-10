import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; 

dotenv.config();

const usersToSeed = [
  {
    email: 'test.user@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    avatar: '/pig.svg'
  },
  {
    email: 'admin@example.com',
    password: 'adminpassword',
    firstName: 'Admin',
    lastName: 'System',
    avatar: '/cow.svg'
  },
  {
    email: 'max.student@gmail.com',
    password: '12345678',
    firstName: 'Max',
    lastName: 'Tereshchuk',
    avatar: '/pig.svg'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Philly');
    console.log('✅ Connected to database');

    // 🔥 ВИПРАВЛЕННЯ ПОМИЛКИ: Видаляємо старий індекс username, якщо він є
    try {
      await User.collection.dropIndex('username_1');
      console.log('🗑️  Old "username" index dropped successfully');
    } catch (err) {
      // Якщо індексу немає, просто ігноруємо помилку
      if (err.code !== 27) {
        console.log('ℹ️  No old "username" index found or other error (skipping)');
      }
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const user of usersToSeed) {
      // 1. Перевіряємо, чи існує користувач
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        console.log(`⚠️ User with email ${user.email} already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      // 2. Хешуємо пароль
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // 3. Створюємо
      const newUser = new User({
        ...user,
        password: hashedPassword
      });

      await newUser.save();
      console.log(`✅ Added user: ${user.email}`);
      addedCount++;
    }

    console.log(`\n🏁 Seeding finished.`);
    console.log(`Total added: ${addedCount}`);
    console.log(`Total skipped: ${skippedCount}`);

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();