import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-ivory-stone dark:bg-midnight-deep flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="h-16 w-16 bg-coral/10 text-coral rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-coral/20">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-ivory-muted dark:text-midnight-muted mt-1">Page Not Found</h2>
      <p className="text-xs text-ivory-muted dark:text-midnight-muted max-w-sm mt-2 mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={Home}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
