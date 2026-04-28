import React, { useState } from 'react';

const towers = [
  { id: 'T1', status: 'healthy', x: 72, y: 37 },
  { id: 'T2', status: 'degraded', x: 23, y: 48 },
  { id: 'T3', status: 'degraded', x: 40, y: 53 },
  { id: 'T4', status: 'failed', x: 30, y: 64 },
  { id: 'T5', status: 'healthy', x: 55, y: 44 },
  { id: 'T6', status: 'degraded', x: 53, y: 50 },
  { id: 'T7', status: 'healthy', x: 63, y: 69 },
  { id: 'T8', status: 'healthy', x: 75, y: 74 },
  { id: 'T9', status: 'healthy', x: 87, y: 39 },
  { id: 'T10', status: 'healthy', x: 93, y: 35 },
  { id: 'T11', status: 'degraded', x: 46, y: 74 },
];

const statusColor = {
  healthy: '#10b981',
  degraded: '#f59e0b',
  failed: '#f85149',
};

const NetworkMap = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [hoveredTower, setHoveredTower] = useState(null);

  const timeRanges = ['1h', '24h', '7d'];

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] min-h-screen">
      {/* Sub header */}
      <div className="px-8 py-6 flex justify-between items-start border-b border-[#30363d]">
        <div>
          <h2 className="text-2xl font-bold mb-1">Network Map - Lagos Region</h2>
          <p className="text-[#8b949e] text-sm">Real-time infrastructure status</p>
        </div>
        <div className="flex gap-1 bg-[#161b22] border border-[#30363d] rounded-xl p-1">
          {timeRanges.map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                timeRange === t
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#8b949e] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#0d1117' }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1c2128" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Tower dots */}
        {towers.map(tower => (
          <div
            key={tower.id}
            style={{
              position: 'absolute',
              left: `${tower.x}%`,
              top: `${tower.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredTower(tower)}
            onMouseLeave={() => setHoveredTower(null)}
          >
            {/* Pulse ring */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `${statusColor[tower.status]}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: tower.status === 'failed' ? 'pulse 1.5s infinite' : 'none',
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: statusColor[tower.status],
                  boxShadow: `0 0 10px ${statusColor[tower.status]}88`,
                }}
              />
            </div>

            {/* Tooltip */}
            {hoveredTower?.id === tower.id && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 8,
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Tower {tower.id}</div>
                <div style={{ color: statusColor[tower.status], fontWeight: 600, textTransform: 'capitalize' }}>
                  ● {tower.status}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 32,
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 12,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Tower Status</div>
          {[
            { label: 'Healthy', color: '#10b981' },
            { label: 'Degraded', color: '#f59e0b' },
            { label: 'Failed', color: '#f85149' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
              <span style={{ color: '#8b949e' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Stats overlay top right */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            display: 'flex',
            gap: 12,
          }}
        >
          {[
            { label: 'Online', value: towers.filter(t => t.status === 'healthy').length, color: '#10b981' },
            { label: 'Degraded', value: towers.filter(t => t.status === 'degraded').length, color: '#f59e0b' },
            { label: 'Failed', value: towers.filter(t => t.status === 'failed').length, color: '#f85149' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 10,
                padding: '10px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8b949e' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;
