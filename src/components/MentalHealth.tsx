import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Smile, Meh, Frown, Clock, Play, Pause } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface MoodEntry {
  id: string;
  date: string;
  mood: 'Happy' | 'Okay' | 'Sad' | 'Stressed';
  note: string;
}

const motivationalQuotes = [
  {
    text: "Every storm runs out of rain. You will get through this.",
    author: "Maya Angelou"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "The darkest nights produce the brightest stars.",
    author: "Unknown"
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day at a time.",
    author: "Unknown"
  },
  {
    text: "Hope is being able to see that there is light despite all of the darkness.",
    author: "Desmond Tutu"
  },
  {
    text: "The human spirit is stronger than anything that can happen to it.",
    author: "C.C. Scott"
  },
  {
    text: "Together we are stronger. We will rebuild.",
    author: "Community Support"
  },
  {
    text: "It's okay to not be okay. Reach out, talk, and heal together.",
    author: "Mental Health Support"
  },
  {
    text: "Small steps every day lead to big changes over time.",
    author: "Unknown"
  }
];

function MentalHealth() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | ''>('');
  const [moodNote, setMoodNote] = useState('');
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);

  useEffect(() => {
    const savedEntries = getFromLocalStorage('moodEntries', []);
    setMoodEntries(savedEntries);

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === 'inhale') return 'hold';
              if (phase === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [breathingActive]);

  const saveMoodEntry = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      note: moodNote
    };

    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    saveToLocalStorage('moodEntries', updatedEntries);
    setSelectedMood('');
    setMoodNote('');
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Happy': return <Smile size={24} color="#10b981" />;
      case 'Okay': return <Meh size={24} color="#3b82f6" />;
      case 'Sad': return <Frown size={24} color="#f59e0b" />;
      case 'Stressed': return <Frown size={24} color="#ef4444" />;
      default: return null;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Happy': return '#10b981';
      case 'Okay': return '#3b82f6';
      case 'Sad': return '#f59e0b';
      case 'Stressed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#f59e0b';
      case 'exhale': return '#10b981';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#ec4899', color: 'white', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none', marginBottom: '16px' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>Mental Health & Emotional Support</h1>
          <p style={{ marginTop: '8px', opacity: 0.9 }}>Track your mood and find emotional wellness resources</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
          color: 'white',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '32px',
          boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Heart size={40} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '20px', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '12px' }}>
              "{currentQuote.text}"
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              — {currentQuote.author}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          <div>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                Breathing Exercise
              </h2>
              <div style={{
                textAlign: 'center',
                padding: '32px'
              }}>
                <div
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: getBreathingColor(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    transition: 'transform 1s, background 1s',
                    transform: breathingActive && breathingPhase === 'inhale' ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                >
                  {breathingActive ? breathingTimer : '4'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                  {breathingActive ? getBreathingInstruction() : 'Ready to Begin'}
                </div>
                <button
                  onClick={() => {
                    setBreathingActive(!breathingActive);
                    if (!breathingActive) {
                      setBreathingPhase('inhale');
                      setBreathingTimer(4);
                    }
                  }}
                  style={{
                    padding: '12px 32px',
                    background: breathingActive ? '#ef4444' : '#ec4899',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  {breathingActive ? (
                    <>
                      <Pause size={20} />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Start
                    </>
                  )}
                </button>
                <p style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
                  4 seconds inhale, 4 seconds hold, 4 seconds exhale
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                Track Your Mood
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                  How are you feeling today?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {(['Happy', 'Okay', 'Sad', 'Stressed'] as const).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      style={{
                        padding: '16px',
                        background: selectedMood === mood ? getMoodColor(mood) + '20' : '#f9fafb',
                        border: selectedMood === mood ? `2px solid ${getMoodColor(mood)}` : '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {getMoodIcon(mood)}
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {mood}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Add a note (optional)
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                onClick={saveMoodEntry}
                disabled={!selectedMood}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: selectedMood ? '#ec4899' : '#e5e7eb',
                  color: selectedMood ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedMood ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Save Mood Entry
              </button>
            </div>
          </div>

          <div>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                Your Mood History
              </h2>

              {moodEntries.length === 0 ? (
                <div style={{
                  padding: '48px 20px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <p style={{ fontSize: '16px' }}>No mood entries yet. Start tracking your emotional wellness today.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                  {moodEntries.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${getMoodColor(entry.mood)}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getMoodIcon(entry.mood)}
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {entry.mood}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
                          <Clock size={14} />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.note && (
                        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                          {entry.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              marginTop: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                Emergency Support
              </h3>
              <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.7' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Crisis Hotline:</strong> 1-800-CRISIS-1
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Mental Health Support:</strong> 1-800-SUPPORT
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Text Support:</strong> Text "HELP" to 741741
                </p>
                <p style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '6px', fontSize: '13px' }}>
                  Remember: It's okay to not be okay. Reach out for help when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentalHealth;
