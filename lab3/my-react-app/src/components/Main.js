import React, { useContext, useEffect } from 'react'; 
import './Main.css'; 
import Training from './Training'; 
import Progress from './Progress'; 
import MealTable from './MealTable';
import { TrainingContext } from '../contexts/GlobalContext';

const Main = () => { 
  const { trainingData, meals, logTrainingExecution } = useContext(TrainingContext);

  useEffect(() => {
    // Завантажуємо дані з LocalStorage при першому завантаженні
    const savedTrainingData = JSON.parse(localStorage.getItem('trainingData')) || [];
    if (savedTrainingData.length > 0) {
      logTrainingExecution(savedTrainingData);  // Оновлюємо стан при завантаженні
    }
  }, [logTrainingExecution]);

  return ( 
    <main> 
      <Training onExecute={logTrainingExecution} /> 
      <Progress trainingData={trainingData} /> 
      <MealTable meals={meals} /> 
    </main> 
  );
};

export default Main;
