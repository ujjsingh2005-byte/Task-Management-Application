import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { PRIORITY_CONFIG } from '../../utils/constants';

export const CalendarView = ({ tasks = [], onOpenCreateTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const tasksByDate = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    }
  });

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-ivory-paper dark:bg-midnight-ink border border-ivory-subtle dark:border-midnight-subtle rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-ivory-subtle dark:border-midnight-subtle gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet/10 text-violet border border-violet/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ivory-text dark:text-midnight-text tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-ivory-muted dark:text-midnight-muted">
              Deadlines and scheduled deliverables
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold bg-ivory-soft dark:bg-midnight-slate hover:bg-ivory-subtle dark:hover:bg-midnight-subtle text-ivory-text dark:text-midnight-text rounded-xl border border-ivory-subtle dark:border-midnight-subtle transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-ivory-subtle dark:border-midnight-subtle rounded-xl overflow-hidden bg-ivory-paper dark:bg-midnight-slate">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-ivory-soft dark:hover:bg-midnight-ink text-ivory-muted dark:text-midnight-muted transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-ivory-subtle dark:border-midnight-subtle" />
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-ivory-soft dark:hover:bg-midnight-ink text-ivory-muted dark:text-midnight-muted transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-ivory-subtle dark:border-midnight-subtle bg-ivory-soft/60 dark:bg-midnight-slate/40">
        {daysOfWeek.map((day, idx) => (
          <div
            key={day}
            className={`py-3 text-center text-[11px] font-bold uppercase tracking-wider ${
              idx === 0 || idx === 6
                ? 'text-ivory-muted/70 dark:text-midnight-muted/70'
                : 'text-ivory-text dark:text-midnight-text'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-ivory-subtle dark:divide-midnight-subtle">
        {/* Blank padding cells */}
        {blanks.map((_, i) => (
          <div
            key={`blank-${i}`}
            className="min-h-[110px] bg-ivory-soft/20 dark:bg-midnight-deep/40 p-2 opacity-30"
          />
        ))}

        {/* Month Day Cells */}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = dateStr === todayStr;

          return (
            <div
              key={day}
              className={`min-h-[110px] p-2.5 transition-colors flex flex-col justify-between ${
                isToday
                  ? 'bg-violet/5 dark:bg-violet/5 ring-1 ring-inset ring-violet/20'
                  : 'hover:bg-ivory-soft/40 dark:hover:bg-midnight-slate/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                    isToday
                      ? 'bg-violet text-white shadow-violet-glow'
                      : 'text-ivory-text dark:text-midnight-text'
                  }`}
                >
                  {day}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-semibold text-ivory-muted dark:text-midnight-muted">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>

              {/* Tasks preview list for the day */}
              <div className="space-y-1.5 overflow-y-auto max-h-20">
                {dayTasks.slice(0, 3).map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  const isUrgent = task.priority === 'URGENT';
                  const isHigh = task.priority === 'HIGH';

                  let chipBg = 'bg-ivory-soft/80 dark:bg-midnight-slate border-ivory-subtle dark:border-midnight-subtle';
                  let dotColor = 'bg-blueAccent';

                  if (isCompleted) {
                    dotColor = 'bg-lime';
                  } else if (isUrgent) {
                    chipBg = 'bg-coral/10 border-coral/30 text-coral';
                    dotColor = 'bg-coral';
                  } else if (isHigh) {
                    chipBg = 'bg-amber/10 border-amber/30 text-amber';
                    dotColor = 'bg-amber';
                  }

                  return (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className={`group cursor-pointer px-2 py-1 rounded-lg text-[11px] font-medium border truncate transition-all flex items-center space-x-1.5 hover:border-violet/50 text-ivory-text dark:text-midnight-text shadow-2xs ${chipBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                      <span className="truncate group-hover:text-violet transition-colors">
                        {task.title}
                      </span>
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <p className="text-[10px] text-ivory-muted dark:text-midnight-muted font-medium pl-1">
                    +{dayTasks.length - 3} more...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
