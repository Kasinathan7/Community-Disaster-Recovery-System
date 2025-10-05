import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Phone, Star, Navigation } from 'lucide-react';
import sheltersData from '../data/shelters.json';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface Shelter {
  id: number;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  contactNumber: string;
}

function Shelters() {
  const [shelters, setShelters] = useState<Shelter[]>(sheltersData);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    const savedFavorites = getFromLocalStorage('favoriteShelters', []);
    setFavorites(savedFavorites);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Using default location.');
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      setLocationError('Geolocation not supported. Using default location.');
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  const toggleFavorite = (shelterId: number) => {
    const newFavorites = favorites.includes(shelterId)
      ? favorites.filter(id => id !== shelterId)
      : [...favorites, shelterId];

    setFavorites(newFavorites);
    saveToLocalStorage('favoriteShelters', newFavorites);
  };

  const calculateDistance = (shelter: Shelter) => {
    if (!userLocation) return null;

    const R = 3959;
    const dLat = (shelter.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (shelter.coordinates.lng - userLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * Math.PI / 180) *
      Math.cos(shelter.coordinates.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1);
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 70) return '#f59e0b';
    return '#10b981';
  };

  const sortedShelters = [...shelters].sort((a, b) => {
    const distA = calculateDistance(a);
    const distB = calculateDistance(b);
    if (!distA || !distB) return 0;
    return parseFloat(distA) - parseFloat(distB);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#10b981', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Shelter & Safe Zone Locator</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Find nearby shelters and safe zones</p>
          {locationError && (
            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', fontSize: '14px' }}>
              {locationError}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
          <Navigation size={20} />
          <span style={{ fontSize: '14px' }}>
            Shelters sorted by distance {userLocation ? '(your location detected)' : '(using default location)'}
          </span>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {sortedShelters.map((shelter) => {
            const distance = calculateDistance(shelter);
            const isFavorite = favorites.includes(shelter.id);
            const occupancyPercentage = ((shelter.currentOccupancy / shelter.capacity) * 100).toFixed(0);

            return (
              <div
                key={shelter.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: isFavorite ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                  border: isFavorite ? '2px solid #10b981' : '2px solid transparent',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => toggleFavorite(shelter.id)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <Star
                    size={24}
                    fill={isFavorite ? '#f59e0b' : 'none'}
                    color={isFavorite ? '#f59e0b' : '#9ca3af'}
                  />
                </button>

                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1f2937', paddingRight: '40px' }}>
                    {shelter.name}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MapPin size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px' }}>{shelter.location}</span>
                      {distance && (
                        <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                          {distance} miles away
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Phone size={16} style={{ marginRight: '8px' }} />
                      <span style={{ fontSize: '14px' }}>{shelter.contactNumber}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Users size={18} style={{ marginRight: '8px', color: '#6b7280' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Capacity: {shelter.currentOccupancy} / {shelter.capacity}
                    </span>
                    <span style={{ marginLeft: '12px', fontSize: '13px', color: getOccupancyColor(shelter.currentOccupancy, shelter.capacity) }}>
                      ({occupancyPercentage}% full)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${occupancyPercentage}%`,
                      height: '100%',
                      background: getOccupancyColor(shelter.currentOccupancy, shelter.capacity),
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                    Available Amenities
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {shelter.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          background: '#f0fdf4',
                          color: '#166534',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Shelters;
