import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css'; 

// Lazy loaded components
const Login = lazy(() => import('./pages/Auth/login.jsx'));
const Signup = lazy(() => import('./pages/Auth/Signup.jsx'));
const Home = lazy(() => import('./pages/home/Home.jsx'));
const Hero = lazy(() => import('./../src/pages/hero/Hero.jsx'));
const Mistake = lazy(() => import('./pages/mistake.jsx')); 
const StoryDetails = lazy(() => import('./../src/pages/home/StoryDetails.jsx'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-cyan-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 dark:border-cyan-400"></div>
  </div>
);

const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" exact element={<Hero />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="*" exact element={<Mistake />} />
            <Route path="/story/:id" element={<StoryDetails />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
