import { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import axios from 'axios';
import './Profile.scss';

const AVAILABLE_AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5'
];

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');

  if (!user) {
    return <p className="not-logged">You are not logged in.</p>;
  }

  const handleAvatarSelect = (url: string) => {
    setAvatar(url);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        { username, email, avatar },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUser(res.data);
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-avatar">
        <img src={avatar} alt="Avatar" />
      </div>

      {editing && (
        <div className="avatar-selection">
          <h4>Choose an avatar:</h4>
          <div className="avatars-grid">
            {AVAILABLE_AVATARS.map(url => (
              <img
                key={url}
                src={url}
                alt="avatar"
                className={`avatar-item ${avatar === url ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect(url)}
              />
            ))}
          </div>
        </div>
      )}

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
            <button className="btn save" onClick={handleSave}>Save</button>
            <button className="btn cancel" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn edit" onClick={() => setEditing(true)}>Edit Profile</button>
            <button className="btn logout" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
