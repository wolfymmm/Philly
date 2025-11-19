// components/Dashboard.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

const Dashboard = () => {
  const auth = useContext(AuthContext)!;
  if (!auth.user) return <p>Please login</p>;

  return (
    <div>
      <h2>Welcome, {auth.user.username}</h2>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
