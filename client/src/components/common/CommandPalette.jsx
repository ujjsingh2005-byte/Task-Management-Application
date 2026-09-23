import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckSquare,
  Plus,
  Moon,
  Sun,
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  Activity,
  User,
  Settings,
  Shield,
  LogOut,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';

export const CommandPalette = ({ isOpen, onClose, onOpenCreateTask }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const baseActions = [
    {
      id: 'create-task',
      title: 'Create New Task',
      subtitle: 'Add a new task to your workspace',
      icon: Plus,
      category: 'Actions',
      accent: 'tangerine',
      perform: () => {
        onClose();
        if (onOpenCreateTask) onOpenCreateTask();
      },
    },
    {
      id: 'toggle-theme',
      title: `Switch to ${isDark ? 'Light (Pearl Canvas)' : 'Dark (Midnight Navy)'} Mode`,
      subtitle: `Current: ${isDark ? 'Dark' : 'Light'}`,
      icon: isDark ? Sun : Moon,
      category: 'Actions',
      accent: 'mint',
      perform: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      title: 'Go to Overview Dashboard',
      subtitle: 'View velocity, stats, and urgent focus',
      icon: LayoutDashboard,
      category: 'Pages',
      accent: 'mint',
      perform: () => {
        navigate('/dashboard');
        onClose();
      },
    },
    {
      id: 'nav-tasks',
      title: 'Go to All Tasks',
      subtitle: 'Explore and filter workspace tasks',
      icon: CheckSquare,
      category: 'Pages',
      accent: 'mint',
      perform: () => {
        navigate('/tasks');
        onClose();
      },
    },
    {
      id: 'nav-kanban',
      title: 'Go to Task Board',
      subtitle: 'Visual columns and drag transitions',
      icon: Kanban,
      category: 'Pages',
      accent: 'mint',
      perform: () => {
        navigate('/tasks?view=kanban');
        onClose();
      },
    },
    {
      id: 'nav-calendar',
      title: 'Go to Calendar Schedule',
      subtitle: 'Monthly deadlines and timelines',
      icon: Calendar,
      category: 'Pages',
      accent: 'mint',
      perform: () => {
        navigate('/tasks?view=calendar');
        onClose();
      },
    },
    {
      id: 'nav-team',
      title: 'Team Directory & Presence',
      subtitle: 'View teammates and live active status',
      icon: Users,
      category: 'People',
      accent: 'mint',
      perform: () => {
        navigate('/team');
        onClose();
      },
    },
    {
      id: 'nav-activity',
      title: 'Live Activity Stream',
      subtitle: 'Real-time workspace audit logs',
      icon: Activity,
      category: 'Activity',
      accent: 'mint',
      perform: () => {
        navigate('/activity');
        onClose();
      },
    },
    {
      id: 'nav-profile',
      title: 'My Profile',
      subtitle: 'Personal credentials and settings',
      icon: User,
      category: 'Settings',
      accent: 'mint',
      perform: () => {
        navigate('/profile');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Workspace Settings',
      subtitle: 'Appearance, notifications & shortcuts',
      icon: Settings,
      category: 'Settings',
      accent: 'mint',
      perform: () => {
        navigate('/settings');
        onClose();
      },
    },
  ];

  if (user?.role === 'ADMIN') {
    baseActions.push({
      id: 'nav-admin',
      title: 'Admin Governance Portal',
      subtitle: 'System health & user management',
      icon: Shield,
      category: 'Administration',
      accent: 'mint',
      perform: () => {
        navigate('/admin');
        onClose();
      },
    });
  }

  baseActions.push({
    id: 'logout',
    title: 'Log Out',
    subtitle: 'Sign out of TaskFlow',
    icon: LogOut,
    category: 'Settings',
    accent: 'danger',
    perform: () => {
      logout();
      onClose();
    },
  });

  const taskResults = (tasks || [])
    .filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((t) => ({
      id: `task-${t._id}`,
      title: t.title,
      subtitle: `Status: ${t.status} • Priority: ${t.priority}`,
      icon: CheckSquare,
      category: 'Tasks',
      accent: 'mint',
      perform: () => {
        navigate(`/tasks/${t._id}`);
        onClose();
      },
    }));

  const filteredItems =
    query.trim() === ''
      ? baseActions
      : [
          ...taskResults,
          ...baseActions.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
          ),
        ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].perform();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-midnight-deep/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-ivory-paper dark:bg-midnight border border-ivory-border dark:border-midnight-border rounded-modal shadow-elevated-dark overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-ivory-border dark:border-midnight-border bg-ivory-stone/50 dark:bg-midnight-surface">
          <Search className="w-4 h-4 text-violet mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search tasks, or jump to page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-xs font-semibold text-violet bg-violet/10 border border-violet/30 rounded-lg shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-ivory-border/40 dark:divide-midnight-border/60">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-ivory-muted dark:text-midnight-muted">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-violet" />
              <p className="text-xs font-semibold">No commands or tasks found</p>
              <p className="text-[11px] mt-1">Try another keyword</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.perform()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-violet/15 text-violet border border-violet/30 shadow-xs'
                      : 'text-ivory-muted dark:text-midnight-muted hover:bg-ivory-stone dark:hover:bg-midnight-surface'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-violet/20 text-violet'
                          : 'bg-ivory-stone dark:bg-midnight-elevated text-ivory-muted dark:text-midnight-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate text-ivory-text dark:text-midnight-text`}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-ivory-muted dark:text-midnight-muted truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-ivory-stone dark:bg-midnight-elevated border border-ivory-border dark:border-midnight-border text-ivory-muted dark:text-midnight-muted">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-violet" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-ivory-stone/30 dark:bg-midnight-surface/60 border-t border-ivory-border dark:border-midnight-border text-[11px] text-ivory-muted dark:text-midnight-muted">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 rounded border border-violet/30 text-violet font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded border border-violet/30 text-violet font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 rounded border border-violet/30 text-violet font-mono text-[10px]">↵</kbd> to select</span>
          </div>
          <div className="flex items-center gap-1.5 text-violet font-semibold text-[10px] uppercase tracking-wider">
            <Command className="w-3 h-3" />
            <span>TaskFlow Command</span>
          </div>
        </div>
      </div>
    </div>
  );
};
