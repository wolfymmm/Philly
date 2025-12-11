import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Конфігурація шляхів для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const sampleResponses = [
  {
    trigger: 'hello',
    response: 'Hello! How can I help you today?',
    category: 'greeting',
    language: 'en'
  },
  {
    trigger: 'how are you',
    response: "I'm doing great, thank you for asking! How about you?",
    category: 'greeting', 
    language: 'en'
  },
  {
    trigger: 'what can you do',
    response: 'I can chat with you and answer your questions. Try asking me something!',
    category: 'capabilities',
    language: 'en'
  },
  {
    trigger: 'thank you',
    response: "You're welcome! Is there anything else I can help with?",
    category: 'politeness',
    language: 'en'
  },
  {
    trigger: 'goodbye',
    response: 'Goodbye! Have a wonderful day!',
    category: 'greeting',
    language: 'en'
  }
];

const seedData = async () => {
  try {
    // Підключення до бази Philly
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Philly');
    console.log('✅ Connected to Philly database');

    // Динамічний імпорт моделі
    const { default: AssistantResponse } = await import('../models/AssistantResponse.js');
    
    // Очищення колекції (опціонально)
    await AssistantResponse.deleteMany({});
    console.log('🧹 Collection cleared');

    // Додаємо дані до колекції Responses
    const result = await AssistantResponse.insertMany(sampleResponses);
    console.log(`✅ Added ${result.length} responses to Responses collection`);

    // Перевірка даних
    const count = await AssistantResponse.countDocuments();
    console.log(`📊 Total documents in Responses collection: ${count}`);

    await mongoose.connection.close();
    console.log('🔌 Connection closed');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();