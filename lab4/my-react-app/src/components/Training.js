import React, { useState, useEffect } from 'react';
import './Training.css';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const trainings = [
  { name: "Кардіо", duration: 13, calories: 300, img: "/images/workout1.jpg", link: "https://www.youtube.com/watch?v=gHav--Sjhbk", type: "Кардіо" },
  { name: "Силові вправи", duration: 34, calories: 400, img: "/images/workout2.jpg", link: "https://www.youtube.com/watch?v=imKGm85nie4", type: "Силові вправи" },
  { name: "Пілатес", duration: 54, calories: 500, img: "/images/workout5.jpg", link: "https://www.youtube.com/watch?v=N1nqm6xsPmU", type: "Пілатес" },
  { name: "Йога", duration: 25, calories: 285, img: "/images/workout3.jpg", link: "https://www.youtube.com/watch?v=5zV7TikZiEw", type: "Йога" },
  { name: "Розтяжка", duration: 32, calories: 310, img: "/images/workout4.jpg", link: "https://www.youtube.com/watch?v=giEB7NmJD_Q", type: "Розтяжка" }
];

const Training = () => {
  const { currentUser } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = 4;

  const filteredTrainings = selectedType
    ? trainings.filter(training => training.type === selectedType)
    : trainings;

    const logTrainingExecution = async (training) => {
      if (!currentUser) return;
      const userRef = doc(db, 'users', currentUser.uid);
      const completedTraining = { 
        name: training.name, 
        date: new Date().toISOString(), 
        calories: training.calories,
        duration: training.duration  // Додаємо час тренування
      };
      await updateDoc(userRef, {
        completedTrainings: arrayUnion(completedTraining)
      });
      alert(`Тренування "${training.name}" виконано!`);
    };

  const next = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % filteredTrainings.length);
  };

  const prev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + filteredTrainings.length) % filteredTrainings.length);
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(visibleCards, filteredTrainings.length); i++) {
      items.push(filteredTrainings[(startIndex + i) % filteredTrainings.length]);
    }
    return items;
  };

  return (
    <section id="trainings">
      <h2>Тренування</h2>

      <div className="filter-container">
        <label htmlFor="training-type">Тип тренування:</label>
        <select id="training-type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Всі типи</option>
          {Array.from(new Set(trainings.map(t => t.type))).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="carousel-wrapper">
        {filteredTrainings.length > visibleCards && (
          <button className="carousel-btn left" onClick={prev}>←</button>
        )}

        <div className="carousel-container">
          {getVisibleItems().map((training) => (
            <div key={training.name} className="training-card">
              <img src={training.img} alt={`Тренування ${training.name}`} />
              <h3>{training.name}</h3>
              <p><strong>Тривалість:</strong> {training.duration} хв</p>
              <p><strong>Калорії:</strong> {training.calories} ккал</p>
              <div className="button-group">
                <a href={training.link} target="_blank" rel="noopener noreferrer" className="watch-btn">Переглянути тренування</a>
                <button className="execute-btn" onClick={() => logTrainingExecution(training)}>Виконати</button>
              </div>
            </div>
          ))}
        </div>

        {filteredTrainings.length > visibleCards && (
          <button className="carousel-btn right" onClick={next}>→</button>
        )}
      </div>
    </section>
  );
};

export default Training;
