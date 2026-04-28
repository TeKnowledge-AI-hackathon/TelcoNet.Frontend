import React from 'react';
import { Search, Bookmark, Clock } from 'lucide-react';

const AIChat = () => {
  const recentQueries = [
    { title: 'Latency spike in Victoria Island', time: '5 min ago' },
    { title: 'Backhaul congestion analysis', time: '1 hour ago' },
    { title: 'Tower status Lagos region', time: '3 hours ago' },
  ];

  const savedInvestigations = [
    { title: 'Lagos West Outage - Apr 20' },
    { title: 'Ikeja Performance Report' },
  ];

  const suggestedQueries = [
    "Why is Lagos West slow?",
    "Show congested cells in Ikeja",
    "Any tower failures in last 24h?"
  ];

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#0d1117', minHeight: 0 }}>
      {/* History Sidebar */}
      <aside style={{
        width: 280, borderRight: '1px solid #30363d', padding: '1.5rem',
        background: '#0d1117', overflowY: 'auto', display: 'flex',
        flexDirection: 'column', gap: '2rem', flexShrink: 0,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 16 }}>
            <Clock size={18} />
            Recent Queries
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentQueries.map((q, i) => (
              <div key={i} className="card" style={{ cursor: 'pointer', padding: '0.875rem' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{q.title}</div>
                <div style={{ fontSize: 11, color: '#8b949e' }}>{q.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 16 }}>
            <Bookmark size={18} />
            Saved Investigations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedInvestigations.map((q, i) => (
              <div key={i} className="card" style={{ cursor: 'pointer', padding: '0.875rem' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{q.title}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main chat content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: '#0d1117',
      }}>
        <div style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12 }}>Network Intelligence</h2>
          <p style={{ color: '#8b949e', fontSize: 17, marginBottom: 36 }}>
            Ask about network issues, performance, and infrastructure status
          </p>

          <div style={{ position: 'relative', marginBottom: 28 }}>
            <div style={{
              position: 'absolute', top: '50%', left: 20,
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }}>
              <Search size={22} color="#8b949e" />
            </div>
            <input
              type="text"
              placeholder="Ask about network issues... e.g. Why is Lagos West slow?"
              style={{
                width: '100%', background: '#161b22',
                border: '1px solid #30363d', borderRadius: 16,
                padding: '22px 20px 22px 56px', fontSize: 16,
                color: '#f0f6fc', outline: 'none', boxSizing: 'border-box',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
          </div>

          <div style={{ marginBottom: 12, fontSize: 13, color: '#8b949e', fontWeight: 600 }}>
            Suggested queries:
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {suggestedQueries.map((q, i) => (
              <button
                key={i}
                style={{
                  padding: '10px 20px',
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 600,
                  color: '#3b82f6', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1c2128'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#161b22'; e.currentTarget.style.borderColor = '#30363d'; }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChat;
