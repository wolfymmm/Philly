import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Profile.scss';
import { AxiosError } from 'axios';

const AVAILABLE_AVATARS = [
  'avatars/pig.svg',
  'avatars/cat.svg',
  'avatars/dog.svg',
  'avatars/fox.svg',
  'avatars/deer.svg',
  'avatars/panda.svg',
  'avatars/rook.svg',
  'avatars/cow.svg'
];

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const [editing, setEditing] = useState(false);
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'avatars/pig.svg');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  if (!user) {
    return <p className="not-logged">You are not logged in.</p>;
  }

  const handleAvatarSelect = (avatarPath: string) => {
    setAvatar(avatarPath);
    setShowAvatarSelect(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        { 
          firstName, 
          lastName, 
          email, 
          avatar 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      setUser(res.data.user);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setEditing(false);
      setShowAvatarSelect(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (err) {
      console.error('Profile update error:', err);
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatar || 'avatars/pig.svg');
    setEditing(false);
    setShowAvatarSelect(false);
    setMessage('');
  };

  const toggleAvatarSelect = () => {
    setShowAvatarSelect(!showAvatarSelect);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout(); 
    setShowLogoutConfirm(false); 
    navigate('/'); 
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <img 
            className="main-avatar"
            src={avatar || 'avatars/pig.svg'} 
            alt="Avatar" 
            onError={(e) => {
              e.currentTarget.src = 'avatars/pig.svg';
            }}
          />
          
          {editing && (
            <button 
              className="avatar-edit-btn"
              onClick={toggleAvatarSelect}
            >
              {showAvatarSelect ? 'Hide Avatars' : 'Change Avatar'}
            </button>
          )}

          {editing && showAvatarSelect && (
            <div className="avatar-selection">
              <h4>Choose Avatar</h4>
              <div className="avatars-grid">
                {AVAILABLE_AVATARS.map((avatarPath, index) => (
                  <img
                    key={index}
                    src={avatarPath}
                    alt={`avatar-${index + 1}`}
                    className={`avatar-item ${avatar === avatarPath ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(avatarPath)}
                    onError={(e) => {
                      e.currentTarget.src = 'avatars/pig.svg';
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-info-section">
          {message && (
            <div className={`profile-message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="profile-info-grid">
            <div className="profile-info-field">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                disabled={!editing}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>

            <div className="profile-info-field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                disabled={!editing}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>

            <div className="profile-info-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                disabled={!editing}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="profile-buttons">
            {editing ? (
              <>
                <button className="btn save" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn edit" 
                  onClick={() => {
                    setEditing(true);
                    setMessage('');
                  }}
                >
                  Edit Profile
                </button>
                {/* Змінено обробник події на handleLogoutClick */}
                <button className="btn logout" onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальне вікно підтвердження виходу */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirm-buttons">
              <button className="btn confirm-yes" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="btn confirm-no" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}