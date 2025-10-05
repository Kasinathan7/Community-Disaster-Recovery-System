import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Star, Filter } from 'lucide-react';
import healthTipsData from '../data/healthTips.json';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface HealthTip {
  id: number;
  category: string;
  title: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface TipStatus {
  read: boolean;
  important: boolean;
}

function HealthTips() {
  const [tips] = useState<HealthTip[]>(healthTipsData);
  const [tipStatuses, setTipStatuses] = useState<Record<number, TipStatus>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  useEffect(() => {
    const savedStatuses = getFromLocalStorage('healthTipStatuses', {});
    setTipStatuses(savedStatuses);
  }, []);

  const updateTipStatus = (tipId: number, field: keyof TipStatus) => {
    const currentStatus = tipStatuses[tipId] || { read: false, important: false };
    const newStatuses = {
      ...tipStatuses,
      [tipId]: {
        ...currentStatus,
        [field]: !currentStatus[field]
      }
    };
    setTipStatuses(newStatuses);
    saveToLocalStorage('healthTipStatuses', newStatuses);
  };

  const categories = ['All', ...Array.from(new Set(tips.map(tip => tip.category)))];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const filteredTips = tips.filter(tip => {
    const categoryMatch = selectedCategory === 'All' || tip.category === selectedCategory;
    const priorityMatch = selectedPriority === 'All' || tip.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    return '🏥';
  };

  const readCount = Object.values(tipStatuses).filter(s => s.read).length;
  const importantCount = Object.values(tipStatuses).filter(s => s.important).length;
  const progressPercentage = tips.length > 0 ? ((readCount / tips.length) * 100).toFixed(0) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#8b5cf6', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Health & Hygiene Awareness</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Essential health and safety information</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Reading Progress</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {progressPercentage}%
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                {readCount} of {tips.length} tips read
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Important Tips</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                {importantCount}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                Marked as important
              </div>
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '12px',
            background: '#e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Filter size={20} color="#6b7280" />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Filters</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredTips.map((tip) => {
            const status = tipStatuses[tip.id] || { read: false, important: false };
            return (
              <div
                key={tip.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: status.important ? '0 4px 12px rgba(245, 158, 11, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                  border: status.important ? '2px solid #f59e0b' : '2px solid transparent',
                  opacity: status.read ? 0.8 : 1,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px' }}>{getCategoryIcon(tip.category)}</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#f3f4f6',
                        color: '#374151'
                      }}>
                        {tip.category}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getPriorityColor(tip.priority) + '20',
                        color: getPriorityColor(tip.priority)
                      }}>
                        {tip.priority} Priority
                      </span>
                      {status.read && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#d1fae5',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle size={14} />
                          Read
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                      {tip.title}
                    </h3>
                    <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>
                      {tip.content}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => updateTipStatus(tip.id, 'read')}
                    style={{
                      padding: '8px 16px',
                      background: status.read ? '#10b981' : '#e5e7eb',
                      color: status.read ? 'white' : '#1f2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckCircle size={16} />
                    {status.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => updateTipStatus(tip.id, 'important')}
                    style={{
                      padding: '8px 16px',
                      background: status.important ? '#f59e0b' : '#e5e7eb',
                      color: status.important ? 'white' : '#1f2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Star size={16} fill={status.important ? 'white' : 'none'} />
                    {status.important ? 'Remove from Important' : 'Mark as Important'}
                  </button>
                </div>

                {tip.priority === 'High' && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px'
                  }}>
                    <AlertTriangle size={24} color="#ef4444" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTips.length === 0 && (
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '16px' }}>No tips match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthTips;
