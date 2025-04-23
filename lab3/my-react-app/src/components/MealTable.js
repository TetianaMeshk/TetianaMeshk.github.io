import React, { useState, useEffect } from 'react';
import './MealTable.css';
import { mealsData } from './mealsData'; // Імпортуємо дані

const MealTable = () => {
  const [meals, setMeals] = useState({
    breakfast: [],
    snack: [],
    lunch: [],
    snack2: [],
    dinner: [],
    snack3: []
  });

  const [waterIntake, setWaterIntake] = useState(0); // Стейт для води
  const [filteredMeals, setFilteredMeals] = useState([]); // Для фільтрування страв
  const [mealName, setMealName] = useState(''); // Для введеного імені страви
  const [mealCalories, setMealCalories] = useState(''); // Для калорій страви
  const [modalMessage, setModalMessage] = useState(''); // Повідомлення для модального вікна
  const [isModalOpen, setIsModalOpen] = useState(false); // Стейт для контролю модального вікна

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem('meals')) || meals;
    setMeals(storedMeals);

    // Підрахунок води збереженої в localStorage
    const totalWater = storedMeals.breakfast.concat(storedMeals.snack, storedMeals.lunch, storedMeals.snack2, storedMeals.dinner, storedMeals.snack3)
      .filter(meal => meal.name.toLowerCase() === 'вода') // Фільтруємо тільки воду
      .reduce((total, meal) => total + parseFloat(meal.weight), 0);
    setWaterIntake(totalWater / 1000); // Перетворюємо грамів у літри
  }, []);

  const mealNames = {
    breakfast: 'Сніданок',
    snack: 'Перекус',
    lunch: 'Обід',
    snack2: 'Другий перекус',
    dinner: 'Вечеря',
    snack3: 'Третій перекус'
  };

  const toggleMealDetails = (mealTime) => {
    const mealDetailsDiv = document.getElementById(`meal-details-${mealTime}`);
    const isVisible = mealDetailsDiv.style.display === 'block';

    mealDetailsDiv.style.display = isVisible ? 'none' : 'block';
  };

  const handleAddMeal = (mealTime, mealName, mealWeight, mealCaloriesPer100g) => {
    if (!mealTime || !mealName || !mealWeight || !mealCaloriesPer100g) {
      alert('Будь ласка, заповніть усі поля.');
    } else {
      const mealCalories = (mealWeight * mealCaloriesPer100g) / 100;
      const updatedMeals = { ...meals, [mealTime]: [...meals[mealTime], { name: mealName, weight: mealWeight, calories: mealCalories, date: new Date().toISOString() }] };
      setMeals(updatedMeals);
      localStorage.setItem('meals', JSON.stringify(updatedMeals));

      // Якщо додали "Вода", оновлюємо кількість випитої води
      if (mealName.toLowerCase() === 'вода') {
        setWaterIntake(prev => prev + parseFloat(mealWeight) / 1000); // Додаємо вагу води в літрах
      }

      // Відображаємо повідомлення у модальному вікні
      setModalMessage(`${mealNames[mealTime]}: ${mealName} - ${mealCalories} ккал додано!`);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  // Фільтрація страв за введеним текстом
  const handleMealNameChange = (e) => {
    const value = e.target.value;
    setMealName(value);

    if (value) {
      const filtered = mealsData.filter(meal =>
        meal.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMeals(filtered);
    } else {
      setFilteredMeals([]);
    }
  };

  // Вибір страви зі списку
  const handleMealSelect = (meal) => {
    setMealName(meal.name); // Оновлюємо назву страви
    setMealCalories(meal.calories); // Оновлюємо калорії страви
    setFilteredMeals([]); // Закриваємо список варіантів
  };

  return (
    <section id="nutrition">
      <h2>Раціон</h2>
      <div className="meal-container">
        {/* Перша колонка */}
        <div className="left-column">
          <h3>Спожите за сьогодні</h3>
          <div className="meal-table">
            {Object.keys(mealNames).map((mealTime) => (
              <div key={mealTime}>
                <div className="meal-row" onClick={() => toggleMealDetails(mealTime)}>
                  <span className="meal-name">{mealNames[mealTime]}</span>
                  <span className="plus">+</span>
                </div>
                <div id={`meal-details-${mealTime}`} className="meal-details">
                  <h3>Спожиті страви на {mealNames[mealTime]}</h3>
                  {meals[mealTime].map((meal, index) => (
                    <p key={index}>Назва: {meal.name}, Вага: {meal.weight} г, Калорії: {meal.calories} ккал</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3>Водний баланс</h3>
          <p><strong>Випито води за день:</strong> {waterIntake.toFixed(2)} л</p>
        </div>

        {/* Друга колонка */}
        <div className="right-column">
          <h3>Додати страву</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="meal-time">Прийом їжі:</label>
            <select id="meal-time" name="meal-time">
              <option value="breakfast">Сніданок</option>
              <option value="snack">Перекус</option>
              <option value="lunch">Обід</option>
              <option value="snack2">Другий перекус</option>
              <option value="dinner">Вечеря</option>
              <option value="snack3">Третій перекус</option>
            </select>
            <p>
              <label htmlFor="meal">Назва страви:</label>
              <input
                type="text"
                id="meal"
                name="meal"
                value={mealName}
                onChange={handleMealNameChange}
                required
              />
              {/* Випадне меню для страв */}
              {filteredMeals.length > 0 && (
                <ul className="suggestions">
                  {filteredMeals.map((meal, index) => (
                    <li key={index} onClick={() => handleMealSelect(meal)}>
                      {meal.name} ({meal.calories} ккал)
                    </li>
                  ))}
                </ul>
              )}
            </p>
            <p>
              <label htmlFor="weight">Вага:</label>
              <input type="number" id="weight" name="weight" required />
            </p>
            <p>
              <label htmlFor="calories">Калорійність (ккал):</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)} // Дозволяємо редагувати калорії вручну
                required
              />
            </p>
            <button type="button" onClick={() => {
              const mealTime = document.getElementById('meal-time').value;
              const mealWeight = document.getElementById('weight').value;
              const mealCaloriesPer100g = mealCalories; // Використовуємо вибрані калорії
              handleAddMeal(mealTime, mealName, mealWeight, mealCaloriesPer100g);
            }}>
              Додати
            </button>
          </form>
        </div>
      </div>

      {/* Модальне вікно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button className="close-modal-btn" onClick={closeModal}>Закрити</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MealTable;
