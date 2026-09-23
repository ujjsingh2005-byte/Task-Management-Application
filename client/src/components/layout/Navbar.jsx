import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { PresenceIndicator } from '../common/PresenceIndicator';
import { TaskFlowLogo } from '../common/TaskFlowLogo';
import {
  LogOut,
  Menu,
  Shield,
  Search,
  Moon,
  Sun,
  Plus,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar, onOpenCommandPalette, onOpenCreateTask }) => {
  const { user, logout, isAdmin } = useAuth();
  const { connected } = useSocket();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Simple clean breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path === '/tasks') return 'All Tasks';
    if (path === '/team') return 'Team';
    if (path === '/activity') return 'Live Activity';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/admin') return 'Admin Metrics';
    if (path === '/admin/users') return 'User Directory';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-ivory-border dark:border-midnight-border bg-ivory-paper/95 dark:bg-midnight-surface/95 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left side: Hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text hover:bg-ivory-stone dark:hover:bg-midnight-elevated rounded-xl lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="lg:hidden">
          <TaskFlowLogo size="sm" showText={false} />
        </div>

        {/* Minimal Breadcrumb */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-ivory-muted dark:text-midnight-muted">
          <span>Workspace</span>
          <span className="text-ivory-border dark:text-midnight-border">/</span>
          <span className="font-semibold text-ivory-text dark:text-midnight-text">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Center: Floating Search Bar (Soft Stone with Violet accent) */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-ivory-stone dark:bg-midnight-elevated border border-ivory-border dark:border-midnight-border hover:border-violet/40 dark:hover:border-violet/40 text-ivory-muted dark:text-midnight-muted text-xs font-medium transition-all w-72 lg:w-80 justify-between group cursor-pointer shadow-xs"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 text-violet transition-transform group-hover:scale-110" />
          <span>Search or jump to...</span>
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-ivory-paper dark:bg-midnight-surface border border-ivory-border dark:border-midnight-border rounded text-ivory-text dark:text-midnight-text shadow-xs">
          ⌘K
        </kbd>
      </button>

      {/* Right side: Live Sync, Create Task, Theme, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Custom Live Sync Status Control (AQUA) */}
        <div
          className={`hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
            connected
              ? 'bg-aqua/10 text-aqua-deep dark:text-aqua border-aqua/30'
              : 'bg-roseAccent/10 text-roseAccent border-roseAccent/30'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? 'bg-aqua animate-pulse-live' : 'bg-roseAccent'
            }`}
          />
          <span>{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>

        {/* Primary Action Button (CORAL) */}
        <button
          onClick={onOpenCreateTask}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-coral hover:bg-coral-bright text-white text-xs font-semibold shadow-coral-glow border border-coral-deep/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Task</span>
        </button>

        {/* Custom Editorial Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded-xl bg-ivory-stone dark:bg-midnight-elevated border border-ivory-border dark:border-midnight-border text-ivory-muted dark:text-midnight-muted hover:text-violet transition-all flex items-center space-x-1 cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-violet transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-ivory-border dark:border-midnight-border">
          <Link
            to="/profile"
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-ivory-stone dark:hover:bg-midnight-elevated transition-all"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-violet/20 text-violet border border-violet/40 flex items-center justify-center font-bold text-xs overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <PresenceIndicator userId={user?._id} size="sm" />
              </div>
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-ivory-text dark:text-midnight-text leading-none truncate max-w-[100px]">
                {user?.name}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                {isAdmin && (
                  <span className="inline-flex items-center text-[9px] font-bold text-violet bg-violet/10 px-1 rounded">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </Link>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-ivory-muted dark:text-midnight-muted hover:text-roseAccent hover:bg-roseAccent/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
