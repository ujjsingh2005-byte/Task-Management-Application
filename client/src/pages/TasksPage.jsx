import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskGrid } from '../components/tasks/TaskGrid';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { CalendarView } from '../components/tasks/CalendarView';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Button } from '../components/common/Button';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Kanban,
  Calendar,
} from 'lucide-react';

export const TasksPage = () => {
  const { tasks, loading, pagination, fetchTasks, setFilters, updateTaskStatus, deleteTask } = useTasks();
  const { onOpenCreateTask } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const currentView = searchParams.get('view') || 'list';
  const [editTask, setEditTask] = useState(null);
  const [createInitialStatus, setCreateInitialStatus] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleViewChange = (view) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set('view', view);
      return updated;
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => {
      const next = { ...prev, page: newPage };
      fetchTasks(next);
      return next;
    });
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTaskStatus(task._id, newStatus, task.version);
    } catch (err) {
      console.error('Failed to change task status:', err);
    }
  };

  const handleOpenCreateWithStatus = (status) => {
    setCreateInitialStatus(status);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory-text dark:text-midnight-text tracking-tight">
            Workspace Tasks
          </h1>
          <p className="text-xs sm:text-sm text-ivory-muted dark:text-midnight-muted mt-0.5">
            Organize, prioritize, and track team deliverables across multiple views.
          </p>
        </div>

        {/* View Switchers & Action Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-ivory-soft dark:bg-midnight-slate p-1 rounded-xl border border-ivory-subtle dark:border-midnight-subtle">
            <button
              onClick={() => handleViewChange('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'list'
                  ? 'bg-ivory-paper dark:bg-midnight-ink text-violet shadow-sm'
                  : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => handleViewChange('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'kanban'
                  ? 'bg-ivory-paper dark:bg-midnight-ink text-violet shadow-sm'
                  : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>

            <button
              onClick={() => handleViewChange('calendar')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'calendar'
                  ? 'bg-ivory-paper dark:bg-midnight-ink text-violet shadow-sm'
                  : 'text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text'
              }`}
              title="Calendar Schedule View"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </button>
          </div>

          {onOpenCreateTask && (
            <Button
              onClick={() => onOpenCreateTask()}
              icon={Plus}
              variant="primary"
            >
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      {currentView !== 'calendar' && <TaskFilterBar />}

      {/* Dynamic Content Views */}
      {currentView === 'list' && (
        <TaskGrid
          tasks={tasks}
          loading={loading}
          onOpenCreateTask={onOpenCreateTask}
          onEditTask={(task) => setEditTask(task)}
          onDeleteTask={(task) => deleteTask(task._id)}
        />
      )}

      {currentView === 'kanban' && (
        <KanbanBoard
          tasks={tasks}
          onEdit={(task) => setEditTask(task)}
          onDelete={(task) => deleteTask(task._id)}
          onStatusChange={handleStatusChange}
          onOpenCreateTask={handleOpenCreateWithStatus}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarView tasks={tasks} onOpenCreateTask={onOpenCreateTask} />
      )}

      {/* Pagination Controls */}
      {currentView === 'list' && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-ivory-subtle dark:border-midnight-subtle">
          <p className="text-xs text-ivory-muted dark:text-midnight-muted">
            Showing <span className="font-semibold text-ivory-text dark:text-midnight-text">{tasks.length}</span> of{' '}
            <span className="font-semibold text-ivory-text dark:text-midnight-text">{pagination.totalRecords}</span> tasks
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={pagination.currentPage <= 1 || loading}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-xs font-semibold px-2 text-ivory-text dark:text-midnight-text">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages || loading}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <TaskFormModal
          isOpen={!!editTask}
          onClose={() => setEditTask(null)}
          initialData={editTask}
        />
      )}

      {/* Quick Add with default status from Kanban */}
      {createInitialStatus && (
        <TaskFormModal
          isOpen={!!createInitialStatus}
          onClose={() => setCreateInitialStatus(null)}
          defaultStatus={createInitialStatus}
        />
      )}
    </div>
  );
};
