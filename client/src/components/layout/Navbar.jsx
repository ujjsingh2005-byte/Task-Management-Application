import React, { useState, useRef, useEffect } from 'react';
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
  Home,
  User,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar, onOpenCommandPalette, onOpenCreateTask }) => {
  const { user, logout, isAdmin } = useAuth();
  const { connected } = useSocket();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple clean breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path === '/tasks') return 'All Tasks';
    if (path === '/team') return 'Team';
    if (path === '/activity') return 'Live Activity';
    if (path === '/notifications') return 'Notifications';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/admin') return 'Admin Console';
    if (path === '/admin/users') return 'User Directory';
    if (path === '/admin/tasks') return 'Task Management';
    if (path === '/admin/activity') return 'Audit Logs';
    if (path === '/admin/reports') return 'System Reports';
    if (path === '/admin/settings') return 'System Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-ivory-border dark:border-midnight-border bg-ivory-paper/95 dark:bg-midnight-surface/95 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left side: Hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text hover:bg-ivory-stone dark:hover:bg-midnight-elevated rounded-xl lg:hidden transition-colors cursor-pointer"
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

      {/* Center: Floating Search Bar */}
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
        {/* Custom Live Sync Status Control */}
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

        {/* Primary Action Button */}
        <button
          onClick={onOpenCreateTask}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-coral hover:bg-coral-bright text-white text-xs font-semibold shadow-coral-glow border border-coral-deep/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Task</span>
        </button>

        {/* Theme Switcher */}
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

        {/* Two-Mode User Profile Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-ivory-stone dark:hover:bg-midnight-elevated transition-all cursor-pointer border border-transparent hover:border-ivory-border dark:hover:border-midnight-border"
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
              <p className="text-xs font-bold text-ivory-text dark:text-midnight-text leading-none truncate max-w-[110px]">
                {user?.name}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                {isAdmin ? (
                  <span className="inline-flex items-center text-[9px] font-bold text-violet bg-violet/10 px-1.5 py-0.2 rounded border border-violet/20">
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] text-ivory-muted dark:text-midnight-muted">Member</span>
                )}
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-ivory-muted dark:text-midnight-muted transition-transform duration-200 ${
                menuOpen ? 'rotate-180 text-violet' : ''
              }`}
            />
          </button>

          {/* Dropdown Popover */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle shadow-2xl py-2 z-50 animate-fadeIn text-xs">
              {/* Profile Card Header */}
              <div className="px-4 py-3 border-b border-ivory-subtle dark:border-midnight-subtle">
                <p className="font-extrabold text-sm text-ivory-text dark:text-midnight-text truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-ivory-muted dark:text-midnight-muted truncate mt-0.5">
                  {user?.email}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isAdmin
                        ? 'bg-violet/15 text-violet border-violet/30'
                        : 'bg-aqua/10 text-aqua border-aqua/30'
                    }`}
                  >
                    {isAdmin && <Shield className="w-2.5 h-2.5 mr-1" />}
                    <span>{isAdmin ? 'System Administrator' : 'Workspace Member'}</span>
                  </span>
                </div>
              </div>

              {/* Mode Switching Links */}
              <div className="py-1.5 px-1 space-y-0.5">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-ivory-text dark:text-midnight-text hover:bg-ivory-soft dark:hover:bg-midnight-slate font-semibold transition-colors"
                >
                  <Home className="w-4 h-4 text-blueAccent" />
                  <span>Go to Workspace</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-violet hover:bg-violet/10 font-bold transition-colors border border-violet/20 shadow-xs"
                  >
                    <Shield className="w-4 h-4 text-violet" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-ivory-text dark:text-midnight-text hover:bg-ivory-soft dark:hover:bg-midnight-slate transition-colors"
                >
                  <User className="w-4 h-4 text-violet-light" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-ivory-text dark:text-midnight-text hover:bg-ivory-soft dark:hover:bg-midnight-slate transition-colors"
                >
                  <Settings className="w-4 h-4 text-ivory-muted dark:text-midnight-muted" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout Action */}
              <div className="pt-1.5 px-1 border-t border-ivory-subtle dark:border-midnight-subtle">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-roseAccent hover:bg-roseAccent/10 font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
