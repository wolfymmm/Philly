import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import assistantRoutes from './routes/assistantResponses.js';
import scheduleRoutes from './routes/schedule.js';
import taskRoutes from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/Philly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Маршрути
app.use('/api/responses', assistantRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});