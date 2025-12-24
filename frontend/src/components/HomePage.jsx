// src/components/HomePage.jsx
import { useState, useEffect } from 'react';

export default function HomePage({ onBookClick }) {
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
        credentials: 'include'
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

  const handleBookClick = (hotel) => {
    if (onBookClick) {
      onBookClick(hotel);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка отелей...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>Ошибка: {error}</p>
        <button onClick={fetchHotels} style={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏨 Рекомендуемые отели</h1>
      
      {hotels.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.noHotels}>Нет доступных отелей</p>
          <button onClick={fetchHotels} style={styles.retryButton}>
            Обновить список
          </button>
        </div>
      ) : (
        <div style={styles.hotelGrid}>
          {hotels.map((hotel) => (
            <div key={hotel.id} style={styles.hotelCard}>
              <div style={styles.hotelHeader}>
                <h3 style={styles.hotelName}>{hotel.name}</h3>
                {hotel.rating && (
                  <div style={styles.ratingBadge}>
                    ⭐ {hotel.rating.toFixed(1)}
                  </div>
                )}
              </div>
              
              {hotel.location && (
                <p style={styles.hotelLocation}>
                  📍 {hotel.location}
                </p>
              )}
              
              {hotel.description && (
                <p style={styles.hotelDescription}>{hotel.description}</p>
              )}
              
              <div style={styles.hotelFooter}>
                {hotel.price_per_night && (
                  <div style={styles.priceContainer}>
                    <span style={styles.priceLabel}>от</span>
                    <span style={styles.hotelPrice}>
                      {hotel.price_per_night} ₽
                    </span>
                    <span style={styles.pricePeriod}>/ночь</span>
                  </div>
                )}
                
                <button
                  onClick={() => handleBookClick(hotel)}
                  style={styles.bookButton}
                >
                  Забронировать
                </button>
              </div>
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
    fontSize: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    color: '#dc2626',
    margin: '20px 0',
  },
  retryButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noHotels: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
  },
  hotelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  hotelCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    ':hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  hotelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  hotelName: {
    margin: '0',
    color: '#1a1a1a',
    fontSize: '1.3rem',
    fontWeight: '600',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#ffd700',
    color: '#333',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  hotelLocation: {
    color: '#666',
    margin: '0 0 15px 0',
    fontSize: '0.95rem',
  },
  hotelDescription: {
    color: '#555',
    margin: '0 0 20px 0',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    flex: 1,
  },
  hotelFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  priceLabel: {
    color: '#666',
    fontSize: '0.85rem',
  },
  hotelPrice: {
    color: '#28a745',
    fontWeight: '700',
    fontSize: '1.4rem',
  },
  pricePeriod: {
    color: '#666',
    fontSize: '0.85rem',
  },
  bookButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    ':hover': {
      backgroundColor: '#218838',
    },
  },
};