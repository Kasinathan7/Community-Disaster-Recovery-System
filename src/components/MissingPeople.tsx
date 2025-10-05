import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Search, CreditCard as Edit2, Check, X } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface MissingPerson {
  id: string;
  name: string;
  photoUrl: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  status: 'Missing' | 'Found' | 'Unverified';
  description: string;
  contactInfo: string;
  dateAdded: string;
}

function MissingPeople() {
  const [people, setPeople] = useState<MissingPerson[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<MissingPerson, 'id' | 'dateAdded'>>({
    name: '',
    photoUrl: '',
    lastSeenLocation: '',
    lastSeenDate: '',
    status: 'Missing',
    description: '',
    contactInfo: ''
  });

  useEffect(() => {
    const savedPeople = getFromLocalStorage('missingPeople', []);
    setPeople(savedPeople);
  }, []);

  const savePeople = (updatedPeople: MissingPerson[]) => {
    setPeople(updatedPeople);
    saveToLocalStorage('missingPeople', updatedPeople);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const updatedPeople = people.map(person =>
        person.id === editingId
          ? { ...formData, id: person.id, dateAdded: person.dateAdded }
          : person
      );
      savePeople(updatedPeople);
      setEditingId(null);
    } else {
      const newPerson: MissingPerson = {
        ...formData,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString()
      };
      savePeople([...people, newPerson]);
    }

    setFormData({
      name: '',
      photoUrl: '',
      lastSeenLocation: '',
      lastSeenDate: '',
      status: 'Missing',
      description: '',
      contactInfo: ''
    });
    setShowForm(false);
  };

  const handleEdit = (person: MissingPerson) => {
    setFormData({
      name: person.name,
      photoUrl: person.photoUrl,
      lastSeenLocation: person.lastSeenLocation,
      lastSeenDate: person.lastSeenDate,
      status: person.status,
      description: person.description,
      contactInfo: person.contactInfo
    });
    setEditingId(person.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      savePeople(people.filter(person => person.id !== id));
    }
  };

  const updateStatus = (id: string, status: MissingPerson['status']) => {
    const updatedPeople = people.map(person =>
      person.id === id ? { ...person, status } : person
    );
    savePeople(updatedPeople);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Found': return '#10b981';
      case 'Missing': return '#ef4444';
      case 'Unverified': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.lastSeenLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#f59e0b', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Missing People & Family Finder</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Report and search for missing persons</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                photoUrl: '',
                lastSeenLocation: '',
                lastSeenDate: '',
                status: 'Missing',
                description: '',
                contactInfo: ''
              });
            }}
            style={{
              padding: '12px 24px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <UserPlus size={20} />
            Add Missing Person
          </button>

          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {showForm && (
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              {editingId ? 'Edit Person' : 'Add Missing Person'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Last Seen Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastSeenLocation}
                    onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Last Seen Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.lastSeenDate}
                    onChange={(e) => setFormData({ ...formData, lastSeenDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MissingPerson['status'] })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Missing">Missing</option>
                    <option value="Found">Found</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                    Contact Info *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="Phone or email"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Physical description, clothing, distinguishing features..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {editingId ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  style={{
                    padding: '10px 24px',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredPeople.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '16px' }}>
              {searchTerm ? 'No matching entries found.' : 'No missing person reports yet. Click "Add Missing Person" to create one.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: `3px solid ${getStatusColor(person.status)}`
                }}
              >
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      background: '#e5e7eb'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '48px',
                    fontWeight: 'bold'
                  }}>
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                      {person.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getStatusColor(person.status) + '20',
                      color: getStatusColor(person.status)
                    }}>
                      {person.status}
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    <p style={{ marginBottom: '4px' }}>
                      <strong>Last Seen:</strong> {person.lastSeenLocation}
                    </p>
                    <p style={{ marginBottom: '4px' }}>
                      <strong>Date:</strong> {new Date(person.lastSeenDate).toLocaleDateString()}
                    </p>
                    <p style={{ marginBottom: '4px' }}>
                      <strong>Contact:</strong> {person.contactInfo}
                    </p>
                    {person.description && (
                      <p style={{ marginTop: '8px' }}>
                        <strong>Description:</strong> {person.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <select
                      value={person.status}
                      onChange={(e) => updateStatus(person.id, e.target.value as MissingPerson['status'])}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Missing">Missing</option>
                      <option value="Found">Found</option>
                      <option value="Unverified">Unverified</option>
                    </select>
                    <button
                      onClick={() => handleEdit(person)}
                      style={{
                        padding: '8px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MissingPeople;
