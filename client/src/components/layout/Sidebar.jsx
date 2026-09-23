import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { PresenceIndicator } from '../common/PresenceIndicator';
import { TaskFlowLogo } from '../common/TaskFlowLogo';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  Calendar,
  BarChart3,
  Users,
  Activity,
  UserCheck,
  Settings,
  Shield,
  Plus,
  X,
} from 'lucide-react';

const AVATAR_BG_COLORS = [
  'bg-violet/20 text-violet border-violet/30',
  'bg-aqua/20 text-aqua border-aqua/30',
  'bg-coral/20 text-coral border-coral/30',
  'bg-lime/20 text-lime-deep dark:text-lime border-lime/30',
  'bg-amber/20 text-amber-deep dark:text-amber border-amber/30',
  'bg-blueAccent/20 text-blueAccent border-blueAccent/30',
];

export const Sidebar = ({ isOpen, onClose, onOpenCreateTask }) => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await authService.getAllUsers();
        if (res.success && res.data?.users) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Failed to fetch teammates:', err);
      }
    };
    loadUsers();
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, iconColor: 'text-violet' },
    { to: '/tasks', label: 'All Tasks', icon: CheckSquare, iconColor: 'text-blueAccent' },
    { to: '/tasks?view=kanban', label: 'Task Board', icon: Kanban, iconColor: 'text-aqua' },
    { to: '/tasks?view=calendar', label: 'Schedule', icon: Calendar, iconColor: 'text-amber' },
  ];

  const workspaceItems = [
    { to: '/team', label: 'Team', icon: Users, iconColor: 'text-lime' },
    { to: '/activity', label: 'Live Activity', icon: Activity, iconColor: 'text-aqua' },
  ];

  const accountItems = [
    { to: '/profile', label: 'My Profile', icon: UserCheck, iconColor: 'text-midnight-muted' },
    { to: '/settings', label: 'Settings', icon: Settings, iconColor: 'text-midnight-muted' },
  ];

  const adminItems = [
    { to: '/admin', label: 'Admin Metrics', icon: Shield, iconColor: 'text-violet' },
    { to: '/admin/users', label: 'User Directory', icon: Users, iconColor: 'text-blueAccent' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-midnight-deep/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container (260px Midnight + subtle Violet glow) */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[260px] border-r border-midnight-border bg-midnight text-midnight-text flex flex-col justify-between transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl relative ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Very subtle Violet vertical background accent */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-violet/5 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col h-full overflow-y-auto px-4 py-5 relative z-10">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-midnight-border/80">
            <TaskFlowLogo size="md" />
            <button
              onClick={onClose}
              className="p-1.5 text-midnight-muted hover:text-midnight-text rounded-xl lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Action Button (CORAL) */}
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onOpenCreateTask) onOpenCreateTask();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 mb-5 rounded-xl bg-coral hover:bg-coral-bright text-white font-semibold text-xs shadow-coral-glow border border-coral-deep/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>

          {/* Main Navigation */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-midnight-muted mb-2">
              Workspace
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-violet/15 text-white font-bold shadow-xs'
                        : 'text-midnight-muted hover:bg-midnight-elevated/70 hover:text-midnight-text font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet rounded-r-full shadow-violet-glow" />
                      )}
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-violet' : item.iconColor}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Team Collaboration Section */}
          <div className="mt-5 space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-midnight-muted mb-2">
              Collaboration
            </p>
            {workspaceItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-violet/15 text-white font-bold shadow-xs'
                        : 'text-midnight-muted hover:bg-midnight-elevated/70 hover:text-midnight-text font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet rounded-r-full shadow-violet-glow" />
                      )}
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-violet' : item.iconColor}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Personal Preferences */}
          <div className="mt-5 space-y-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-midnight-muted mb-2">
              Personal
            </p>
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-violet/15 text-white font-bold shadow-xs'
                        : 'text-midnight-muted hover:bg-midnight-elevated/70 hover:text-midnight-text font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet rounded-r-full shadow-violet-glow" />
                      )}
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-violet' : item.iconColor}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Admin Governance (If Admin) */}
          {isAdmin && (
            <div className="mt-5 space-y-0.5">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-violet mb-2 flex items-center space-x-1">
                <Shield className="w-3 h-3 text-violet" />
                <span>Administration</span>
              </p>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `relative flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-violet/15 text-white font-bold shadow-xs'
                          : 'text-midnight-muted hover:bg-midnight-elevated/70 hover:text-midnight-text font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet rounded-r-full shadow-violet-glow" />
                        )}
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-violet' : item.iconColor}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Team Online Area (Bottom) */}
          <div className="mt-6 pt-4 border-t border-midnight-border/80 flex-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-midnight-muted">
                Team Online
              </p>
              <span className="text-[10px] text-aqua font-semibold bg-aqua/10 px-2 py-0.5 rounded-full border border-aqua/20">
                {users.length} active
              </span>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {users.map((u, idx) => {
                const avatarColorClass = AVATAR_BG_COLORS[idx % AVATAR_BG_COLORS.length];
                return (
                  <div
                    key={u._id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-midnight-elevated/60 text-xs text-midnight-text transition-colors"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 border ${avatarColorClass}`}>
                        {u.name?.charAt(0)}
                      </div>
                      <span className="truncate text-xs text-midnight-text/90 font-medium">{u.name}</span>
                    </div>
                    <PresenceIndicator userId={u._id} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
