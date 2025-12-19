import { useState } from 'react';
import './SearchHotels.css';

export default function SearchHotels() {
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !dateFrom || !dateTo) return;

    setLoading(true);
    try {
      const url = new URL('http://localhost:8000/hotels');
      url.searchParams.append('location', location);
      url.searchParams.append('date_from', dateFrom);
      url.searchParams.append('date_to', dateTo);

      const res = await fetch(url, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      } else {
        console.error('Ошибка поиска');
      }
    } catch (err) {
      console.error('Сеть:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-hotels-container">
      <h1 className="search-title">Поиск отелей</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label>Локация</label>
          <input
            type="text"
            placeholder="Например: Сочи"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дата заезда</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Дата выезда</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Ищем...' : 'Поиск'}
        </button>
      </form>

      {hotels.length > 0 && (
        <div className="hotels-results">
          <h2 className="results-title">Найденные отели</h2>
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <img
                  src={`https://picsum.photos/seed/${hotel.image_id || hotel.id}/400/200`}
                  alt={hotel.name}
                  className="hotel-image"
                />
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <p className="hotel-rooms">
                    Свободно: <strong>{hotel.rooms_available}</strong> номер(ов)
                  </p>
                  <div className="hotel-services">
                    {hotel.services?.map((service, idx) => (
                      <span key={idx} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}