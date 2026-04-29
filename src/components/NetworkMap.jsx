import React, { useState, useEffect, useRef } from 'react';
import { networkService } from '../api/networkService';

const statusColor = {
  healthy: '#10b981',
  degraded: '#f59e0b',
  failed: '#f85149',
};

const NetworkMap = ({ setAiQuery, setCurrentView }) => {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const timeRanges = ['1h', '24h', '7d'];

  useEffect(() => {
    const fetchTowers = async () => {
      try {
        const data = await networkService.getNodes();
        // The API returns { region: "...", nodes: [...] }
        setTowers(data.nodes || []);
      } catch (err) {
        console.error('Failed to fetch tower nodes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTowers();
  }, []);



  useEffect(() => {
    if (!mapInstanceRef.current || towers.length === 0) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    towers.forEach(tower => {
      const status = tower.status?.toLowerCase() || 'healthy';
      const color = statusColor[status] || statusColor.healthy;
      const isFailed = status === 'failed';
      
      const html = `
        <div style="
          width: 24px; height: 24px; border-radius: 50%;
          background: ${color}33; display: flex; align-items: center; justify-content: center;
          ${isFailed ? 'animation: mapPulse 1.5s infinite;' : ''}
        ">
          <div style="
            width: 10px; height: 10px; border-radius: 50%;
            background: ${color}; box-shadow: 0 0 8px ${color};
          "></div>
        </div>
      `;

      const icon = window.L.divIcon({
        html,
        className: 'custom-tower-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([tower.lat, tower.lng], { icon }).addTo(map);
      markersRef.current.push(marker);

      // Add tooltip
      marker.bindTooltip(`
        <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px; color: #fff; min-width: 180px;">
          <div style="font-weight: 800; margin-bottom: 6px; font-family: inherit; font-size: 14px;">${tower.id}</div>
          <div style="color: #8b949e; font-size: 11px; margin-bottom: 2px;">${tower.street || ''}</div>
          <div style="color: #8b949e; font-size: 11px; margin-bottom: 8px;">LGA: ${tower.lga || ''}</div>
          <div style="color: ${color}; font-weight: 700; text-transform: capitalize; font-size: 12px; display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid #30363d;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 6px ${color};"></div>
            Status: ${status}
          </div>
          <div style="color: #3b82f6; font-size: 10px; margin-top: 8px; text-align: right; font-weight: 600;">Click to analyze -></div>
        </div>
      `, {
        direction: 'top',
        className: 'custom-leaflet-tooltip',
        offset: [0, -12]
      });

      marker.on('click', () => {
        setAiQuery(`Analyze why tower ${tower.id} (${tower.street || ''}, ${tower.lga || ''}) is currently in ${status.toUpperCase()} status based on historical data.`);
        setCurrentView('AIChat');
      });
    });
  }, [towers]);

  useEffect(() => {
    // Leaflet must be loaded globally from CDN in index.html
    if (!window.L || mapInstanceRef.current) return;

    // Initialize map centered on Nigeria and locked to its bounds
    const nigeriaBounds = [
      [3.0, 2.0],  // Southwest coordinates
      [15.0, 15.0] // Northeast coordinates
    ];

    const map = window.L.map(mapRef.current, {
      zoomControl: false,
      maxBounds: nigeriaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6
    }).setView([9.0820, 8.6753], 6);

    window.L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Standard light map tiles (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add CSS for pulse animation if not exists
    if (!document.getElementById('map-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'map-pulse-style';
      style.innerHTML = `
        @keyframes mapPulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(248, 81, 73, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(248, 81, 73, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(248, 81, 73, 0); }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] min-h-screen">
      {/* Sub header */}
      <div className="px-8 py-6 flex justify-between items-start border-b border-[#30363d] z-10 bg-[#0d1117]">
        <div>
          <h2 className="text-2xl font-bold mb-1">Network Map - Nigeria</h2>
          <p className="text-[#8b949e] text-sm">Real-time infrastructure status across the nation</p>
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
      <div className="flex-1 relative">
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#0d1117', zIndex: 0 }} />

        {/* Global styling for Leaflet custom tooltip & controls */}
        <style>{`
          .custom-leaflet-tooltip {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .custom-leaflet-tooltip::before {
            display: none !important;
          }
          .leaflet-control-zoom a {
            background-color: #161b22 !important;
            color: #8b949e !important;
            border-color: #30363d !important;
          }
          .leaflet-control-zoom a:hover {
            color: #fff !important;
          }
          .leaflet-container {
            font-family: inherit !important;
          }
          .leaflet-control-attribution {
            background: rgba(22, 27, 34, 0.8) !important;
            color: #8b949e !important;
          }
          .leaflet-control-attribution a {
            color: #3b82f6 !important;
          }
        `}</style>

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
            zIndex: 1000,
            boxShadow: '0 4px 24px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Tower Status</div>
          {[
            { label: 'Healthy', color: '#10b981' },
            { label: 'Degraded', color: '#f59e0b' },
            { label: 'Failed', color: '#f85149' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
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
            zIndex: 1000
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
                boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
                minWidth: '80px'
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
