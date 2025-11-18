import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
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
    room: String,
    type: {
      type: String,
      enum: ['lecture', 'practice', 'lab', 'seminar'],
      default: 'lecture'
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

// Індекс для швидкого пошуку за датою та днем тижня
scheduleSchema.index({ date: 1, dayOfWeek: 1 });

export default mongoose.model('Schedule', scheduleSchema);