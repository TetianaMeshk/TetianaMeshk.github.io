import React, { useState, useEffect } from 'react';
import './Trainer.css';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs
} from 'firebase/firestore';

const trainers = [
  { id: 1, name: 'Рудик Анжеліна', experience: 5, image: '/images/trainer1.jpg' },
  { id: 2, name: 'Шахова Дарина', experience: 5, image: '/images/trainer3.jpg' },
  { id: 3, name: 'Пілатов Богдан', experience: 7, image: '/images/trainer4.jpg' },
  { id: 4, name: 'Завгородній Денис', experience: 5, image: '/images/trainer5.jpg' },
  { id: 5, name: 'Андрій Тепляков', experience: 5, image: '/images/trainer2.jpg' }
];

const Trainer = () => {
  const { currentUser } = useAuth();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [today, setToday] = useState('');
  const VISIBLE_CARDS = 4;

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setToday(`${year}-${month}-${day}`);
  }, []);

  const handleBooking = async (trainerId) => {
    if (!currentUser) {
      setModalMessage('Для доступу потрібно авторизуватись');
      setIsModalOpen(true);
      return;
    }

    const dateInput = document.getElementById(`date${trainerId}`);
    const timeSelect = document.getElementById(`time${trainerId}`);
    const date = dateInput.value;
    const time = timeSelect.value;

    if (!date || !time) {
      setModalMessage('⚠️ Будь ласка, оберіть дату і час.');
      setIsModalOpen(true);
      return;
    }

    const usersCollection = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersCollection);
      let isTimeTaken = false;
      let isCurrentUserBooked = false;

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const trainings = data.trainings || [];

        trainings.forEach(training => {
          if (training.date === date && training.time === time) {
            if (docSnap.id === currentUser.uid) {
              isCurrentUserBooked = true;
            } else if (training.trainerId === trainerId) {
              isTimeTaken = true;
            }
          }
        });
      });

      if (isTimeTaken) {
        setModalMessage('❌ Цей час вже заброньований іншим користувачем.');
        setIsModalOpen(true);
        return;
      }

      if (isCurrentUserBooked) {
        setModalMessage('⚠️ Ви вже записались на цей час.');
        setIsModalOpen(true);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, { trainings: [] });
      }

      await updateDoc(userDocRef, {
        trainings: arrayUnion({
          trainerId,
          trainerName: trainers.find(t => t.id === trainerId)?.name,
          date,
          time
        })
      });

      setModalMessage(`✅ Ви записалися на тренування ${date} о ${time}`);
      setIsModalOpen(true);

    } catch (error) {
      console.error(error);
      setModalMessage('Сталася помилка при бронюванні.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % trainers.length);

  const getVisibleTrainers = () => {
    return Array.from({ length: VISIBLE_CARDS }, (_, i) => trainers[(currentIndex + i) % trainers.length]);
  };

  return (
    <section id="trainers">
      <h2>Тренери</h2>
      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={prevSlide}>←</button>
        <div className="trainer-carousel">
          {getVisibleTrainers().map(trainer => (
            <div key={trainer.id} className="trainer-card">
              <img src={trainer.image} alt={trainer.name} />
              <h3>{trainer.name}</h3>
              <p>Досвід: {trainer.experience} років</p>

              <label htmlFor={`date${trainer.id}`}><strong>Дата:</strong></label>
              <input
                type="date"
                id={`date${trainer.id}`}
                className="date-picker"
                min={today}
              />

              <label htmlFor={`time${trainer.id}`}><strong>Час:</strong></label>
              <select id={`time${trainer.id}`} className="time-select">
                <option value="">Оберіть час</option>
                {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <button className="choose" onClick={() => handleBooking(trainer.id)}>Обрати</button>
            </div>
          ))}
        </div>
        <button className="carousel-btn right" onClick={nextSlide}>→</button>
      </div>

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
