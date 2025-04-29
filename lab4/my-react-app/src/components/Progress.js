import React, { useEffect, useState } from 'react';
import './Progress.css';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'; // Імпорт авторизації
import Chart from 'chart.js/auto';

const Progress = () => {
  const { currentUser } = useAuth();
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [weeklyAverageCalories, setWeeklyAverageCalories] = useState(0);
  const [previousWeeklyAverageCalories, setPreviousWeeklyAverageCalories] = useState(0);

  useEffect(() => {
    if (currentUser) {
      fetchCompletedTrainings();
    }
  }, [currentUser]);

  const fetchCompletedTrainings = async () => {
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      setCompletedTrainings(userData.completedTrainings || []);
    }
  };

  useEffect(() => {
    generateCaloriesChart();
    if (completedTrainings.length > 0) {
      calculateWeeklyCalories();
    }
  }, [completedTrainings]);

  const generateCaloriesChart = () => {
    const currentDate = new Date();
    const timeLabels = [];
    for (let h = 0; h < 24; h++) {
      timeLabels.push(h.toString().padStart(2, '0') + ":00");
    }
    timeLabels.push("23:59");

    const caloriesData = new Array(25).fill(0);
    const trainingInfo = new Array(25).fill(null).map(() => []);

    if (completedTrainings && completedTrainings.length > 0) {
      const todaysTrainings = completedTrainings.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === currentDate.getFullYear() &&
          entryDate.getMonth() === currentDate.getMonth() &&
          entryDate.getDate() === currentDate.getDate()
        );
      });

      todaysTrainings.forEach(entry => {
        const dateObj = new Date(entry.date);
        const hour = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const index = (hour === 23 && minutes === 59) ? 24 : hour;
        caloriesData[index] += entry.calories;
        trainingInfo[index].push(`${entry.name} - ${entry.calories} ккал`);
      });
    }

    const chartCanvas = document.getElementById('caloriesChart');
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext('2d');

    if (window.caloriesChartInstance) {
      window.caloriesChartInstance.destroy();
    }

    window.caloriesChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: timeLabels,
        datasets: [{
          label: 'Витрачені калорії',
          data: caloriesData,
          backgroundColor: 'rgba(0, 102, 204, 0.7)',
          borderColor: 'rgba(0, 102, 204, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                const time = timeLabels[index];
                const info = trainingInfo[index];
                return info.length > 1
                  ? [`Час: ${time}`, ...info]
                  : `${info[0] || "Немає даних"}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Час' },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              callback: function (value, index) {
                const displayLabels = ["00:00", "06:00", "12:00", "18:00", "23:59"];
                return displayLabels.includes(timeLabels[index]) ? timeLabels[index] : '';
              }
            },
            grid: { drawOnChartArea: false, drawBorder: true }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Калорії' },
            ticks: { stepSize: 200, suggestedMin: 0, suggestedMax: 1000 },
            grid: { drawOnChartArea: true, drawBorder: true }
          }
        }
      }
    });
  };

  const calculateWeeklyCalories = () => {
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);

    const currentWeekTrainings = completedTrainings.filter(entry => {
      const entryDate = new Date(entry.date);
      return getWeekNumber(entryDate) === currentWeek;
    });

    const previousWeek = currentWeek - 1;
    const previousWeekTrainings = completedTrainings.filter(entry => {
      const entryDate = new Date(entry.date);
      return getWeekNumber(entryDate) === previousWeek;
    });

    const currentWeekCalories = currentWeekTrainings.reduce((sum, training) => sum + training.calories, 0);
    const previousWeekCalories = previousWeekTrainings.reduce((sum, training) => sum + training.calories, 0);

    setWeeklyAverageCalories(currentWeekCalories / (currentWeekTrainings.length || 1));
    setPreviousWeeklyAverageCalories(previousWeekCalories / (previousWeekTrainings.length || 1));
  };

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
  };

  const checkAchievements = () => {
    if (weeklyAverageCalories > previousWeeklyAverageCalories) {
      return 'Досягнення: середня кількість спалених калорій цього тижня більша, ніж минулого!';
    }
    return '';
  };

  const today = new Date();
  const todaysTrainings = completedTrainings.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  });

  const totalMinutes = todaysTrainings.reduce((total, t) => total + (parseInt(t.duration) || 0), 0);
  const totalCalories = todaysTrainings.reduce((total, t) => total + (t.calories || 0), 0);

  return (
    <section id="progress">
      <h2>Мій прогрес</h2>
      <div className="progress-columns">
        <div className="progress-column">
          <h2>Спалено калорій</h2>
          <div style={{ height: '400px' }}>
            <canvas id="caloriesChart" width="600" height="400"></canvas>
          </div>
        </div>

        <div className="progress-column">
          <h2>Сьогоднішня активність</h2>
          <div>
            <h3>Виконані тренування:</h3>
            {todaysTrainings.length > 0 ? (
              <ul>
                {todaysTrainings.map((training, index) => (
                  <li key={index}>
                    {training.name}: {training.duration} хв - {training.calories} ккал
                  </li>
                ))}
              </ul>
            ) : (
              <p>Сьогодні ще немає виконаних тренувань.</p>
            )}
            <p><strong>Загальний час тренувань:</strong> {totalMinutes} хв</p>
            <p><strong>Кількість спалених калорій:</strong> {totalCalories} ккал</p>
            <p><strong>{checkAchievements()}</strong></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Progress;
