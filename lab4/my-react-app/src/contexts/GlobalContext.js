import React, { createContext, useState, useEffect } from 'react';

export const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  const [trainingData, setTrainingData] = useState(
    JSON.parse(localStorage.getItem('trainingData')) || []
  );

  const [meals] = useState([
    { name: 'Салат', calories: 150 },
    { name: 'Картопля фрі', calories: 300 }
  ]);

  useEffect(() => {
    localStorage.setItem('trainingData', JSON.stringify(trainingData));  // Зберігаємо в LocalStorage
  }, [trainingData]);

  const logTrainingExecution = (training) => {
    const { name, duration, calories } = training;
  
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // місяці з 0
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
  
    const currentTime = now.toTimeString().slice(0, 5);
  
    const newTraining = {
      time: currentTime,
      duration: `${duration} хв`,
      calories: calories,
      type: name,
      date: date // тут тепер завжди YYYY-MM-DD
    };
  
    const updatedData = [...trainingData, newTraining];
    setTrainingData(updatedData);
  };
  
  return (
    <TrainingContext.Provider value={{ trainingData, meals, logTrainingExecution }}>
      {children}
    </TrainingContext.Provider>
  );
};
