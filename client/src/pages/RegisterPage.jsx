import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';
import { UserPlus, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setError('Please fulfill all password requirements');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-deep text-midnight-text flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-violet/20 via-aqua/10 to-coral/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex justify-center mb-3">
          <TaskFlowLogo size="lg" />
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-midnight-text">
          Organize Work. Move Forward.
        </h2>
        <p className="mt-1.5 text-xs text-midnight-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-midnight-ink py-8 px-6 shadow-2xl rounded-2xl border border-midnight-subtle sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-roseAccent/10 border border-roseAccent/30 flex items-center space-x-2 text-xs text-roseAccent font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-midnight-text mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ujjwal Singh"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-midnight-slate/80 border border-midnight-subtle text-midnight-text placeholder-midnight-muted rounded-xl focus:bg-midnight-deep focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight-text mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-midnight-slate/80 border border-midnight-subtle text-midnight-text placeholder-midnight-muted rounded-xl focus:bg-midnight-deep focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight-text mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-midnight-slate/80 border border-midnight-subtle text-midnight-text placeholder-midnight-muted rounded-xl focus:bg-midnight-deep focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight-text mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-muted" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-midnight-slate/80 border border-midnight-subtle text-midnight-text placeholder-midnight-muted rounded-xl focus:bg-midnight-deep focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all"
                />
              </div>
            </div>

            {/* Password Validation Requirements */}
            <div className="bg-midnight-slate/80 p-3.5 rounded-xl border border-midnight-subtle space-y-1 text-[11px] text-midnight-muted">
              <p className="font-bold text-midnight-text mb-1">
                Password Requirements:
              </p>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`h-3 w-3 ${hasMinLength ? 'text-lime' : 'text-midnight-muted'}`}
                />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`h-3 w-3 ${hasUpper ? 'text-lime' : 'text-midnight-muted'}`}
                />
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`h-3 w-3 ${hasLower ? 'text-lime' : 'text-midnight-muted'}`}
                />
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`h-3 w-3 ${hasNumber ? 'text-lime' : 'text-midnight-muted'}`}
                />
                <span>At least one numeric digit (0-9)</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
