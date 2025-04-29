import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/trainer');
      onClose(); // Закрити модальне вікно після входу
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Вхід</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default Login;
