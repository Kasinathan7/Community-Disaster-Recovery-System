import { Link } from 'react-router-dom';
import { PackageOpen, Home as HomeIcon, Users, Heart, Activity, Brain } from 'lucide-react';

function Home() {
  const modules = [
    {
      path: '/relief-centers',
      icon: PackageOpen,
      title: 'Relief Distribution',
      description: 'Track relief centers and available resources',
      color: '#3b82f6'
    },
    {
      path: '/shelters',
      icon: HomeIcon,
      title: 'Shelter Locator',
      description: 'Find nearby shelters and safe zones',
      color: '#10b981'
    },
    {
      path: '/missing-people',
      icon: Users,
      title: 'Missing People Finder',
      description: 'Report and search for missing persons',
      color: '#f59e0b'
    },
    {
      path: '/volunteers',
      icon: Heart,
      title: 'Volunteer Coordination',
      description: 'Register and manage volunteer activities',
      color: '#ef4444'
    },
    {
      path: '/health-tips',
      icon: Activity,
      title: 'Health & Hygiene',
      description: 'Essential health and safety information',
      color: '#8b5cf6'
    },
    {
      path: '/mental-health',
      icon: Brain,
      title: 'Mental Health Support',
      description: 'Emotional support and wellness resources',
      color: '#ec4899'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px', color: 'white' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            CDRS
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95 }}>
            Community Disaster Recovery System
          </p>
          <p style={{ fontSize: '16px', marginTop: '8px', opacity: 0.85 }}>
            Coordinating relief, recovery, and resilience — together.
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  textDecoration: 'none',
                  color: '#1f2937',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: module.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <IconComponent size={28} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  {module.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>

        <footer style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '14px',
          opacity: 0.8,
          marginTop: '60px'
        }}>
          <p>Emergency Hotline: 1-800-DISASTER</p>
          <p style={{ marginTop: '8px' }}>All data stored locally on your device</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
