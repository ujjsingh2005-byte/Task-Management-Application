import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import { formatDate } from '../utils/dateUtils';
import { User, Mail, Shield, Calendar, Key, CheckCircle2, Zap } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
          Manage your personal credentials, role permissions, and active presence status.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-6">
        {/* Avatar and Main Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-ivory-subtle dark:border-midnight-subtle">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-violet to-violet-light text-white flex items-center justify-center font-black text-3xl overflow-hidden shadow-lg shadow-violet/20 ring-4 ring-ivory-paper dark:ring-midnight-ink">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-ivory-paper dark:bg-midnight-ink p-1.5 rounded-full shadow-md border border-ivory-subtle dark:border-midnight-subtle">
              <PresenceIndicator userId={user?._id} size="md" />
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-ivory-text dark:text-midnight-text">{user?.name}</h2>
            <p className="text-xs text-ivory-muted dark:text-midnight-muted mt-1">{user?.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet/10 text-violet border border-violet/30">
                <Shield className="h-3 w-3" />
                <span>{user?.role} ROLE</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-aqua/10 text-aqua border border-aqua/30">
                <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse-live mr-1" />
                <span>Active Member</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="flex items-center space-x-2 text-ivory-muted dark:text-midnight-muted font-semibold uppercase tracking-wider mb-1">
              <User className="h-3.5 w-3.5 text-blueAccent" />
              <span>Full Name</span>
            </div>
            <p className="text-sm font-bold text-ivory-text dark:text-midnight-text">{user?.name}</p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="flex items-center space-x-2 text-ivory-muted dark:text-midnight-muted font-semibold uppercase tracking-wider mb-1">
              <Mail className="h-3.5 w-3.5 text-violet" />
              <span>Email Address</span>
            </div>
            <p className="text-sm font-bold text-ivory-text dark:text-midnight-text">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="flex items-center space-x-2 text-ivory-muted dark:text-midnight-muted font-semibold uppercase tracking-wider mb-1">
              <Calendar className="h-3.5 w-3.5 text-coral" />
              <span>Member Since</span>
            </div>
            <p className="text-sm font-bold text-ivory-text dark:text-midnight-text font-mono">{formatDate(user?.createdAt)}</p>
          </div>

          <div className="p-4 rounded-xl bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle">
            <div className="flex items-center space-x-2 text-ivory-muted dark:text-midnight-muted font-semibold uppercase tracking-wider mb-1">
              <Key className="h-3.5 w-3.5 text-amber" />
              <span>Security Protocol</span>
            </div>
            <p className="text-sm font-bold text-ivory-text dark:text-midnight-text">Stateless JWT (HMAC-SHA256)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
