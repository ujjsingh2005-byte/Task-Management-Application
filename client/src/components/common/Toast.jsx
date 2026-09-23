import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTasks();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-950/90 text-white border-emerald-700/60'
                : isError
                ? 'bg-rose-950/90 text-white border-rose-700/60'
                : 'bg-obsidian-surface/95 text-ivory-text border-champagne-400/30'
            }`}
          >
            <div className="flex items-center space-x-3 mr-2">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />}
              {isError && <AlertCircle className="h-5 w-5 text-coral-400 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="h-5 w-5 text-champagne-400 flex-shrink-0" />}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ivory-muted hover:text-white transition-colors p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
