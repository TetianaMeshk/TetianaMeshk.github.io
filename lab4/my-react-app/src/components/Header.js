import React, { useState } from 'react'; 
import './Header.css';
import logo from './logo3.png';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false); // Стан для показу повідомлення
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleProgressClick = () => {
    if (!currentUser) {
      // Якщо користувач не авторизований, показуємо повідомлення
      setShowAuthMessage(true);
    } else {
      // Якщо користувач авторизований, переходимо до "Мій прогрес"
      navigate('/progress');
    }
  };

  const handleAuthLinkClick = (e) => {
    e.preventDefault(); // Забороняємо стандартну поведінку посилання
    openModal();
    setShowAuthMessage(false); // Сховати повідомлення після натискання
  };

  const handleIconClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      openModal();
    }
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-title">
          <img src={logo} alt="Логотип" className="logo" />
          <h1>Моніторинг здоров'я та фізичної активності</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/trainer">Тренери</Link></li>
            <li><Link to="/training">Тренування</Link></li>
            <li>
              <button onClick={handleProgressClick}>Мій прогрес</button>
            </li>
            <li><Link to="/meals">Раціон</Link></li>
            <li><Link to="/reviews">Відгуки</Link></li>
            <li>
              <button onClick={handleIconClick}>
                <FaUserCircle size={30} className="user-icon" />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Повідомлення для неавторизованих користувачів */}
      {showAuthMessage && (
        <div className="auth-message-overlay">
          <div className="auth-message-content">
            <p>
              Для доступу до цього розділу потрібно{' '}
              <a href="/" onClick={handleAuthLinkClick}>авторизуватись</a>.
            </p>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </header>
  );
};

export default Header;
