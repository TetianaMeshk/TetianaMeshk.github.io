import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Trainer from './components/Trainer';
import Training from './components/Training';
import Progress from './components/Progress';
import MealTable from './components/MealTable';
import Reviews from './components/Reviews';
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TrainingProvider } from './contexts/GlobalContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <TrainingProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/trainer" element={<Trainer />} />
            <Route path="/training" element={<Training />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/meals" element={<MealTable />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </TrainingProvider>
  );
}

export default App;
