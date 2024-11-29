import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink
          to="/info"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Character Information
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
