import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { TaskFlowLogo } from '../components/common/TaskFlowLogo';
import { LogIn, Lock, Mail, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired');
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser?.role === 'ADMIN' && from === '/dashboard') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
          Or{' '}
          <Link to="/register" className="font-bold text-violet-light hover:underline">
            create a new workspace account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-midnight-ink py-8 px-6 shadow-2xl rounded-2xl border border-midnight-subtle sm:px-10">
          {isExpired && (
            <div className="mb-4 p-3 rounded-xl bg-amber/10 border border-amber/30 flex items-center space-x-2 text-xs text-amber font-medium">
              <Info className="h-4 w-4 shrink-0" />
              <span>Your session expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-roseAccent/10 border border-roseAccent/30 flex items-center space-x-2 text-xs text-roseAccent font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-midnight-text mb-1.5">
                Email address
              </label>
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
              <label className="block text-xs font-bold text-midnight-text mb-1.5">
                Password
              </label>
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-midnight-subtle">
            <p className="text-[10px] font-bold uppercase text-midnight-muted text-center tracking-wider mb-2.5">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('rahul@taskflow.dev', 'UserPassword123')}
                className="px-2.5 py-2 text-xs font-semibold bg-midnight-slate hover:bg-midnight-deep text-midnight-text rounded-xl border border-midnight-subtle transition-colors text-center cursor-pointer"
              >
                Member (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('ujjsingh203@gmail.com', 'Ujjwal@123')}
                className="px-2.5 py-2 text-xs font-semibold bg-violet/15 hover:bg-violet/25 text-violet-light rounded-xl border border-violet/30 transition-colors text-center cursor-pointer"
              >
                Admin (Ujjwal)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
