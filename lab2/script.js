// Масив для запису виконаних тренувань
let trainerData = JSON.parse(localStorage.getItem('trainerData')) || [];
let trainingData = JSON.parse(localStorage.getItem('trainingData')) || [{ time: "06:30", duration: "13 хв", calories: 250, type: "Кардіо", date: "2025-03-25" }];
let meals = JSON.parse(localStorage.getItem('meals')) || {
    breakfast: [],
    snack: [],
    lunch: [],
    snack2: [],
    dinner: [],
    snack3: []
};

const mealNames = {
    breakfast: "Сніданок",
    snack: "Перекус",
    lunch: "Обід",
    snack2: "Другий перекус",
    dinner: "Вечеря",
    snack3: "Третій перекус"
};

document.addEventListener('DOMContentLoaded', function () {
    const chooseButtons = document.querySelectorAll('.choose-btn');
    
    chooseButtons.forEach(button => {
        button.addEventListener('click', function () {
            handleChooseClick(this);
        });
    });
    GenerateTrainings();
    if (document.getElementById('caloriesChart')) {
        generateCaloriesChart();
    }
    updateProgress();

    const cards = document.querySelectorAll('.training-card'); // Збираємо всі картки тренувань

    cards.forEach(card => {
        // Обробник події для наведення
        card.addEventListener('mouseenter', function () {
            card.style.transform = "scale(1.05)";
            card.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)"; 
            card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease"; 
        });

        // Обробник події для виходу миші
        card.addEventListener('mouseleave', function () {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "none"; 
        });
    });
});

// Функція обробки натискання на кнопку
function handleChooseClick(button) {
    const trainerCard = button.closest('.trainer-card');
    const trainerName = trainerCard.querySelector('h3').textContent;
    const dateInput = trainerCard.querySelector('.date-picker');
    const timeSelect = trainerCard.querySelector('.time-select');
    
    const selectedDate = dateInput.value;
    const selectedTime = timeSelect.value;
    
    if (selectedDate && selectedTime) {
        // Перевіряємо, чи є вже тренування для цього тренера на вибрану дату та час
        const existingTraining = trainerData.find(training => 
            training.trainer === trainerName && 
            training.date === selectedDate && 
            training.time === selectedTime
        );
        
        if (existingTraining) {
            alert(`Цей час (${selectedTime}) вже заброньований для тренера ${trainerName} на ${selectedDate}.`);
        } else {
            // Додаємо нове тренування в trainerData
            trainerData.push({
                trainer: trainerName,
                date: selectedDate,
                time: selectedTime
            });
            localStorage.setItem('trainerData', JSON.stringify(trainerData)); // Оновлюємо дані в localStorage
            alert(`Тренування з ${trainerName} обрано на ${selectedDate} о ${selectedTime}.`);
        }
    } else {
        alert("Будь ласка, виберіть дату та час.");
    }
}

document.getElementById("add-meal").addEventListener("click", function () {
    const mealTime = document.getElementById("meal-time").value;
    const mealName = document.getElementById("meal").value;
    const mealWeight = document.getElementById("weight").value;
    const mealCaloriesPer100g = document.getElementById("calories").value;

    if (!mealTime || !mealName || !mealWeight || !mealCaloriesPer100g) {
        alert("Будь ласка, заповніть усі поля.");
    } else {
        const mealCalories = (mealWeight * mealCaloriesPer100g) / 100;
        // Додаємо страву до відповідного прийому їжі
        meals[mealTime].push({ name: mealName, weight: mealWeight, calories: mealCalories, date: new Date().toISOString() });
        // Зберігаємо зміни в localStorage
        localStorage.setItem('meals', JSON.stringify(meals));

        alert('Страву додано!');
        clearForm();
        loadMealsFromLocalStorage();
    }
});

// Функція для очищення форми
function clearForm() {
    document.getElementById("meal").value = '';
    document.getElementById("weight").value = '';
    document.getElementById("calories").value = '';
}

// Функція для завантаження страв з localStorage і відображення їх у відповідних розділах
function loadMealsFromLocalStorage() {
    Object.keys(meals).forEach(mealTime => {
        const mealDetailsDiv = document.getElementById(`meal-details-${mealTime}`);
        mealDetailsDiv.innerHTML = `<h3>Спожиті страви на ${mealTime}</h3>`;
        meals[mealTime].forEach(meal => {
            mealDetailsDiv.innerHTML += `
                <p>Назва: ${meal.name}, Вага: ${meal.weight} г, Калорії: ${meal.calories} ккал</p>
            `;
        });
    });
}

// Функція для відкриття/закриття меню зі спожитими стравами
function toggleMealDetails(mealTime) {
    const mealDetailsDiv = document.getElementById(`meal-details-${mealTime}`);
    const isVisible = mealDetailsDiv.style.display === "block";

    mealDetailsDiv.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
        const mealName = mealNames[mealTime] || mealTime.charAt(0).toUpperCase() + mealTime.slice(1); 
        mealDetailsDiv.innerHTML = `<h3>Спожиті страви на ${mealName}</h3>`;

        if (meals[mealTime].length > 0) {
            meals[mealTime].forEach(meal => {
                mealDetailsDiv.innerHTML += `
                    <p>Назва: ${meal.name}, Вага: ${meal.weight} г, Калорії: ${meal.calories} ккал</p>
                `;
            });
        } else {
            mealDetailsDiv.innerHTML += `<p>Немає даних для цього прийому їжі.</p>`;
        }
    }
}

function GenerateTrainings() {
    // Масив тренувань
    const trainings = [
        { name: "Кардіо", duration: 13, calories: 300, img: "workout1.jpg", link: "https://www.youtube.com/watch?v=gHav--Sjhbk" },
        { name: "Силові вправи", duration: 34, calories: 400, img: "workout2.jpg", link: "https://www.youtube.com/watch?v=imKGm85nie4" },
        { name: "Пілатес", duration: 54, calories: 500, img: "workout5.jpg", link: "https://www.youtube.com/watch?v=N1nqm6xsPmU" },
        { name: "Йога", duration: 25, calories: 285, img: "workout3.jpg", link: "https://www.youtube.com/watch?v=5zV7TikZiEw" },
        { name: "Розтяжка", duration: 32, calories: 310, img: "workout4.jpg", link: "https://www.youtube.com/watch?v=giEB7NmJD_Q" }
    ];

    // Вибір контейнера для тренувань
    const container = document.querySelector('.grid-container');
    container.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток

    // Створюємо картки тренувань
    for (let i = 0; i < trainings.length; i++) {
        const training = trainings[i];

        // Створюємо елемент картки
        const card = document.createElement('article');
        card.classList.add('training-card');
        card.setAttribute('data-duration', training.duration); // Додаємо атрибут для сортування

        // Визначення рівня складності
        let level = "";
        if (training.calories < 350) {
            level = "Рівень: легкий";
        } else {
            level = "Рівень: складний";
        }

        // Створюємо елемент для рівня складності
        const levelElement = document.createElement('p');
        levelElement.classList.add('training-level');
        levelElement.innerHTML = `<strong>Рівень:</strong> ${level.slice(7)}`; // Виділяємо "Рівень" жирним шрифтом

        // Додаємо вміст до картки
        card.innerHTML = `
            <img src="${training.img}" alt="Тренування ${i + 1}">
            <h3>${training.name}</h3>
            <p>Ефективне тренування для покращення фізичної форми.</p>
            <p><strong>Тривалість:</strong> ${training.duration} хв</p>
            <p><strong>Калорії:</strong> ${training.calories} ккал</p>
            <p>${levelElement.outerHTML}</p> <!-- Вставляємо рівень складності -->
            <p><a href="${training.link}" target="_blank">
                <button class="watch-btn">Переглянути тренування</button>
            </a></p>
            <button class="execute-btn">Виконати</button>
        `;

        // Додаємо картку в контейнер
        container.appendChild(card);
    }

    // Отримуємо всі картки тренувань
    const allCards = document.querySelectorAll('.training-card');

    // Сортуємо картки по тривалості (за зростанням)
    const sortedCards = Array.from(allCards).sort((a, b) => {
        const durationA = parseInt(a.getAttribute('data-duration'));
        const durationB = parseInt(b.getAttribute('data-duration'));
        return durationA - durationB;
    });

    // Очищаємо контейнер і додаємо відсортовані картки
    container.innerHTML = '';
    sortedCards.forEach(card => container.appendChild(card));
    addExecuteButtonListeners();
}

// Функція для оновлення прогресу
function updateProgress() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Місяці йдуть з 0
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentYear}-${currentMonth}-${currentDay}`; // Формат YYYY-MM-DD

    const progressContainer = document.querySelector("#progress");
    const trainingList = document.querySelector("#training-list");
    const timeTrainedElement = document.querySelector("#progress p:nth-of-type(1)");
    const caloriesBurnedElement = document.querySelector("#progress p:nth-of-type(2)");

    // Фільтруємо тренування за поточною датою
    const todaysTrainings = trainingData.filter(training => training.date === formattedDate);

    // Якщо є тренування для поточної дати
    if (todaysTrainings.length > 0) {
        let totalTime = 0;
        let totalCalories = 0;
        
        // Очищаємо список тренувань
        trainingList.innerHTML = "";

        // Проходимо по тренуваннях і додаємо інформацію
        todaysTrainings.forEach(training => {
            const listItem = document.createElement('li');
            listItem.textContent = `${training.type}: ${training.duration} - ${training.calories} ккал`;
            trainingList.appendChild(listItem);

            // Додаємо час тренування та калорії до загальних
            const durationMinutes = parseInt(training.duration.split(' ')[0]); // Витягуємо хвилини
            totalTime += durationMinutes;
            totalCalories += training.calories;
        });

        // Заповнюємо поля загальним часом та калоріями
        timeTrainedElement.textContent = `Загальний час тренувань: ${totalTime} хв`;
        caloriesBurnedElement.textContent = `Кількість спалених калорій: ${totalCalories} ккал`;
    } else {
        // Якщо тренувань на поточну дату немає
        timeTrainedElement.textContent = "Загальний час тренувань: 0 хв";
        caloriesBurnedElement.textContent = "Кількість спалених калорій: 0 ккал";
    }
}

function generateCaloriesChart() {
    if (!trainingData.length) return; // Якщо масив порожній – не будуємо графік

    const currentDate = new Date();
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentYear}-${currentMonth}-${currentDay}`; // Формат YYYY-MM-DD

    // Фільтруємо тренування лише для поточної дати
    const todaysTrainings = trainingData.filter(entry => entry.date === formattedDate);

    const timeLabels = [];
    for (let h = 0; h < 24; h++) {
        timeLabels.push(h.toString().padStart(2, '0') + ":00");
    }
    timeLabels.push("23:59");

    const caloriesData = new Array(25).fill(0);
    const trainingInfo = new Array(25).fill(null).map(() => []);

    todaysTrainings.forEach(entry => {
        let hour = parseInt(entry.time.split(":")[0]);
        let minutes = parseInt(entry.time.split(":")[1]);

        let index = hour === 23 && minutes === 59 ? 24 : hour;
        caloriesData[index] += entry.calories;
        trainingInfo[index].push(`${entry.type} - ${entry.calories} ккал`);
    });

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
                            let index = tooltipItem.dataIndex;
                            let time = timeLabels[index];
                            let info = trainingInfo[index];
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
}

// Функція для запису виконаного тренування
function logTrainingExecution(card) {
    const trainingName = card.querySelector('h3').textContent;
    const trainingCalories = parseInt(card.querySelector('p:nth-child(5)').textContent.split(': ')[1]);
    const trainingDurationText = card.querySelector('p:nth-child(4)').textContent.split(': ')[1]; // отримуємо тривалість у вигляді "13 хв"

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Місяці йдуть з 0
    const day = now.getDate().toString().padStart(2, '0'); // День місяця
    const date = `${year}-${month}-${day}`; // Форматуємо дату у форматі YYYY-MM-DD

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    trainingData.push({
        time: currentTime,
        duration: trainingDurationText,
        calories: trainingCalories,
        type: trainingName,
        date: date
    });

    // Збереження нових даних в localStorage
    localStorage.setItem('trainingData', JSON.stringify(trainingData));

    // Оновлення графіку калорій
    generateCaloriesChart();

    // Оновлення прогресу
    updateProgress(); // Оновлюємо прогрес після додавання тренування
}


// Функція для обробки натискання кнопки "Виконати"
function handleExecuteButtonClick(event) {
    const card = event.target.closest('.training-card');
    if (!card) return;

    logTrainingExecution(card);
}

// Функція додавання обробників до кнопок "Виконати"
function addExecuteButtonListeners() {
    document.querySelectorAll('.execute-btn').forEach(button => {
        button.addEventListener('click', handleExecuteButtonClick);
    });
}