import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Register = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/trainer');
      onClose(); // Закрити модальне вікно після реєстрації
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Реєстрація</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
};

export default Register;
