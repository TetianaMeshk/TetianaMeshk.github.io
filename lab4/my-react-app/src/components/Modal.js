import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const Modal = ({ isOpen, closeModal }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [name, setName]             = useState('');
  const [error, setError]           = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleToggleForm = () => {
    setError('');
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      closeModal();
      /* navigate('/profile'); перекидає одразу у вікно профілю*/
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Невірна пошта або пароль');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Цей email вже використовується');
      } else {
        setError('Сталася помилка. Спробуйте пізніше');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>✖</button>
        <h2>{isRegistering ? 'Реєстрація' : 'Вхід'}</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <label>
              Ваше ім'я:
              <input
                type="text"
                name="name"
                placeholder="Введіть ваше ім'я"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            Пошта:
            <input
              type="email"
              name="email"
              placeholder="Введіть вашу пошту"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <label>
            Пароль:
            <input
              type="password"
              name="password"
              placeholder="Введіть ваш пароль"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">
            {isRegistering ? 'Зареєструватись' : 'Увійти'}
          </button>

          <div className="or-text"><p>або</p></div>
          <div className="toggle-form">
            <p>
              {isRegistering
                ? 'Маєте обліковий запис?'
                : 'Ще не зареєстровані?'}{' '}
              <button type="button" onClick={handleToggleForm}>
                {isRegistering ? 'Увійти' : 'Зареєструватись'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
