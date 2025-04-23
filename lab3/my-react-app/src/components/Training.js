import React, { useState, useContext } from 'react'; 
import './Training.css';
import { TrainingContext } from '../contexts/GlobalContext';

const trainings = [
  { name: "Кардіо", duration: 13, calories: 300, img: "/images/workout1.jpg", link: "https://www.youtube.com/watch?v=gHav--Sjhbk", type: "Кардіо" },
  { name: "Силові вправи", duration: 34, calories: 400, img: "/images/workout2.jpg", link: "https://www.youtube.com/watch?v=imKGm85nie4", type: "Силові вправи" },
  { name: "Пілатес", duration: 54, calories: 500, img: "/images/workout5.jpg", link: "https://www.youtube.com/watch?v=N1nqm6xsPmU", type: "Пілатес" },
  { name: "Йога", duration: 25, calories: 285, img: "/images/workout3.jpg", link: "https://www.youtube.com/watch?v=5zV7TikZiEw", type: "Йога" },
  { name: "Розтяжка", duration: 32, calories: 310, img: "/images/workout4.jpg", link: "https://www.youtube.com/watch?v=giEB7NmJD_Q", type: "Розтяжка" }
];

const Training = () => {
  const { logTrainingExecution } = useContext(TrainingContext);
  const [selectedType, setSelectedType] = useState('');

  const filteredTrainings = selectedType
    ? trainings.filter(training => training.type === selectedType)
    : trainings;

  return (
    <section id="trainings">
      <h2>Тренування</h2>
      <div className="filter-container">
        <label htmlFor="training-type">Тип тренування:</label>
        <select
          id="training-type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Всі типи</option>
          <option value="Кардіо">Кардіо</option>
          <option value="Силові вправи">Силові вправи</option>
          <option value="Пілатес">Пілатес</option>
          <option value="Йога">Йога</option>
          <option value="Розтяжка">Розтяжка</option>
        </select>
      </div>

      <div className="grid-container">
        {filteredTrainings.map(training => (
          <div key={training.name} className="training-card">
            <img src={training.img} alt={`Тренування ${training.name}`} />
            <h3>{training.name}</h3>
            <p><strong>Тривалість:</strong> {training.duration} хв</p>
            <p><strong>Калорії:</strong> {training.calories} ккал</p>
            <a href={training.link} target="_blank" rel="noopener noreferrer" className="watch-btn">Переглянути тренування</a>
            <button onClick={() => logTrainingExecution(training)} className="execute-btn">Виконати</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Training;
