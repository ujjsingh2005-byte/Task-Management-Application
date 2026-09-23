import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-midnight-deep/75 backdrop-blur-md transition-opacity animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-ivory-paper dark:bg-midnight-ink text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-ivory-subtle dark:border-midnight-subtle p-6 z-10`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
            <h3 className="text-base font-bold text-ivory-text dark:text-midnight-text tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text hover:bg-ivory-soft dark:hover:bg-midnight-slate transition-colors focus:outline-none cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
