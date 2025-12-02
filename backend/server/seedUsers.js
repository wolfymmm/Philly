// seedUsers.ts
import mongoose from 'mongoose';
import User from './models/User.ts'; // твоя модель User

const MONGO_URI = 'mongodb://localhost:27017/Philly';

const Users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    username: 'yana',
    email: 'yana@example.com',
    password: '123',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    username: 'max',
    email: 'max@example.com',
    password: 'qwerty123',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Очистка колекції перед вставкою
    await User.deleteMany({});
    console.log('Users collection cleared');

    // Додаємо користувачів без хешування пароля (як ти просила)
    for (let user of Users) {
      await User.create(user);
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
