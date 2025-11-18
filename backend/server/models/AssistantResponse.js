import mongoose from 'mongoose';

const assistantResponseSchema = new mongoose.Schema({
  trigger: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  response: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Responses'
});

// Індекс для швидкого пошуку
assistantResponseSchema.index({ trigger: 1, category: 1 });

export default mongoose.model('AssistantResponse', assistantResponseSchema, 'Responses');