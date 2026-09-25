import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Settings,
  Shield,
  Key,
  Server,
  Database,
  Lock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Save,
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const { user } = useAuth();
  const { connected } = useSocket();

  const [jwtTTL, setJwtTTL] = useState('24h');
  const [occMode, setOccMode] = useState('ENFORCE_VERSION');
  const [rateLimitRate, setRateLimitRate] = useState('100');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber text-xs font-bold mb-2 border border-amber/30">
          <Shield className="h-3.5 w-3.5" />
          <span>System Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
          Platform Security & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
          Configure global security parameters, real-time concurrency models, and runtime rate limiting.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-aqua/10 text-aqua">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-ivory-muted dark:text-midnight-muted">WebSocket Gateway</p>
            <p className="text-sm font-bold text-aqua">{connected ? 'Live & Connected' : 'Connecting...'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-lime/10 text-lime">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-ivory-muted dark:text-midnight-muted">MongoDB Atlas</p>
            <p className="text-sm font-bold text-lime">Healthy (Replica Set)</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet/10 text-violet">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-ivory-muted dark:text-midnight-muted">Auth Layer</p>
            <p className="text-sm font-bold text-violet">JWT (HMAC-SHA256)</p>
          </div>
        </div>
      </div>

      {/* Config Form */}
      <form onSubmit={handleSave} className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl border border-ivory-subtle dark:border-midnight-subtle p-6 sm:p-8 space-y-6 shadow-sm">
        {saved && (
          <div className="p-3.5 rounded-xl bg-lime/10 border border-lime/30 text-lime flex items-center space-x-2 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Platform configurations saved and applied to active cluster!</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text pb-2 border-b border-ivory-subtle dark:border-midnight-subtle">
            Authentication & Token Lifecycles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5">
                Session Token Lifetime (JWT)
              </label>
              <select
                value={jwtTTL}
                onChange={(e) => setJwtTTL(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none"
              >
                <option value="1h">1 Hour (Strict)</option>
                <option value="12h">12 Hours</option>
                <option value="24h">24 Hours (Standard)</option>
                <option value="7d">7 Days (Extended)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5">
                Optimistic Concurrency Control (OCC)
              </label>
              <select
                value={occMode}
                onChange={(e) => setOccMode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none"
              >
                <option value="ENFORCE_VERSION">Enforce Strict 409 Conflict Protection</option>
                <option value="LAST_WRITE_WINS">Last Write Wins (Degraded)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-ivory-subtle dark:border-midnight-subtle">
          <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text pb-2 border-b border-ivory-subtle dark:border-midnight-subtle">
            Network Rate Limiting
          </h3>

          <div>
            <label className="block text-xs font-bold text-ivory-text dark:text-midnight-text mb-1.5">
              Global API Request Limit (per 15 min window)
            </label>
            <input
              type="number"
              value={rateLimitRate}
              onChange={(e) => setRateLimitRate(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs bg-ivory-soft dark:bg-midnight-slate border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text focus:outline-none"
            />
            <p className="text-[11px] text-ivory-muted dark:text-midnight-muted mt-1">
              Limits excessive client bursts to protect server resources and Socket.IO bandwidth.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-ivory-subtle dark:border-midnight-subtle flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet hover:bg-violet-light text-white text-xs font-semibold shadow-violet-glow transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminSettingsPage;
