// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import HomePage from './components/HomePage';
import MyBookings from './components/MyBookings';
import BookingForm from './components/BookingForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

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
    setPage('home');
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
    setShowBookingForm(false);
  };

  const handleOpenBookingForm = (hotel) => {
    if (!user) {
      alert('Для бронирования необходимо войти в систему');
      setPage('home');
      return;
    }
    setSelectedHotel(hotel);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedHotel(null);
  };

  const handleBookingSuccess = () => {
    alert('Бронирование успешно создано!');
    handleCloseBookingForm();
    setPage('bookings');
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setPage('home')}>
          {user ? '🏠 Главная' : '🏠 Войти'}
        </button>
        {user && (
          <>
            <button onClick={() => setPage('profile')}>👤 Профиль</button>
            <button onClick={() => setPage('bookings')}>📋 Мои бронирования</button>
          </>
        )}
        {user ? (
          <button onClick={handleLogout}>🚪 Выйти</button>
        ) : (
          <button onClick={() => setPage('home')}>🔑 Войти</button>
        )}
      </nav>

      {showBookingForm && selectedHotel && (
        <BookingForm
          hotelId={selectedHotel.id}
          hotelPrice={selectedHotel.price_per_night}
          hotelName={selectedHotel.name}
          onClose={handleCloseBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}

      {page === 'home' && !user && <Login onLogin={handleLogin} />}
      {page === 'home' && user && <HomePage onBookClick={handleOpenBookingForm} />}
      {page === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
      {page === 'bookings' && user && <MyBookings />}
    </div>
  );
}

const navStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '20px',
};