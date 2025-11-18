import mongoose from 'mongoose';
import AssistantResponse from './models/AssistantResponse.js';

const seedData = [
  {
    trigger: "hello",
    response: "Hello! How can I help you today?",
    category: "greeting",
    isActive: true
  },
  {
    trigger: "hi",
    response: "Hi! What can I do for you?",
    category: "greeting",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Monday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "how many classes do i have on Tuesday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Wednesday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Thursday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Friday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Saturday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have on Sunday",
    response: "You have no classes on Sunday! Relax!",
    category: "schedule",
    isActive: true
  },
  {
    trigger: "how many classes do i have today",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes do i have tomorrow",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "how many classes did I have yesterday",
    response: "Let me check your schedule. One moment!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "what classes do i have on Monday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "what classes do i have on Tuesday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "what classes do i have on Wednesday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "what classes do i have on Thursday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "what classes do i have on Friday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "what classes do i have on Saturday",
    response: "Checking your schedule...",
    category: "schedule",
    isActive: true
  },
    {
    trigger: "what classes do i have on Sunday",
    response: "You have no classes on Sunday! Relax!",
    category: "schedule",
    isActive: true
  },
   {
    trigger: "what classes do i have tomorrow",
    response: "Checking your schedule for tomorrow...",
    category: "schedule",
    isActive: true
  },
     {
    trigger: "what classes did i have yesterday",
    response: "Checking your schedule for yesterday...",
    category: "schedule",
    isActive: true
  },
  {
    trigger: "what classes do i have today",
    response: "Checking your schedule for today...",
    category: "schedule",
    isActive: true
  },
  {
    trigger: "who are you",
    response: "My name is Philly🐁 I'm your personal assistant. How can I help you today?",
    category: "about",
    isActive: true
  },
  {
    trigger: "help",
    response: "Sure! Just tell me what you need help with.",
    category: "general",
    isActive: true
  },
  {
    trigger: "what time is it",
    response: "Let me check the current time for you.",
    category: "general",
    isActive: true
  },
  {
    trigger: "what the day is today",
    response: "Let me check...",
    category: "general",
    isActive: true
  },
    {
    trigger: "how many tasks do I have",
    response: "Let me check...",
    category: "tasks",
    isActive: true
  },
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Philly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB.');

    await AssistantResponse.deleteMany({});
    console.log('Cleared old AssistantResponse records.');

    const created = await AssistantResponse.insertMany(seedData);
    console.log(`Inserted ${created.length} AssistantResponse documents.`);

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();
