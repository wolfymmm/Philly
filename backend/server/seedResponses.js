import { MongoClient } from 'mongodb';

async function seedResponses() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const database = client.db('Philly');
    const collection = database.collection('Responses');
    
    // 1. Очищення старих записів
    await collection.deleteMany({});
    console.log('🗑️  Old responses cleared');
    
    // 2. Нові шаблони (УВАЖНО ПЕРЕВІРЕНІ ДНІ)
    const responses = [

      // --- TOMORROW (Додано точні фрази!) ---
      {
        trigger: "how many classes do i have tomorrow",
        response: "Tomorrow, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "do i have classes tomorrow",
        response: "Tomorrow, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have tomorrow",
        response: "Here is your schedule for tomorrow:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      
      // --- TODAY (Додаємо для симетрії) ---
      {
        trigger: "how many classes do i have today",
        response: "Today, you have {classes_count} classes:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      
      // --- ДНІ ТИЖНЯ (Залишаємо як було) ---
      {
        trigger: "how many classes do i have on monday",
        response: "On Monday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on monday",
        response: "Here is your schedule for Monday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      // --- MONDAY ---
      {
        trigger: "how many classes do i have on monday",
        response: "On Monday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on monday",
        response: "Here is your schedule for Monday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- TUESDAY ---
      {
        trigger: "how many classes do i have on tuesday",
        response: "On Tuesday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on tuesday",
        response: "Here is your schedule for Tuesday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- WEDNESDAY ---
      {
        trigger: "how many classes do i have on wednesday",
        response: "On Wednesday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on wednesday",
        response: "Here is your schedule for Wednesday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- THURSDAY ---
      {
        trigger: "how many classes do i have on thursday",
        response: "On Thursday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on thursday",
        response: "Here is your schedule for Thursday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- FRIDAY ---
      {
        trigger: "how many classes do i have on friday",
        response: "On Friday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on friday",
        response: "Here is your schedule for Friday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- SATURDAY (Виправлено!) ---
      {
        trigger: "how many classes do i have on saturday",
        response: "On Saturday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on saturday",
        response: "Here is your schedule for Saturday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- SUNDAY (Додано!) ---
      {
        trigger: "how many classes do i have on sunday",
        response: "On Sunday, you have {classes_count} classes. Here is the schedule:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what classes do i have on sunday",
        response: "Here is your schedule for Sunday:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- GENERAL (TODAY/TOMORROW) ---
      {
        trigger: "classes today",
        response: "Today you have {classes_count} classes:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what is my schedule today",
        response: "Here is your schedule for today:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "classes tomorrow",
        response: "Tomorrow you have {classes_count} classes:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },
      {
        trigger: "what is my schedule tomorrow",
        response: "Here is your schedule for tomorrow:\n{schedule_info}",
        category: "schedule",
        isActive: true
      },

      // --- TASKS ---
      {
        trigger: "how many tasks do i have",
        response: "You have {tasks_count} pending tasks. {tasks_today} are due today.",
        category: "tasks",
        isActive: true
      },
      {
        trigger: "my tasks",
        response: "You have {tasks_count} pending tasks. {tasks_today} due today.",
        category: "tasks",
        isActive: true
      },

      // --- GREETING & HELP ---
      {
        trigger: "hello",
        response: "Hello! I can help you with your schedule and tasks. Just ask!",
        category: "greeting",
        isActive: true
      },
      {
        trigger: "help",
        response: "Try asking: 'What classes do I have on Saturday?' or 'My tasks'.",
        category: "help",
        isActive: true
      }
    ];
    
    await collection.insertMany(responses);
    console.log(`✅ Successfully inserted ${responses.length} responses`);
    
  } catch (error) {
    console.error('❌ Error seeding responses:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedResponses();