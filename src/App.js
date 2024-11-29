import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import Info from './components/info/info';
import Header from './components/header/header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<div className="home"><Home /></div>} />
      <Route path="/info" element={<div className="info"><Info /></div>} /> 
      </Routes>
    </Router>
  );
};

export default App;
