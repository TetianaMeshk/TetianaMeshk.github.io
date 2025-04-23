import React, { useState, useEffect } from 'react';
import './Trainer.css';

const trainers = [
  { id: 1, name: 'Рудик Анжеліна', experience: 5, image: '/images/trainer1.jpg' },
  { id: 2, name: 'Шахова Дарина', experience: 5, image: '/images/trainer3.jpg' },
  { id: 3, name: 'Пілатов Богдан', experience: 7, image: '/images/trainer4.jpg' },
  { id: 4, name: 'Завгородній Денис', experience: 5, image: '/images/trainer5.jpg' }
];

const LOCAL_STORAGE_KEY = 'trainerBookings';

const Trainer = () => {
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // При завантаженні зчитуємо бронювання з localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({}));
    }
  }, []);

  const handleBooking = (trainerId) => {
    const dateInput = document.getElementById(`date${trainerId}`);
    const timeSelect = document.getElementById(`time${trainerId}`);
    const date = dateInput.value;
    const time = timeSelect.value;

    if (!date || !time) {
      setModalMessage('⚠️ Будь ласка, оберіть дату і час.');
      setIsModalOpen(true);
      return;
    }

    // Зчитуємо бронювання з localStorage
    const currentBookings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    const trainerBookings = currentBookings[trainerId] || [];

    const isAlreadyBooked = trainerBookings.some(
      booking => booking.date === date && booking.time === time
    );

    if (isAlreadyBooked) {
      setModalMessage(`Цей час вже заброньований для тренера! (${date} о ${time})`);
    } else {
      // Оновлюємо список бронювань для тренера
      const updatedTrainerBookings = [...trainerBookings, { date, time }];
      const updatedBookings = {
        ...currentBookings,
        [trainerId]: updatedTrainerBookings
      };

      // Оновлюємо localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBookings));

      setModalMessage(`Ви успішно записались до тренера на ${date} о ${time}`);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  return (
    <section id="trainers">
      <h2>Тренери</h2>

      <div className="trainer-container">
        {trainers.map(trainer => (
          <div key={trainer.id} className="trainer-card">
            <img src={trainer.image} alt={`Тренер ${trainer.name}`} />
            <h3>{trainer.name}</h3>
            <p>Досвід: {trainer.experience} років</p>

            <label htmlFor={`date${trainer.id}`} className="date-label"><strong>Дата:</strong></label>
            <input type="date" id={`date${trainer.id}`} className="date-picker" />
            <p></p>

            <label htmlFor={`time${trainer.id}`}><strong>Час:</strong></label>
            <select id={`time${trainer.id}`} className="time-select">
              <option value="">Оберіть час</option>
              {['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <p></p>

            <button className="choose-btn" onClick={() => handleBooking(trainer.id)}>Обрати</button>
          </div>
        ))}
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

export default Trainer;
