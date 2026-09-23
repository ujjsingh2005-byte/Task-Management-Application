import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Volume2,
  VolumeX,
  Keyboard,
  Shield,
  Check,
  Smartphone,
  Laptop,
  Command,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { addToast } = useTasks();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastAlerts, setToastAlerts] = useState(true);
  const [realtimeSync, setRealtimeSync] = useState(true);

  const handleSavePreferences = () => {
    if (addToast) {
      addToast('Workspace preferences saved successfully!', 'success');
    }
  };

  const keyboardShortcuts = [
    { key: 'Ctrl + K / ⌘K', desc: 'Open Command Palette' },
    { key: 'C', desc: 'Quick create task' },
    { key: 'T', desc: 'Toggle Dark / Light theme' },
    { key: 'Esc', desc: 'Close modals & drawers' },
    { key: 'Tab', desc: 'Cycle focus across elements' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ivory-paper dark:bg-midnight-ink p-6 sm:p-8 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/20 text-violet text-xs font-semibold mb-3">
            <Settings className="w-3.5 h-3.5" />
            <span>Workspace Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Settings & Appearance
          </h1>
          <p className="text-sm text-ivory-muted dark:text-midnight-muted mt-1 max-w-xl">
            Configure theme aesthetics, notification preferences, and review your productivity shortcuts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Theme & Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Section */}
          <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-ivory-text dark:text-midnight-text mb-1">
              Interface Theme
            </h2>
            <p className="text-xs text-ivory-muted dark:text-midnight-muted mb-6">
              Customize the look and feel of TaskFlow across your devices.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Dark Theme Card */}
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  isDark
                    ? 'border-violet bg-violet/5 ring-2 ring-violet/20 shadow-sm'
                    : 'border-ivory-subtle dark:border-midnight-subtle hover:border-violet/40'
                }`}
              >
                <div className="w-full h-24 rounded-lg bg-midnight-deep border border-midnight-subtle p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-coral" />
                    <span className="w-2 h-2 rounded-full bg-amber" />
                    <span className="w-2 h-2 rounded-full bg-lime" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 bg-violet/40 rounded" />
                    <div className="h-2 w-1/2 bg-aqua/30 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-violet" />
                    <span className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                      Deep Midnight
                    </span>
                  </div>
                  {isDark && <Check className="w-4 h-4 text-violet" />}
                </div>
              </button>

              {/* Light Theme Card */}
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  !isDark
                    ? 'border-violet bg-violet/5 ring-2 ring-violet/20 shadow-sm'
                    : 'border-ivory-subtle dark:border-midnight-subtle hover:border-violet/40'
                }`}
              >
                <div className="w-full h-24 rounded-lg bg-ivory-paper border border-ivory-subtle p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-coral" />
                    <span className="w-2 h-2 rounded-full bg-amber" />
                    <span className="w-2 h-2 rounded-full bg-lime" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 bg-violet/30 rounded" />
                    <div className="h-2 w-1/2 bg-ivory-muted/30 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-amber" />
                    <span className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                      Warm Ivory
                    </span>
                  </div>
                  {!isDark && <Check className="w-4 h-4 text-violet" />}
                </div>
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-ivory-text dark:text-midnight-text mb-1">
              Alerts & Notifications
            </h2>
            <p className="text-xs text-ivory-muted dark:text-midnight-muted mb-6">
              Manage how and when TaskFlow notifies you of teammate activity.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-violet/10 text-violet">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                      In-App Toast Alerts
                    </p>
                    <p className="text-[11px] text-ivory-muted dark:text-midnight-muted">
                      Display toast popups when tasks are assigned or edited
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={toastAlerts}
                  onChange={(e) => setToastAlerts(e.target.checked)}
                  className="w-4 h-4 accent-violet rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-aqua/10 text-aqua">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ivory-text dark:text-midnight-text">
                      Audio Notification Chimes
                    </p>
                    <p className="text-[11px] text-ivory-muted dark:text-midnight-muted">
                      Play subtle audio cues for new incoming mentions and comments
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-violet rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-coral hover:bg-coral-dark text-white text-xs font-bold shadow-coral-glow transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Keyboard Shortcuts & Account Summary */}
        <div className="space-y-6">
          {/* Shortcuts Card */}
          <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-violet/10 text-violet">
                <Keyboard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text">
                Speed Shortcuts
              </h3>
            </div>

            <div className="space-y-2.5">
              {keyboardShortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle text-xs"
                >
                  <span className="text-ivory-muted dark:text-midnight-muted text-[11px]">
                    {s.desc}
                  </span>
                  <kbd className="px-2 py-0.5 rounded bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text font-mono text-[10px] font-bold border border-ivory-subtle dark:border-midnight-subtle shadow-2xs">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Account Snapshot */}
          <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-blueAccent/10 text-blueAccent">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text">
                Workspace Identity
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-ivory-subtle dark:border-midnight-subtle">
                <span className="text-ivory-muted dark:text-midnight-muted">Name</span>
                <span className="font-semibold text-ivory-text dark:text-midnight-text">
                  {user?.name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ivory-subtle dark:border-midnight-subtle">
                <span className="text-ivory-muted dark:text-midnight-muted">Role</span>
                <span className="font-bold text-violet">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-ivory-muted dark:text-midnight-muted">Platform</span>
                <span className="font-mono text-aqua font-semibold">TaskFlow Aurora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
