// src/components/MealTable.js
import React, { useState, useEffect } from 'react';
import './MealTable.css';
import { mealsData } from './mealsData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const MealTable = () => {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState({
    breakfast: [],
    snack: [],
    lunch: [],
    snack2: [],
    dinner: [],
    snack3: []
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mealNames = {
    breakfast: 'Сніданок',
    snack: 'Перекус',
    lunch: 'Обід',
    snack2: 'Другий перекус',
    dinner: 'Вечеря',
    snack3: 'Третій перекус'
  };

  const today = new Date().toISOString().slice(0, 10);

  // Завантажуємо meals і waterIntake з Firestore
  useEffect(() => {
    if (!currentUser) return;

    const fetchMeals = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(userRef);
      let userMeals = {
        breakfast: [], snack: [], lunch: [],
        snack2: [], dinner: [], snack3: []
      };

      if (snap.exists()) {
        const data = snap.data();
        userMeals = data.meals || userMeals;
      } else {
        // якщо документа ще немає — створюємо з початковими полями
        await setDoc(userRef, { meals: userMeals, waterIntake: 0 }, { merge: true });
      }

      // Фільтруємо тільки сьогоднішні
      const filteredByDate = {};
      for (const key in userMeals) {
        filteredByDate[key] = userMeals[key].filter(m =>
          m.date.slice(0, 10) === today
        );
      }
      setMeals(filteredByDate);

      // Підрахунок води
      const totalWater = Object.values(filteredByDate).flat()
        .filter(m => m.name.toLowerCase() === 'вода')
        .reduce((sum, m) => sum + parseFloat(m.weight), 0);
      setWaterIntake(totalWater / 1000);
    };

    fetchMeals();
  }, [currentUser]);

  const toggleMealDetails = mealTime => {
    const el = document.getElementById(`meal-details-${mealTime}`);
    if (!el) return;
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
  };

  // Додаємо нову страву в meals у користувача
  const handleAddMeal = async (mealTime, name, weight, calsPer100) => {
    if (!mealTime || !name || !weight || !calsPer100) {
      alert('Будь ласка, заповніть усі поля.');
      return;
    }
    const calories = (weight * calsPer100) / 100;
    const newMeal = {
      name,
      weight: parseFloat(weight),
      calories,
      date: new Date().toISOString()
    };

    const userRef = doc(db, 'users', currentUser.uid);
    // Додаємо в масив meals.mealTime через arrayUnion
    await updateDoc(userRef, {
      [`meals.${mealTime}`]: arrayUnion(newMeal)
    });

    // Оновлюємо локальний стан
    if (newMeal.date.slice(0, 10) === today) {
      setMeals(prev => ({
        ...prev,
        [mealTime]: [...prev[mealTime], newMeal]
      }));
      if (name.toLowerCase() === 'вода') {
        setWaterIntake(prev => prev + parseFloat(weight) / 1000);
      }
    }

    setModalMessage(
      `${mealNames[mealTime]}: ${name} - ${calories.toFixed(1)} ккал додано!`
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const handleMealNameChange = e => {
    const v = e.target.value;
    setMealName(v);
    if (v) {
      setFilteredMeals(
        mealsData.filter(m =>
          m.name.toLowerCase().includes(v.toLowerCase())
        )
      );
    } else {
      setFilteredMeals([]);
    }
  };

  const handleMealSelect = m => {
    setMealName(m.name);
    setMealCalories(m.calories);
    setFilteredMeals([]);
  };

  return (
    <section id="nutrition">
      <h2>Раціон</h2>
      <div className="meal-container">
        <div className="left-column">
          <h3>Спожите за сьогодні</h3>
          <div className="meal-table">
            {Object.keys(mealNames).map(mt => (
              <div key={mt}>
                <div
                  className="meal-row"
                  onClick={() => toggleMealDetails(mt)}
                >
                  <span className="meal-name">{mealNames[mt]}</span>
                  <span className="plus">+</span>
                </div>
                <div
                  id={`meal-details-${mt}`}
                  className="meal-details"
                >
                  <h3>Спожиті страви на {mealNames[mt]}</h3>
                  {meals[mt]?.length > 0 ? (
                    meals[mt].map((m, i) => (
                      <p key={i}>
                        Назва: {m.name}, Вага: {m.weight} г, Калорії:{' '}
                        {m.calories.toFixed(1)} ккал
                      </p>
                    ))
                  ) : (
                    <p>Немає страв</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <h3>Водний баланс</h3>
          <p>
            <strong>Випито води за день:</strong> {waterIntake.toFixed(2)} л
          </p>
        </div>

        <div className="right-column">
          <h3>Додати страву</h3>
          <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="meal-time">Прийом їжі:</label>
            <select id="meal-time" name="meal-time">
              {Object.keys(mealNames).map(key => (
                <option value={key} key={key}>
                  {mealNames[key]}
                </option>
              ))}
            </select>
            <p>
              <label htmlFor="meal">Назва страви:</label>
              <input
                type="text"
                id="meal"
                value={mealName}
                onChange={handleMealNameChange}
                required
              />
              {filteredMeals.length > 0 && (
                <ul className="suggestions">
                  {filteredMeals.map((m, i) => (
                    <li key={i} onClick={() => handleMealSelect(m)}>
                      {m.name} ({m.calories} ккал)
                    </li>
                  ))}
                </ul>
              )}
            </p>
            <p>
              <label htmlFor="weight">Вага:</label>
              <input type="number" id="weight" required />
            </p>
            <p>
              <label htmlFor="calories">Калорійність (ккал):</label>
              <input
                type="number"
                id="calories"
                value={mealCalories}
                onChange={e => setMealCalories(e.target.value)}
                required
              />
            </p>
            <button
              type="button"
              onClick={() => {
                const mt = document.getElementById('meal-time').value;
                const w = document.getElementById('weight').value;
                handleAddMeal(mt, mealName, w, mealCalories);
              }}
            >
              Додати
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button
              className="close-modal-btn"
              onClick={closeModal}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MealTable;
