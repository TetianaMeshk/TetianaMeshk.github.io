import React, { useEffect, useState } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(storedReviews);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newReview = { name, text, date: new Date().toLocaleString() };
    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    setName('');
    setText('');
  };

  return (
    <>
      {/* Форма відгуку */}
      <section className="review-form-container">
        <h2>Залишити відгук</h2>
        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Ваш відгук"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Надіслати</button>
        </form>
      </section>

      {/* Список відгуків */}
      <section className="review-list-container">
        <h2>Відгуки</h2>
        <div className="review-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">– {review.name}, {review.date}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Reviews;
