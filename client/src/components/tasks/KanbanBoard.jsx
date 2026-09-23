import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Plus, CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

const COLUMNS = [
  {
    id: 'TODO',
    title: 'To Do',
    icon: Clock,
    countColor: 'text-blueAccent bg-blueAccent/15 border border-blueAccent/30',
    indicatorColor: 'bg-blueAccent',
    columnBg: 'bg-[#EBF2FF]/30 dark:bg-[#0D1E3A]/30 border-blueAccent/30',
    hoverDropRing: 'border-blueAccent/60 bg-blueAccent/10 ring-1 ring-blueAccent/30',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    icon: PlayCircle,
    countColor: 'text-violet bg-violet/15 border border-violet/30',
    indicatorColor: 'bg-violet',
    columnBg: 'bg-[#F3F0FF]/30 dark:bg-[#1A1333]/30 border-violet/30',
    hoverDropRing: 'border-violet/60 bg-violet/10 ring-1 ring-violet/30',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    icon: CheckCircle2,
    countColor: 'text-lime-deep dark:text-lime bg-lime/15 border border-lime/30',
    indicatorColor: 'bg-lime',
    columnBg: 'bg-[#F2FCE2]/30 dark:bg-[#132B13]/30 border-lime/30',
    hoverDropRing: 'border-lime/60 bg-lime/10 ring-1 ring-lime/30',
  },
  {
    id: 'CANCELLED',
    title: 'Cancelled',
    icon: XCircle,
    countColor: 'text-roseAccent bg-roseAccent/15 border border-roseAccent/30',
    indicatorColor: 'bg-roseAccent',
    columnBg: 'bg-[#FFF1F0]/30 dark:bg-[#331414]/30 border-roseAccent/30',
    hoverDropRing: 'border-roseAccent/60 bg-roseAccent/10 ring-1 ring-roseAccent/30',
  },
];

export const KanbanBoard = ({ tasks = [], onEdit, onDelete, onStatusChange, onOpenCreateTask }) => {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    setDragOverCol(colId);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onStatusChange) {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== targetStatus) {
        onStatusChange(task, targetStatus);
      }
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start animate-fadeIn">
      {COLUMNS.map((col) => {
        const Icon = col.icon;
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isTarget = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col border rounded-modal p-3.5 min-h-[580px] transition-all ${
              isTarget
                ? col.hoverDropRing
                : `${col.columnBg} border-ivory-border dark:border-midnight-border`
            }`}
          >
            {/* Column Header (With subtle functional accent indicator) */}
            <div className="flex items-center justify-between p-3 rounded-2xl mb-3 bg-ivory-paper dark:bg-midnight border border-ivory-border dark:border-midnight-border shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${col.indicatorColor}`} />
                <Icon className="w-4 h-4 text-ivory-muted dark:text-midnight-muted" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-ivory-text dark:text-midnight-text font-sans">
                  {col.title}
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.countColor}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Quick Add In Column Button */}
            <button
              onClick={() => onOpenCreateTask && onOpenCreateTask(col.id)}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 mb-3 rounded-xl border border-dashed border-ivory-border dark:border-midnight-border text-xs font-medium text-ivory-muted dark:text-midnight-muted hover:text-coral hover:border-coral/40 hover:bg-ivory-paper dark:hover:bg-midnight-elevated transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to {col.title}</span>
            </button>

            {/* Tasks Container */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-ivory-border dark:border-midnight-border rounded-2xl text-center">
                  <p className="text-xs text-ivory-muted dark:text-midnight-muted font-medium">
                    No tasks in {col.title}
                  </p>
                  <p className="text-[10px] text-ivory-muted/70 dark:text-midnight-muted/70 mt-1">
                    Drag items here or click Add
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="cursor-grab active:cursor-grabbing transform transition active:scale-[0.98]"
                  >
                    <TaskCard
                      task={task}
                      onEdit={() => onEdit(task)}
                      onDelete={() => onDelete(task)}
                      isKanbanCompact={true}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
