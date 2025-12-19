// Profile.jsx (обновлённый)
import { useState, useEffect } from 'react';
import './Profile.css';
export default function Profile({ user, onLogout }) {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const res = await fetch('http://localhost:8000/bookings', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        };
        fetchBookings();
    }, []);


    
 return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Профиль пользователя</h2>
        <div className="profile-info">
          <p className="profile-info-item">
            <strong>ID:</strong> {user.id}
          </p>
          <p className="profile-info-item">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button onClick={onLogout} className="profile-button">
          Выйти
        </button>
      </div>
    </div>
  );
}