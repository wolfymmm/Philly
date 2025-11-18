import mongoose from 'mongoose';
import Task from './models/Tasks.js';

const seedTasks = async () => {
  try {
    // Підключення до MongoDB
    await mongoose.connect('mongodb://localhost:27017/Philly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Видалення існуючих задач
    await Task.deleteMany({});
    console.log('Existing tasks deleted');

    // Створення тестових задач
    const tasks = [
      {
        title: 'Complete Math Homework',
        description: 'Solve exercises from chapter 5 about derivatives',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // через 2 дні
        priority: 'high',
        category: 'homework',
        subject: 'Mathematics',
        estimatedTime: 120,
        assignedBy: 'Dr. Smith'
      },
      {
        title: 'Physics Lab Report',
        description: 'Write lab report for pendulum experiment',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // через 5 днів
        priority: 'medium',
        category: 'project',
        subject: 'Physics',
        estimatedTime: 180,
        status: 'in progress',
        assignedBy: 'Prof. Johnson'
      },
      {
        title: 'Literature Essay',
        description: 'Write essay on Shakespeare\'s sonnets',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // через 7 днів
        priority: 'medium',
        category: 'homework',
        subject: 'Literature',
        estimatedTime: 90
      },
      {
        title: 'Chemistry Quiz Preparation',
        description: 'Study for organic chemistry quiz',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // завтра
        priority: 'high',
        category: 'exam',
        subject: 'Chemistry',
        estimatedTime: 60,
        status: 'pending'
      },
      {
        title: 'Programming Project',
        description: 'Complete the chat application with React and Node.js',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // через 10 днів
        priority: 'high',
        category: 'project',
        subject: 'Computer Science',
        estimatedTime: 300,
        status: 'in progress',
        notes: 'Need to implement voice recognition feature'
      },
      {
        title: 'History Reading',
        description: 'Read chapters 8-10 about World War II',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // через 3 дні
        priority: 'low',
        category: 'reading',
        subject: 'History',
        estimatedTime: 45
      },
      {
        title: 'Biology Presentation',
        description: 'Prepare presentation on cell biology',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // вчора (прострочена)
        priority: 'medium',
        category: 'project',
        subject: 'Biology',
        estimatedTime: 120,
        status: 'pending'
      },
      {
        title: 'Weekly Math Exercises',
        description: 'Complete weekly practice problems',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // через 7 днів
        priority: 'medium',
        category: 'homework',
        subject: 'Mathematics',
        estimatedTime: 60,
        isRecurring: true,
        recurrencePattern: 'weekly'
      }
    ];

    // Додавання задач до бази даних
    await Task.insertMany(tasks);
    console.log(`${tasks.length} sample tasks created successfully`);

    // Перевірка створених задач
    const allTasks = await Task.find({});
    console.log(`Total tasks in database: ${allTasks.length}`);

    // Закриття з'єднання
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

// Запуск seed функції
seedTasks();