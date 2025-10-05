import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  email: string;
  phone: string;
  dateRegistered: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  completed: boolean;
  category: string;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Debris Cleanup - Main Street',
    description: 'Remove debris and fallen trees from Main Street area',
    priority: 'High',
    assignedTo: '',
    completed: false,
    category: 'Cleanup'
  },
  {
    id: '2',
    title: 'Food Distribution - Community Center',
    description: 'Help distribute food packages at the community center',
    priority: 'High',
    assignedTo: '',
    completed: false,
    category: 'Supply Delivery'
  },
  {
    id: '3',
    title: 'Medical Supply Sorting',
    description: 'Sort and organize medical supplies at the warehouse',
    priority: 'Medium',
    assignedTo: '',
    completed: false,
    category: 'Supply Delivery'
  },
  {
    id: '4',
    title: 'Shelter Setup - Lincoln High',
    description: 'Set up cots and organize shelter spaces',
    priority: 'High',
    assignedTo: '',
    completed: false,
    category: 'Rebuilding'
  },
  {
    id: '5',
    title: 'Water Distribution Points',
    description: 'Staff water distribution points across the city',
    priority: 'High',
    assignedTo: '',
    completed: false,
    category: 'Supply Delivery'
  },
  {
    id: '6',
    title: 'Building Damage Assessment',
    description: 'Help assess and document building damage in East District',
    priority: 'Medium',
    assignedTo: '',
    completed: false,
    category: 'Rebuilding'
  },
  {
    id: '7',
    title: 'Street Cleanup - Oak Avenue',
    description: 'Clear debris from residential streets in Oak Avenue',
    priority: 'Medium',
    assignedTo: '',
    completed: false,
    category: 'Cleanup'
  },
  {
    id: '8',
    title: 'Emergency Phone Bank',
    description: 'Answer emergency hotline calls and provide information',
    priority: 'High',
    assignedTo: '',
    completed: false,
    category: 'Supply Delivery'
  },
  {
    id: '9',
    title: 'Temporary Housing Setup',
    description: 'Help set up temporary housing units in Memorial Park',
    priority: 'Medium',
    assignedTo: '',
    completed: false,
    category: 'Rebuilding'
  },
  {
    id: '10',
    title: 'Park Cleanup Initiative',
    description: 'Clean and restore community parks and green spaces',
    priority: 'Low',
    assignedTo: '',
    completed: false,
    category: 'Cleanup'
  }
];

function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    availability: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const savedVolunteers = getFromLocalStorage('volunteers', []);
    const savedTasks = getFromLocalStorage('volunteerTasks', defaultTasks);
    setVolunteers(savedVolunteers);
    setTasks(savedTasks);
  }, []);

  const saveVolunteers = (updatedVolunteers: Volunteer[]) => {
    setVolunteers(updatedVolunteers);
    saveToLocalStorage('volunteers', updatedVolunteers);
  };

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    saveToLocalStorage('volunteerTasks', updatedTasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      name: formData.name,
      skills: formData.skills.split(',').map(s => s.trim()),
      availability: formData.availability,
      email: formData.email,
      phone: formData.phone,
      dateRegistered: new Date().toISOString()
    };
    saveVolunteers([...volunteers, newVolunteer]);
    setFormData({ name: '', skills: '', availability: '', email: '', phone: '' });
    setShowForm(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#ef4444', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Volunteer Coordination</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Register and manage volunteer activities</p>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={28} color="#ef4444" />
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>Overall Progress</h2>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>
              {progressPercentage}%
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '16px',
            background: '#e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
                Volunteers ({volunteers.length})
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <UserPlus size={18} />
                Register
              </button>
            </div>

            {showForm && (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                  Volunteer Registration
                </h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '12px' }}>
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

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                      Skills (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g., Medical, Construction, Logistics"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                      Availability *
                    </label>
                    <select
                      required
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select...</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Weekends">Weekends Only</option>
                      <option value="As needed">As Needed</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {volunteers.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No volunteers registered yet
                </div>
              ) : (
                volunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                      {volunteer.name}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      <p><strong>Availability:</strong> {volunteer.availability}</p>
                      <p><strong>Email:</strong> {volunteer.email}</p>
                      <p><strong>Phone:</strong> {volunteer.phone}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {volunteer.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
              Tasks ({tasks.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    opacity: task.completed ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        marginTop: '2px'
                      }}
                    >
                      {task.completed ? (
                        <CheckCircle size={24} color="#10b981" />
                      ) : (
                        <Circle size={24} color="#9ca3af" />
                      )}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: getPriorityColor(task.priority) + '20',
                          color: getPriorityColor(task.priority)
                        }}>
                          {task.priority}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                        {task.description}
                      </p>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Category: {task.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Volunteers;
