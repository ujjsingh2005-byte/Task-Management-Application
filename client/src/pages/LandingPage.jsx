import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Users,
  Kanban,
  Calendar,
  Sparkles,
  Command,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('kanban');

  return (
    <div className="min-h-screen bg-midnight-deep text-midnight-text flex flex-col justify-between selection:bg-violet selection:text-white relative overflow-hidden font-sans">
      {/* Subtle Ambient Radial Light (Violet, Aqua & Coral glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet/20 via-aqua/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-coral/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-midnight-subtle/80 backdrop-blur-md">
        <TaskFlowLogo size="md" />

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" icon={ArrowRight}>
                Open Workspace
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-midnight-muted hover:text-midnight-text transition-colors uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-5xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
        {/* Subtle Release Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet/10 border border-violet/30 text-violet-light text-xs font-semibold mb-8 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-violet-light" />
          <span>TaskFlow — Real-Time Collaborative SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-midnight-text max-w-4xl leading-[1.1] mb-6">
          Organize Work.{' '}
          <span className="text-violet-light">
            Move Forward.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-midnight-muted max-w-2xl mb-10 leading-relaxed font-normal">
          The high-velocity task management platform built for modern product teams. Instant Socket.IO synchronization, conflict-safe OCC versioning, Kanban boards, and keyboard-first command palette.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to={isAuthenticated ? '/dashboard' : '/register'} className="w-full sm:w-auto">
            <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto">
              {isAuthenticated ? 'Go to Workspace' : 'Start for Free'}
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Demo Credentials
            </Button>
          </Link>
        </div>

        {/* Interactive App Mockup Showcase */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-midnight-subtle bg-midnight-ink p-4 sm:p-6 shadow-2xl">
          {/* Mockup Topbar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-midnight-subtle">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-midnight-slate border border-midnight-subtle" />
              <span className="w-3 h-3 rounded-full bg-midnight-slate border border-midnight-subtle" />
              <span className="w-3 h-3 rounded-full bg-midnight-slate border border-midnight-subtle" />
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-midnight-slate p-1 rounded-xl border border-midnight-subtle">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'kanban'
                    ? 'bg-violet text-white shadow-violet-glow'
                    : 'text-midnight-muted hover:text-midnight-text'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Task Board</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-violet text-white shadow-violet-glow'
                    : 'text-midnight-muted hover:text-midnight-text'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'activity'
                    ? 'bg-violet text-white shadow-violet-glow'
                    : 'text-midnight-muted hover:text-midnight-text'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Live Audit</span>
              </button>
            </div>

            {/* Live Socket Status (AQUA) */}
            <div className="flex items-center space-x-1.5 text-xs text-aqua font-mono">
              <span className="w-2 h-2 rounded-full bg-aqua animate-pulse-live" />
              <span>LIVE WS</span>
            </div>
          </div>

          {/* Mockup Preview Content */}
          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-midnight-deep border border-midnight-subtle rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-blueAccent uppercase tracking-wider">
                  <span>To Do (3)</span>
                </div>
                <div className="bg-midnight-slate/70 border border-coral/30 rounded-xl p-3 mb-2.5">
                  <span className="text-[10px] font-bold text-coral bg-coral/10 border border-coral/20 px-2 py-0.5 rounded">
                    URGENT
                  </span>
                  <h4 className="text-xs font-bold text-midnight-text mt-1.5">Design System Token Audit</h4>
                  <p className="text-[11px] text-midnight-muted mt-1">Review contrast ratios and Deep Midnight surfaces</p>
                </div>
                <div className="bg-midnight-slate/70 border border-midnight-subtle rounded-xl p-3">
                  <span className="text-[10px] font-bold text-blueAccent bg-blueAccent/10 border border-blueAccent/20 px-2 py-0.5 rounded">
                    MEDIUM
                  </span>
                  <h4 className="text-xs font-bold text-midnight-text mt-1.5">WebSocket Latency Benchmarks</h4>
                </div>
              </div>

              <div className="bg-midnight-deep border border-midnight-subtle rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-violet uppercase tracking-wider">
                  <span>In Progress (2)</span>
                </div>
                <div className="bg-midnight-slate/70 border border-violet/40 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded">
                    HIGH
                  </span>
                  <h4 className="text-xs font-bold text-midnight-text mt-1.5">OCC Version Collision Handlers</h4>
                  <p className="text-[11px] text-midnight-muted mt-1">Optimistic locking with automatic prompt</p>
                </div>
              </div>

              <div className="bg-midnight-deep border border-midnight-subtle rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-lime uppercase tracking-wider">
                  <span>Completed (8)</span>
                </div>
                <div className="bg-midnight-slate/70 border border-midnight-subtle rounded-xl p-3 opacity-75">
                  <span className="text-[10px] font-bold text-lime bg-lime/10 border border-lime/20 px-2 py-0.5 rounded">
                    DONE
                  </span>
                  <h4 className="text-xs font-bold text-midnight-muted line-through mt-1.5">
                    Command Palette Engine (Ctrl+K)
                  </h4>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="grid grid-cols-7 gap-2 text-center text-xs py-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="font-bold text-midnight-muted pb-2 border-b border-midnight-subtle">
                  {d}
                </div>
              ))}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                <div
                  key={d}
                  className="bg-midnight-deep border border-midnight-subtle rounded-xl p-2 min-h-[55px] text-left"
                >
                  <span className="text-[11px] text-midnight-muted font-bold">{d}</span>
                  {d === 5 && (
                    <div className="mt-1 bg-lime/15 text-lime text-[10px] p-1 rounded font-semibold truncate border border-lime/20">
                      Release v2.4
                    </div>
                  )}
                  {d === 12 && (
                    <div className="mt-1 bg-coral/15 text-coral text-[10px] p-1 rounded font-semibold truncate border border-coral/20">
                      Atlas Cluster Sync
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-2.5 text-left py-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-deep border border-midnight-subtle text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-violet/20 text-violet flex items-center justify-center font-bold text-[10px]">
                    U
                  </div>
                  <span className="text-midnight-muted">
                    <strong className="text-midnight-text">Ujjwal Singh</strong> moved task{' '}
                    <span className="text-violet font-semibold">Design System Token Audit</span> to{' '}
                    <span className="text-lime font-semibold">Completed</span>
                  </span>
                </div>
                <span className="text-[10px] text-midnight-muted font-mono">2m ago</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-deep border border-midnight-subtle text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-blueAccent/20 text-blueAccent flex items-center justify-center font-bold text-[10px]">
                    A
                  </div>
                  <span className="text-midnight-muted">
                    <strong className="text-midnight-text">Amit Patel</strong> commented on{' '}
                    <span className="text-aqua font-semibold">OCC Version Collision Handlers</span>
                  </span>
                </div>
                <span className="text-[10px] text-midnight-muted font-mono">8m ago</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Grid - 6 Multi-Color Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-24 max-w-5xl w-full">
          <div className="bg-midnight-ink border border-midnight-subtle hover:border-aqua/40 rounded-2xl p-6 transition-all duration-200">
            <div className="h-11 w-11 bg-aqua/10 text-aqua rounded-xl flex items-center justify-center mb-5 border border-aqua/20">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-midnight-text mb-2">Live Socket.IO Sync</h3>
            <p className="text-xs text-midnight-muted leading-relaxed">
              Every status move, assignment change, and comment broadcasts instantly to active teammates with zero page reloads.
            </p>
          </div>

          <div className="bg-midnight-ink border border-midnight-subtle hover:border-violet/40 rounded-2xl p-6 transition-all duration-200">
            <div className="h-11 w-11 bg-violet/10 text-violet rounded-xl flex items-center justify-center mb-5 border border-violet/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-midnight-text mb-2">OCC Conflict Safe</h3>
            <p className="text-xs text-midnight-muted leading-relaxed">
              Optimistic Concurrency Control guards against overwrite collisions with transparent diff review dialogues.
            </p>
          </div>

          <div className="bg-midnight-ink border border-midnight-subtle hover:border-coral/40 rounded-2xl p-6 transition-all duration-200">
            <div className="h-11 w-11 bg-coral/10 text-coral rounded-xl flex items-center justify-center mb-5 border border-coral/20">
              <Command className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-midnight-text mb-2">Command Palette (⌘K)</h3>
            <p className="text-xs text-midnight-muted leading-relaxed">
              Keyboard-first navigation lets power users search tasks, jump across workspaces, and trigger instant actions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-midnight-subtle px-6 py-8 text-center text-xs text-midnight-muted">
        <p>TaskFlow © 2026 • Organize Work. Move Forward. • Built with React, Vite, Tailwind CSS, Express, Socket.IO & MongoDB</p>
      </footer>
    </div>
  );
};
