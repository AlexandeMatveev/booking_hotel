// src/components/HomePage.jsx
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/hotels', {
        credentials: 'include' // если нужна авторизация
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке отелей:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка отелей...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>Ошибка: {error}</p>
        <button onClick={fetchHotels}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Рекомендуемые отели</h1>
      
      {hotels.length === 0 ? (
        <p style={styles.noHotels}>Нет доступных отелей</p>
      ) : (
        <div style={styles.hotelGrid}>
          {hotels.map((hotel) => (
            <div key={hotel.id} style={styles.hotelCard}>
              <h3 style={styles.hotelName}>{hotel.name}</h3>
              {hotel.location && (
                <p style={styles.hotelLocation}>
                  📍 {hotel.location}
                </p>
              )}
              {hotel.description && (
                <p style={styles.hotelDescription}>{hotel.description}</p>
              )}
              {hotel.price_per_night && (
                <p style={styles.hotelPrice}>
                  💰 {hotel.price_per_night} руб./ночь
                </p>
              )}
              {hotel.rating && (
                <p style={styles.hotelRating}>
                  ⭐ {hotel.rating}/10
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: 'red',
  },
  noHotels: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  hotelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  hotelCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
  },
  hotelName: {
    margin: '0 0 10px 0',
    color: '#007bff',
    fontSize: '1.2em',
  },
  hotelLocation: {
    color: '#666',
    margin: '0 0 10px 0',
    fontSize: '0.9em',
  },
  hotelDescription: {
    color: '#333',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
  },
  hotelPrice: {
    color: '#28a745',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  },
  hotelRating: {
    color: '#ffc107',
    fontWeight: 'bold',
    margin: 0,
  },
};