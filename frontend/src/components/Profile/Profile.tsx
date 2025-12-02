// src/components/Profile/Profile.tsx
import { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import axios from 'axios';
import './Profile.scss';

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>You are not logged in.</p>;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Конвертуємо в base64 (для простоти, можна зберігати на сервері)
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      // Надсилаємо на сервер оновлення
      const res = await axios.put(
        `http://localhost:5000/api/auth/profile`,
        { username, email, avatar },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setUser(res.data); // оновлюємо контекст
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-avatar">
        <img src={avatar || '/default-avatar.png'} alt="Avatar" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div className="profile-info">
        <label>
          Username:
          <input
            type="text"
            value={username}
            disabled={!editing}
            onChange={e => setUsername(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            disabled={!editing}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
      </div>

      {message && <p className="profile-message">{message}</p>}

      <div className="profile-buttons">
        {editing ? (
          <>
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
