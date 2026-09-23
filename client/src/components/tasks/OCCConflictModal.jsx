import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTasks } from '../../context/TaskContext';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OCCConflictModal = () => {
  const { occConflict, clearOccConflict, fetchTasks } = useTasks();
  const navigate = useNavigate();

  if (!occConflict) return null;

  const handleSyncLatest = () => {
    fetchTasks();
    if (occConflict.taskId) {
      navigate(`/tasks/${occConflict.taskId}`);
    }
    clearOccConflict();
  };

  return (
    <Modal
      isOpen={!!occConflict}
      onClose={clearOccConflict}
      title="Concurrent Edit Conflict"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3.5 bg-amber/10 border border-amber/30 rounded-xl text-amber">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber" />
          <div className="text-xs">
            <p className="font-bold text-ivory-text dark:text-midnight-text">
              Version Conflict Detected (OCC)
            </p>
            <p className="mt-1 text-ivory-muted dark:text-midnight-muted leading-relaxed">
              This task was updated by another teammate in real time. To protect data integrity, your change was paused.
            </p>
          </div>
        </div>

        {occConflict.currentTask && (
          <div className="p-3.5 bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle rounded-xl space-y-1.5 text-xs text-ivory-text dark:text-midnight-text">
            <p className="font-bold text-violet text-[11px] uppercase tracking-wider">Latest Server State:</p>
            <p><span className="text-ivory-muted dark:text-midnight-muted">Title:</span> {occConflict.currentTask.title}</p>
            <p><span className="text-ivory-muted dark:text-midnight-muted">Status:</span> {occConflict.currentTask.status}</p>
            <p><span className="text-ivory-muted dark:text-midnight-muted">Priority:</span> {occConflict.currentTask.priority}</p>
            <p><span className="text-ivory-muted dark:text-midnight-muted">Version:</span> v{occConflict.currentTask.version}</p>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-ivory-subtle dark:border-midnight-subtle">
          <Button variant="ghost" onClick={clearOccConflict}>
            Dismiss
          </Button>
          <Button variant="primary" icon={RefreshCw} onClick={handleSyncLatest}>
            Review Latest
          </Button>
        </div>
      </div>
    </Modal>
  );
};
