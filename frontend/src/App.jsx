
// src/App.jsx

import { useState, useEffect } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import SearchHotels from './components/SearchHotels';  // ← новая страница

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8000/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('search');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {}
    setUser(null);
    setPage('home');
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setPage('home')}>Главная</button>
        {user && (
          <>
            <button onClick={() => setPage('profile')}>Профиль</button>
            <button onClick={() => setPage('search')}>Поиск отелей</button>
          </>
        )}
        {user ? (
          <button onClick={handleLogout}>Выйти</button>
        ) : (
          <button onClick={() => setPage('home')}>Войти</button>
        )}
      </nav>

      {page === 'home' && !user && <Login onLogin={handleLogin} />}
      {page === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
      {page === 'search' && <SearchHotels />}
    </div>
  );
}

const navStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};