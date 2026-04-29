import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Palette, Save, Loader2 } from 'lucide-react';
import { THEMES, applyTheme } from '../themeUtils';
import { settingsService } from '../api/settingsService';

const Section = ({ icon, title, children }) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #30363d' }}>
      <div style={{ color: '#3b82f6' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: 16 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, desc, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #1c2128' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{desc}</div>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
          background: checked ? '#3b82f6' : '#30363d',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}/>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = 'text' }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8b949e', marginBottom: 6 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', boxSizing: 'border-box', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, padding: '0.625rem 0.875rem', color: '#f0f6fc', fontSize: 13, outline: 'none' }}
      onFocus={e => e.target.style.borderColor='#3b82f6'}
      onBlur={e => e.target.style.borderColor='#30363d'}
    />
  </div>
);

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        const settingsMap = {};
        data.forEach(s => {
          settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
        
        // Theme is handled separately via themeUtils/localStorage usually
        const savedTheme = localStorage.getItem('theme-index');
        if (savedTheme) setActiveTheme(parseInt(savedTheme));
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value.toString() }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.keys(settings).map(key => ({
        key,
        value: settings[key],
        group: getGroup(key)
      }));
      
      await settingsService.updateSettings(payload);
      setSaved(true);
      applyTheme(activeTheme);
      localStorage.setItem('theme-index', activeTheme);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const getGroup = (key) => {
    if (['TwoFactorAuth', 'SessionTimeout', 'AuditLogging', 'IPAllowlist'].includes(key)) return 'Security';
    if (['MetricsRetention', 'AlertRetention', 'BackupFrequency', 'AutoPurge'].includes(key)) return 'Data';
    return 'General';
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
        <Loader2 className="animate-spin" size={32} color="#3b82f6" />
      </div>
    );
  }

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
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.625rem 1.25rem',
            background: saved ? '#10b981' : '#3b82f6',
            opacity: saving ? 0.7 : 1,
            color: 'white', border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
          }}
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* General */}
        <Section icon={<SettingsIcon size={20} />} title="General">
          <Field label="Organisation Name" value={settings.OrgName || 'TelcoNet Nigeria'} onChange={(v) => handleUpdate('OrgName', v)} />
          <Field label="NOC Location" value={settings.NocLocation || 'Lagos Data Center'} onChange={(v) => handleUpdate('NocLocation', v)} />
          <Field label="Data Refresh Rate (seconds)" value={settings.RefreshRate || '30'} type="number" onChange={(v) => handleUpdate('RefreshRate', v)} />
          <Field label="Timezone" value={settings.Timezone || 'Africa/Lagos (GMT+1)'} onChange={(v) => handleUpdate('Timezone', v)} />
        </Section>

        {/* Notifications */}
        <Section icon={<Bell size={20} />} title="Notifications">
          <Toggle label="Email Alerts" desc="Send critical alerts to admin email" checked={settings.EmailAlerts === 'true'} onChange={(v) => handleUpdate('EmailAlerts', v)} />
          <Toggle label="SMS Notifications" desc="Send SMS for Critical severity events" checked={settings.SmsAlerts === 'true'} onChange={(v) => handleUpdate('SmsAlerts', v)} />
          <Toggle label="In-App Notifications" desc="Show notifications inside the dashboard" checked={settings.InAppAlerts === 'true'} onChange={(v) => handleUpdate('InAppAlerts', v)} />
          <Toggle label="Daily Summary Report" desc="Send summary email every morning at 07:00" checked={settings.DailySummary === 'true'} onChange={(v) => handleUpdate('DailySummary', v)} />
        </Section>

        {/* Security */}
        <Section icon={<Shield size={20} />} title="Security">
          <Toggle label="Two-Factor Authentication" desc="Require 2FA for all users" checked={settings.TwoFactorAuth === 'true'} onChange={(v) => handleUpdate('TwoFactorAuth', v)} />
          <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" checked={settings.SessionTimeout === 'true'} onChange={(v) => handleUpdate('SessionTimeout', v)} />
          <Toggle label="Audit Logging" desc="Log all user actions for compliance" checked={settings.AuditLogging === 'true'} onChange={(v) => handleUpdate('AuditLogging', v)} />
          <Toggle label="IP Allowlist" desc="Restrict access to approved IPs only" checked={settings.IPAllowlist === 'true'} onChange={(v) => handleUpdate('IPAllowlist', v)} />
        </Section>

        {/* Data & Retention */}
        <Section icon={<Database size={20} />} title="Data & Retention">
          <Field label="Metrics Retention (days)" value={settings.MetricsRetention || '90'} type="number" onChange={(v) => handleUpdate('MetricsRetention', v)} />
          <Field label="Alert Log Retention (days)" value={settings.AlertRetention || '180'} type="number" onChange={(v) => handleUpdate('AlertRetention', v)} />
          <Field label="Backup Frequency" value={settings.BackupFrequency || 'Daily at 02:00'} onChange={(v) => handleUpdate('BackupFrequency', v)} />
          <Toggle label="Auto-purge Old Data" desc="Automatically delete data beyond retention period" checked={settings.AutoPurge === 'true'} onChange={(v) => handleUpdate('AutoPurge', v)} />
        </Section>

        {/* Appearance - full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Section icon={<Palette size={20} />} title="Appearance">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {THEMES.map((theme, i) => {
                const isActive = activeTheme === i;
                return (
                  <div key={i} onClick={() => setActiveTheme(i)} style={{
                    padding: '1rem', borderRadius: 12, cursor: 'pointer',
                    background: theme.bg, border: `2px solid ${isActive ? theme.accent : '#30363d'}`,
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ width: '100%', height: 48, borderRadius: 8, background: theme.accent, opacity: 0.3, marginBottom: 12 }}/>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>{theme.name}</div>
                    {isActive && <div style={{ fontSize: 11, color: theme.accent, marginTop: 4, fontWeight: 600 }}>● Active</div>}
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
