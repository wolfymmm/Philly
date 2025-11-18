import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['homework', 'project', 'exam', 'reading', 'other'],
    default: 'homework'
  },
  subject: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 0
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', null],
    default: null
  },
  assignedBy: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'Tasks'
});

// Індекси для швидкого пошуку
taskSchema.index({ dueDate: 1, priority: -1 });
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ category: 1, subject: 1 });

export default mongoose.model('Tasks', taskSchema);