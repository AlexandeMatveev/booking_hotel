// src/components/MyBookings.jsx
import { useState, useEffect } from 'react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/bookingsg', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Требуется авторизация');
        }
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке бронирований:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка отмены');
      }

      // Обновляем список бронирований
      fetchMyBookings();
      alert('Бронирование успешно отменено!');
      
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Загрузка бронирований...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Мои бронирования</h1>
      
      {error ? (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={fetchMyBookings} style={styles.retryButton}>
            Попробовать снова
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>У вас еще нет бронирований</h3>
          <p>Найдите подходящий отель и забронируйте его!</p>
        </div>
      ) : (
        <>
          <p style={styles.summary}>Всего бронирований: {bookings.length}</p>
          <div style={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <h3>Бронирование #{booking.id}</h3>
                  <span style={getStatusStyle(booking.status)}>
                    {booking.status === 'confirmed' ? '✅ Подтверждено' : '⏳ Ожидание'}
                  </span>
                </div>
                
                <div style={styles.bookingDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Дата заезда:</span>
                    <span style={styles.detailValue}>
                      {formatDate(booking.date_from)}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Дата выезда:</span>
                    <span style={styles.detailValue}>
                      {formatDate(booking.date_to)}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Количество дней:</span>
                    <span style={styles.detailValue}>{booking.total_days}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Стоимость за ночь:</span>
                    <span style={styles.detailValue}>{booking.price} ₽</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Общая стоимость:</span>
                    <span style={styles.totalCost}>{booking.total_cost} ₽</span>
                  </div>
                </div>
                
                <div style={styles.bookingActions}>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    style={styles.cancelButton}
                    disabled={new Date(booking.date_from) <= new Date()}
                  >
                    Отменить бронирование
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const getStatusStyle = (status) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '600',
  backgroundColor: status === 'confirmed' ? '#d4edda' : '#fff3cd',
  color: status === 'confirmed' ? '#155724' : '#856404',
});

const styles = {
  container: {
    maxWidth: '1000px',
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
  summary: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '1.1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginTop: '40px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    opacity: 0.5,
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  bookingCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    ':hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#666',
    fontSize: '0.95rem',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  totalCost: {
    color: '#28a745',
    fontWeight: '700',
    fontSize: '1.2rem',
  },
  bookingActions: {
    textAlign: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    ':hover:not(:disabled)': {
      backgroundColor: '#c82333',
    },
    ':disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
};