import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // зберігаємо пароль у відкритому вигляді
});

export default mongoose.model('User', userSchema);
