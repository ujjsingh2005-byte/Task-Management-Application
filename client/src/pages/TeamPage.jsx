import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import {
  Users,
  Search,
  Shield,
  Mail,
  Check,
  Copy,
} from 'lucide-react';
import { SkeletonCard } from '../components/common/Skeletons';

export const TeamPage = () => {
  const { user: currentUser } = useAuth();
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await authService.getAllUsers();
        if (res.success && res.data?.users) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter((u) => onlineUsers?.includes(u._id)).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ivory-paper dark:bg-midnight-ink p-6 sm:p-8 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/20 text-violet text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Workspace Collaborators</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Team Directory
          </h1>
          <p className="text-sm text-ivory-muted dark:text-midnight-muted mt-1 max-w-xl">
            Meet your team members, inspect active presence, and collaborate in real-time across all tasks.
          </p>
        </div>

        {/* Stats Chips */}
        <div className="flex items-center gap-3">
          <div className="bg-ivory-soft/80 dark:bg-midnight-slate/80 border border-ivory-subtle dark:border-midnight-subtle px-4 py-3 rounded-xl text-center">
            <p className="text-xl font-bold text-blueAccent">{users.length}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Members
            </p>
          </div>
          <div className="bg-ivory-soft/80 dark:bg-midnight-slate/80 border border-ivory-subtle dark:border-midnight-subtle px-4 py-3 rounded-xl text-center">
            <div className="flex items-center justify-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-aqua animate-pulse-live" />
              <p className="text-xl font-bold text-aqua">{activeCount}</p>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Active Now
            </p>
          </div>
          <div className="bg-ivory-soft/80 dark:bg-midnight-slate/80 border border-ivory-subtle dark:border-midnight-subtle px-4 py-3 rounded-xl text-center">
            <p className="text-xl font-bold text-violet">{adminCount}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
              Admins
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-muted dark:text-midnight-muted" />
          <input
            type="text"
            placeholder="Search members by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-sm text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-all"
          />
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl p-8">
          <Users className="w-12 h-12 mx-auto text-ivory-muted dark:text-midnight-muted opacity-60 mb-3" />
          <h3 className="text-base font-bold text-ivory-text dark:text-midnight-text">No team members found</h3>
          <p className="text-xs text-ivory-muted dark:text-midnight-muted mt-1">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((member) => {
            const isOnline = onlineUsers?.includes(member._id);
            const isMe = member._id === currentUser?._id;

            return (
              <div
                key={member._id}
                className="group relative bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle hover:border-violet/40 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-violet/10 text-violet border border-violet/20 flex items-center justify-center text-xl font-bold overflow-hidden">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <PresenceIndicator userId={member._id} size="md" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          member.role === 'ADMIN'
                            ? 'bg-violet/10 text-violet border-violet/30'
                            : 'bg-blueAccent/10 text-blueAccent border-blueAccent/20'
                        }`}
                      >
                        {member.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                        {member.role}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-ivory-text dark:text-midnight-text truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-ivory-muted dark:text-midnight-muted truncate mt-0.5">
                      {member.email}
                    </p>
                  </div>

                  {/* Status pill */}
                  <div className="mt-4 flex items-center space-x-2 text-xs">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isOnline ? 'bg-aqua animate-pulse-live' : 'bg-ivory-muted dark:bg-midnight-muted'
                      }`}
                    />
                    <span className="text-ivory-muted dark:text-midnight-muted font-medium">
                      {isOnline ? 'Active in workspace' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-ivory-subtle dark:border-midnight-subtle flex items-center justify-between">
                  <button
                    onClick={() => handleCopyEmail(member.email, member._id)}
                    className="flex items-center space-x-1.5 text-xs font-medium text-ivory-muted dark:text-midnight-muted hover:text-violet transition-colors cursor-pointer"
                  >
                    {copiedId === member._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-lime" />
                        <span className="text-lime font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg bg-ivory-soft dark:bg-midnight-slate hover:bg-violet/10 text-ivory-muted dark:text-midnight-muted hover:text-violet transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
