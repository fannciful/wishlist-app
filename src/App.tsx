import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishProvider } from './context/WishContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WishPage } from './components/WishPage/WishPage';

function App() {
  return (
    <Router basename="/wishlist-app">
      <WishProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wish/:id" element={<WishPage />} />
        </Routes>
      </WishProvider>
    </Router>
  );
}

export default App;