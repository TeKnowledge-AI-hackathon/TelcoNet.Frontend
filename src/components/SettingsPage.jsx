import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Palette, Save } from 'lucide-react';

const Section = ({ icon, title, children }) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #30363d' }}>
      <div style={{ color: '#3b82f6' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: 16 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, desc, defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #1c2128' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{desc}</div>}
      </div>
      <div
        onClick={() => setOn(v => !v)}
        style={{
          width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
          background: on ? '#3b82f6' : '#30363d',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}/>
      </div>
    </div>
  );
};

const Field = ({ label, defaultValue, type = 'text' }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8b949e', marginBottom: 6 }}>{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      style={{ width: '100%', boxSizing: 'border-box', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, padding: '0.625rem 0.875rem', color: '#f0f6fc', fontSize: 13, outline: 'none' }}
      onFocus={e => e.target.style.borderColor='#3b82f6'}
      onBlur={e => e.target.style.borderColor='#30363d'}
    />
  </div>
);

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <SettingsIcon size={22} color="#8b949e" />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Settings</h2>
          </div>
          <p style={{ color: '#8b949e', fontSize: 13 }}>Configure system preferences and platform behaviour</p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.625rem 1.25rem',
            background: saved ? '#10b981' : '#3b82f6',
            color: 'white', border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* General */}
        <Section icon={<SettingsIcon size={20} />} title="General">
          <Field label="Organisation Name" defaultValue="TelcoNet Nigeria" />
          <Field label="NOC Location" defaultValue="Lagos Data Center" />
          <Field label="Data Refresh Rate (seconds)" defaultValue="30" type="number" />
          <Field label="Timezone" defaultValue="Africa/Lagos (GMT+1)" />
        </Section>

        {/* Notifications */}
        <Section icon={<Bell size={20} />} title="Notifications">
          <Toggle label="Email Alerts" desc="Send critical alerts to admin email" defaultChecked={true} />
          <Toggle label="SMS Notifications" desc="Send SMS for Critical severity events" defaultChecked={false} />
          <Toggle label="In-App Notifications" desc="Show notifications inside the dashboard" defaultChecked={true} />
          <Toggle label="Daily Summary Report" desc="Send summary email every morning at 07:00" defaultChecked={true} />
        </Section>

        {/* Security */}
        <Section icon={<Shield size={20} />} title="Security">
          <Toggle label="Two-Factor Authentication" desc="Require 2FA for all users" defaultChecked={true} />
          <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultChecked={true} />
          <Toggle label="Audit Logging" desc="Log all user actions for compliance" defaultChecked={true} />
          <Toggle label="IP Allowlist" desc="Restrict access to approved IPs only" defaultChecked={false} />
        </Section>

        {/* Data & Retention */}
        <Section icon={<Database size={20} />} title="Data & Retention">
          <Field label="Metrics Retention (days)" defaultValue="90" type="number" />
          <Field label="Alert Log Retention (days)" defaultValue="180" type="number" />
          <Field label="Backup Frequency" defaultValue="Daily at 02:00" />
          <Toggle label="Auto-purge Old Data" desc="Automatically delete data beyond retention period" defaultChecked={true} />
        </Section>

        {/* Appearance - full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Section icon={<Palette size={20} />} title="Appearance">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { name: 'Dark (Default)', bg: '#0d1117', accent: '#3b82f6', active: true },
                { name: 'Midnight', bg: '#020617', accent: '#8b5cf6', active: false },
                { name: 'Slate', bg: '#0f172a', accent: '#2dd4bf', active: false },
                { name: 'Carbon', bg: '#161616', accent: '#f59e0b', active: false },
              ].map((theme, i) => (
                <div key={i} style={{
                  padding: '1rem', borderRadius: 12, cursor: 'pointer',
                  background: theme.bg, border: `2px solid ${theme.active ? theme.accent : '#30363d'}`,
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ width: '100%', height: 48, borderRadius: 8, background: theme.accent, opacity: 0.3, marginBottom: 12 }}/>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>{theme.name}</div>
                  {theme.active && <div style={{ fontSize: 11, color: theme.accent, marginTop: 4, fontWeight: 600 }}>● Active</div>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
