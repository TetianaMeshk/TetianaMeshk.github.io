import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Trainer from './components/Trainer';
import Training from './components/Training';
import Progress from './components/Progress';
import MealTable from './components/MealTable';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TrainingProvider } from './contexts/GlobalContext';

function App() {
  return (
    <TrainingProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/trainer" element={<Trainer />} />
            <Route path="/training" element={<Training />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/meals" element={<MealTable />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </TrainingProvider>
  );
}

export default App;
