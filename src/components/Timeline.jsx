import React from 'react';

const events = [
  {
    time: '16:45',
    title: 'Secondary backhaul activated',
    desc: '40% of traffic rerouted to backup fiber link',
    severity: 'resolved',
    badge: null,
  },
  {
    time: '16:30',
    title: 'Repair team dispatched',
    desc: 'Field engineers en route to tower LW-099',
    severity: 'action',
    badge: null,
  },
  {
    time: '15:15',
    title: 'High latency alert triggered',
    desc: 'Average latency exceeded 400ms threshold in Lagos West region',
    severity: 'high',
    badge: 'High',
  },
  {
    time: '14:45',
    title: 'Congestion detected',
    desc: 'Backhaul link capacity reached 92% - automatic alerts sent to NOC',
    severity: 'warning',
    badge: null,
  },
  {
    time: '14:23',
    title: 'Tower LW-099 offline',
    desc: 'Power supply failure during grid outage. Backup generator failed to start.',
    severity: 'critical',
    badge: 'Critical',
  },
  {
    time: '14:15',
    title: 'Grid power outage detected',
    desc: 'Brief power outage in Lagos West sector',
    severity: 'warning',
    badge: null,
  },
  {
    time: '12:00',
    title: 'Routine capacity check',
    desc: 'All systems operating within normal parameters',
    severity: 'info',
    badge: null,
  },
];

const severityStyles = {
  resolved: {
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    title: '#10b981',
    dot: '#10b981',
  },
  action: {
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    title: '#3b82f6',
    dot: '#3b82f6',
  },
  high: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    title: '#f59e0b',
    dot: '#f59e0b',
  },
  warning: {
    bg: 'rgba(202,138,4,0.07)',
    border: 'rgba(202,138,4,0.25)',
    title: '#ca8a04',
    dot: '#ca8a04',
  },
  critical: {
    bg: 'rgba(248,81,73,0.08)',
    border: 'rgba(248,81,73,0.3)',
    title: '#f85149',
    dot: '#f85149',
  },
  info: {
    bg: 'rgba(48,54,61,0.5)',
    border: '#30363d',
    title: '#8b949e',
    dot: '#8b949e',
  },
};

const badgeColors = {
  High: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '#f59e0b' },
  Critical: { bg: 'rgba(248,81,73,0.15)', color: '#f85149', border: '#f85149' },
};

const Timeline = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #30363d' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Incident Timeline</h2>
        <p style={{ color: '#8b949e', fontSize: 13 }}>
          Chronological event log for Lagos West performance degradation
        </p>
      </div>

      {/* Timeline */}
      <div style={{ padding: '2rem', flex: 1 }}>
        <div style={{ position: 'relative', maxWidth: 900 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 52,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#30363d',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {events.map((ev, i) => {
              const s = severityStyles[ev.severity];
              const badge = ev.badge ? badgeColors[ev.badge] : null;

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  {/* Time label */}
                  <div style={{
                    width: 44, flexShrink: 0,
                    fontSize: 12, color: '#8b949e', fontWeight: 600,
                    paddingTop: 18, textAlign: 'right',
                  }}>
                    {ev.time}
                  </div>

                  {/* Dot */}
                  <div style={{
                    flexShrink: 0, marginTop: 18,
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: s.dot,
                    boxShadow: `0 0 8px ${s.dot}88`,
                    zIndex: 1,
                    position: 'relative',
                  }} />

                  {/* Card */}
                  <div style={{
                    flex: 1,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: 12,
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    transition: 'transform 0.2s',
                    cursor: 'default',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: s.title, marginBottom: 6 }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.5 }}>
                        {ev.desc}
                      </div>
                    </div>
                    {badge && (
                      <span style={{
                        flexShrink: 0,
                        marginLeft: 16,
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'capitalize',
                        background: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                      }}>
                        {ev.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: '1px solid #30363d',
        flexShrink: 0,
      }}>
        {[
          { label: 'Total Events', value: events.length },
          { label: 'Time to Detection', value: '22 min' },
          { label: 'Incident Duration', value: '2h 22m' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '1.5rem 2rem',
            borderRight: i < 2 ? '1px solid #30363d' : 'none',
            background: '#0d1117',
          }}>
            <div style={{ fontSize: 12, color: '#8b949e', fontWeight: 600, marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
