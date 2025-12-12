import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Loader from './components/Loader/Loader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import About from './pages/About/About';
import Shedule from './pages/Shedule/Shedule';
import Tasks from './pages/Tasks/Tasks';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile'


function App() {
  const location = useLocation();     
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
    {loading && <Loader />}
     <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/shedule" element={<PrivateRoute><Shedule /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App;
