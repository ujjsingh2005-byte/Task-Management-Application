import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/dateUtils';
import { Users, Trash2, Shield, User, Search } from 'lucide-react';

export const AdminUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await taskService.getAdminUsers();
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentAdmin._id) {
      alert('You cannot delete your own admin account');
      return;
    }

    if (window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      try {
        await taskService.deleteUser(userId);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (userId === currentAdmin._id) {
      alert('You cannot modify your own role');
      return;
    }

    if (window.confirm(`Change role to ${newRole}?`)) {
      try {
        await taskService.updateUserRole(userId, newRole);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } catch (err) {
        console.error('Failed to update role:', err);
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            User Governance Directory
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-1">
            Manage registered accounts, inspect live presence, and control workspace role privileges.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-muted dark:text-midnight-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder-ivory-muted dark:placeholder-midnight-muted transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl border border-ivory-subtle dark:border-midnight-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-soft/60 dark:bg-midnight-slate/40 border-b border-ivory-subtle dark:border-midnight-subtle text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-subtle/60 dark:divide-midnight-subtle/80 text-xs text-ivory-text dark:text-midnight-text">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ivory-muted dark:text-midnight-muted">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ivory-muted dark:text-midnight-muted">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u._id === currentAdmin._id;
                  return (
                    <tr key={u._id} className="hover:bg-ivory-soft/50 dark:hover:bg-midnight-slate/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-xl bg-violet/10 text-violet border border-violet/20 flex items-center justify-center font-bold text-xs overflow-hidden">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                            ) : (
                              u.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-ivory-text dark:text-midnight-text">{u.name}</p>
                            <p className="text-[11px] text-ivory-muted dark:text-midnight-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <PresenceIndicator userId={u._id} showText={true} />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          disabled={isSelf}
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] border transition-colors ${
                            u.role === 'ADMIN'
                              ? 'bg-violet/15 text-violet border-violet/30 hover:bg-violet/25'
                              : 'bg-ivory-soft dark:bg-midnight-slate text-ivory-muted dark:text-midnight-muted border-ivory-subtle dark:border-midnight-subtle hover:bg-ivory-subtle'
                          } ${isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                        >
                          {u.role === 'ADMIN' ? (
                            <Shield className="h-2.5 w-2.5 mr-1 text-violet" />
                          ) : (
                            <User className="h-2.5 w-2.5 mr-1 text-ivory-muted dark:text-midnight-muted" />
                          )}
                          {u.role}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-ivory-muted dark:text-midnight-muted font-mono">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 text-ivory-muted dark:text-midnight-muted hover:text-roseAccent hover:bg-roseAccent/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
