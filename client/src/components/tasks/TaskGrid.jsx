import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskCardSkeleton } from '../common/Skeletons';
import { Plus, SearchX } from 'lucide-react';
import { Button } from '../common/Button';

export const TaskGrid = ({ tasks, loading, onOpenCreateTask, onEditTask, onDeleteTask }) => {
  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-ivory-surface dark:bg-obsidian-surface rounded-3xl p-12 border border-ivory-border dark:border-obsidian-border shadow-soft-light dark:shadow-soft-dark text-center flex flex-col items-center justify-center space-y-4 my-6">
        <div className="h-16 w-16 bg-champagne/10 text-champagne border border-champagne/20 rounded-2xl flex items-center justify-center">
          <SearchX className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ivory-text dark:text-obsidian-text">No tasks found</h3>
          <p className="text-xs text-ivory-muted dark:text-obsidian-muted max-w-sm mt-1">
            Try adjusting your search filters or create a new task for your team.
          </p>
        </div>
        {onOpenCreateTask && (
          <Button onClick={onOpenCreateTask} icon={Plus} variant="primary">
            Create New Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};
