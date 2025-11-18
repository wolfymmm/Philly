import './App.css'
import { Routes, Route } from 'react-router-dom';
import About from './components/About/About';
import Shedule from './components/Shedule/Shedule';
import Tasks from './components/Tasks/Tasks';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <>
      <main>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/shedule" element={<Shedule />} />
          <Route path="/services" element={<Tasks />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </>
  )
}

export default App;
