import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import reliefCentersData from '../data/reliefCenters.json';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface Resource {
  available: boolean;
  quantity: string;
}

interface ReliefCenter {
  id: number;
  name: string;
  location: string;
  resources: {
    water: Resource;
    food: Resource;
    medicalSupplies: Resource;
    clothing: Resource;
    blankets: Resource;
  };
  openHours: string;
  lastUpdated: string;
}

interface CenterStatus {
  visited: boolean;
  notes: string;
}

function ReliefCenters() {
  const [centers, setCenters] = useState<ReliefCenter[]>(reliefCentersData);
  const [centerStatuses, setCenterStatuses] = useState<Record<number, CenterStatus>>({});

  useEffect(() => {
    const savedStatuses = getFromLocalStorage('centerStatuses', {});
    setCenterStatuses(savedStatuses);
  }, []);

  const toggleVisited = (centerId: number) => {
    const newStatuses = {
      ...centerStatuses,
      [centerId]: {
        visited: !centerStatuses[centerId]?.visited,
        notes: centerStatuses[centerId]?.notes || ''
      }
    };
    setCenterStatuses(newStatuses);
    saveToLocalStorage('centerStatuses', newStatuses);
  };

  const updateNotes = (centerId: number, notes: string) => {
    const newStatuses = {
      ...centerStatuses,
      [centerId]: {
        visited: centerStatuses[centerId]?.visited || false,
        notes
      }
    };
    setCenterStatuses(newStatuses);
    saveToLocalStorage('centerStatuses', newStatuses);
  };

  const getResourceIcon = (available: boolean, quantity: string) => {
    if (!available || quantity === 'Out of Stock') {
      return <XCircle size={18} color="#ef4444" />;
    } else if (quantity === 'Low') {
      return <AlertCircle size={18} color="#f59e0b" />;
    } else {
      return <CheckCircle size={18} color="#10b981" />;
    }
  };

  const getQuantityColor = (available: boolean, quantity: string) => {
    if (!available || quantity === 'Out of Stock') return '#ef4444';
    if (quantity === 'Low') return '#f59e0b';
    if (quantity === 'Medium') return '#3b82f6';
    return '#10b981';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#3b82f6', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Relief Distribution Centers</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Track available resources and distribution points</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {centers.map((center) => {
            const status = centerStatuses[center.id] || { visited: false, notes: '' };
            return (
              <div
                key={center.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: status.visited ? '2px solid #10b981' : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                      {center.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', marginBottom: '4px' }}>
                      <MapPin size={16} style={{ marginRight: '8px' }} />
                      <span style={{ fontSize: '14px' }}>{center.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                      <Clock size={16} style={{ marginRight: '8px' }} />
                      <span style={{ fontSize: '14px' }}>{center.openHours}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVisited(center.id)}
                    style={{
                      padding: '10px 20px',
                      background: status.visited ? '#10b981' : '#e5e7eb',
                      color: status.visited ? 'white' : '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.2s'
                    }}
                  >
                    {status.visited ? 'Visited ✓' : 'Mark as Visited'}
                  </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    Available Resources
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                    {Object.entries(center.resources).map(([resourceName, resource]) => (
                      <div
                        key={resourceName}
                        style={{
                          padding: '12px',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {getResourceIcon(resource.available, resource.quantity)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize', marginBottom: '2px' }}>
                            {resourceName.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: getQuantityColor(resource.available, resource.quantity)
                          }}>
                            {resource.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Notes
                  </label>
                  <textarea
                    value={status.notes}
                    onChange={(e) => updateNotes(center.id, e.target.value)}
                    placeholder="Add notes about this center..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '60px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  Last updated: {new Date(center.lastUpdated).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReliefCenters;
