import express from 'express';
import AssistantResponse from '../models/AssistantResponse.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching responses from database...');
    const responses = await AssistantResponse.find({ isActive: true });
    console.log(`Found ${responses.length} responses`);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { trigger, response, category } = req.body;
    
    const newResponse = new AssistantResponse({
      trigger,
      response,
      category: category || 'general',
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;