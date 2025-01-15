import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner'; // Import Toaster once here
import Login from './pages/Auth/login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import Home from './pages/home/Home.jsx';
import Hero from './../src/pages/hero/Hero.jsx';
import Mistake from './pages/mistake.jsx'; 
import StoryDetails from './../src/pages/home/StoryDetails.jsx';

const App = () => {
  return (
    <div>
      {/* Toaster is only rendered here, at the top level */}
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" exact element={<Hero />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="*" exact element={<Mistake />} />
          <Route path="/story/:id" element={<StoryDetails />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
