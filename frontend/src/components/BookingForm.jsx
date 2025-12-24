// src/components/BookingForm.jsx
import { useState } from 'react';

export default function BookingForm({ 
  hotelId, 
  hotelPrice, 
  hotelName, 
  onClose, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    room_id: hotelId,
    date_from: '',
    date_to: '',
    guests: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Рассчитываем стоимость
  const calculatePrice = () => {
    if (!formData.date_from || !formData.date_to) return 0;
    
    const from = new Date(formData.date_from);
    const to = new Date(formData.date_to);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * hotelPrice : 0;
  };

  const totalPrice = calculatePrice();
  const totalDays = totalPrice / hotelPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка бронирования');
      }

      const bookingData = await response.json();
      
      // Показываем уведомление об успехе
      alert(`✅ Бронирование #${bookingData.id} успешно создано!`);
      
      if (onSuccess) onSuccess(bookingData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Минимальная дата - завтра
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.modalTitle}>Бронирование отеля</h3>
            <p style={styles.hotelInfo}>{hotelName}</p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <div style={styles.dateGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Дата заезда *</label>
              <input
                type="date"
                name="date_from"
                value={formData.date_from}
                onChange={handleChange}
                min={minDate}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Дата выезда *</label>
              <input
                type="date"
                name="date_to"
                value={formData.date_to}
                onChange={handleChange}
                min={formData.date_from || minDate}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Количество гостей</label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              style={styles.select}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
                </option>
              ))}
            </select>
          </div>

          {totalPrice > 0 && (
            <div style={styles.priceSummary}>
              <div style={styles.priceRow}>
                <span>{hotelPrice} ₽ × {totalDays} ночей</span>
                <span>{totalPrice} ₽</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Итого к оплате:</span>
                <span style={styles.totalPrice}>{totalPrice} ₽</span>
              </div>
            </div>
          )}

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading || !formData.date_from || !formData.date_to}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Обработка...
                </>
              ) : (
                'Подтвердить бронирование'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e8e8e8',
  },
  modalTitle: {
    margin: '0 0 4px 0',
    fontSize: '1.4rem',
    color: '#333',
  },
  hotelInfo: {
    margin: 0,
    color: '#666',
    fontSize: '0.95rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#999',
    lineHeight: 1,
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
    fontSize: '0.95rem',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
    },
  },
  select: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer',
    ':focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
    },
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  priceSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '8px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: '#666',
    fontSize: '0.95rem',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #dee2e6',
    fontWeight: '600',
  },
  totalLabel: {
    color: '#333',
  },
  totalPrice: {
    color: '#28a745',
    fontSize: '1.2rem',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f8f9fa',
    color: '#333',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover:not(:disabled)': {
      backgroundColor: '#e9ecef',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
    fontWeight: '600',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ':hover:not(:disabled)': {
      backgroundColor: '#218838',
    },
    ':disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
    },
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};