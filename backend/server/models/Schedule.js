import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  date: {
    type: Date,
    required: true
  },
  classes: [{
    subject: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    teacher: String,
    type: {
      type: String,
      enum: ['Lecture', 'Practice'],
      default: 'Lecture'
    }
  }],
  weekNumber: {
    type: Number,
    required: true
  },
  isHoliday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Schedules'
});

scheduleSchema.index({ user: 1, date: 1 });
scheduleSchema.index({ user: 1, dayOfWeek: 1 });

export default mongoose.model('Schedule', scheduleSchema);