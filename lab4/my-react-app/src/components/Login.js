import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 📧 Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/trainer');
      onClose();
    } catch (error) {
      console.error("Помилка входу:", error.message);
    }
  };

  // 🔐 Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/trainer');
      onClose();
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Вхід</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Увійти</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin} style={{ marginTop: '10px' }}>
        Увійти через Google
      </button>
    </div>
  );
};

export default Login;
