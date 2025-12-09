import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Loader from './components/Loader/Loader';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import About from './components/About/About';
import Shedule from './components/Shedule/Shedule';
import Tasks from './components/Tasks/Tasks';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile'


function App() {
  const location = useLocation();           // ➕ відстежуємо зміну маршруту
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); // ➕ плавний loader 300 мс
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
    {loading && <Loader />}
      <main>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/shedule" element={<PrivateRoute><Shedule /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
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
