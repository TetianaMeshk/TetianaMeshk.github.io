import React from 'react';
import './Header.css';
import logo from './logo3.png';
import { Link } from 'react-router-dom';

const Header = () => {
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
            <li><Link to="/progress">Мій прогрес</Link></li>
            <li><Link to="/meals">Раціон</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
