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
    const date = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
  
    const newTraining = {
      time: currentTime,
      duration: `${duration} хв`,
      calories: calories,
      type: name,
      date: date
    };
  
    const updatedData = [...trainingData, newTraining];
    setTrainingData(updatedData);  // Оновлюємо trainingData
  };  

  return (
    <TrainingContext.Provider value={{ trainingData, meals, logTrainingExecution }}>
      {children}
    </TrainingContext.Provider>
  );
};
