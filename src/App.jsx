import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Auth/login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import Home from './pages/home/Home.jsx';
import Hero from './../src/pages/hero/Hero.jsx';
import Mistake from './pages/mistake.jsx'; 
import StoryDetails from './../src/pages/home/StoryDetails.jsx';
import DownloadStory from './pages/home/DownloadStoryPage.jsx'; // Import the new component

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Hero />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="*" exact element={<Mistake />} /> {/* 404 not found page */}
          <Route path="/story/:id" element={<StoryDetails />} />
          <Route path="/download-story/:id" element={<DownloadStory />} /> {/* Add the download story route */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
