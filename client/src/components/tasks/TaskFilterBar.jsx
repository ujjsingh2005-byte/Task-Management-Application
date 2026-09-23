import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import { Search, X } from 'lucide-react';

export const TaskFilterBar = () => {
  const { filters, setFilters, fetchTasks } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev, search: debouncedSearch, page: 1 };
      fetchTasks(next);
      return next;
    });
  }, [debouncedSearch, fetchTasks, setFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value, page: 1 };
      fetchTasks(next);
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    const defaultFilters = {
      search: '',
      status: 'ALL',
      priority: 'ALL',
      assignment: 'ALL',
      dueDateFilter: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 12,
    };
    setFilters(defaultFilters);
    fetchTasks(defaultFilters);
  };

  const isFiltered =
    searchInput !== '' ||
    filters.status !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.assignment !== 'ALL' ||
    filters.dueDateFilter !== '';

  return (
    <div className="bg-ivory-paper dark:bg-midnight-ink rounded-2xl p-4 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-3 mb-6 transition-colors">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-muted dark:text-midnight-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks by title, description, or keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-ivory-soft/80 dark:bg-midnight-slate/80 hover:bg-ivory-soft dark:hover:bg-midnight-slate focus:bg-ivory-paper dark:focus:bg-midnight-ink text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted border border-ivory-subtle dark:border-midnight-subtle rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-muted dark:text-midnight-muted hover:text-coral p-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              filters.status !== 'ALL'
                ? 'border-violet/50 bg-violet/10 text-violet dark:text-violet-light font-bold'
                : 'bg-ivory-soft/80 dark:bg-midnight-slate/80 border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text'
            }`}
          >
            <option value="ALL" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Status: All</option>
            <option value={TASK_STATUS.TODO} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">In Progress</option>
            <option value={TASK_STATUS.COMPLETED} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Completed</option>
            <option value={TASK_STATUS.CANCELLED} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Cancelled</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              filters.priority !== 'ALL'
                ? 'border-amber/50 bg-amber/10 text-amber dark:text-amber-light font-bold'
                : 'bg-ivory-soft/80 dark:bg-midnight-slate/80 border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text'
            }`}
          >
            <option value="ALL" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Priority: All</option>
            <option value={TASK_PRIORITY.LOW} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Low</option>
            <option value={TASK_PRIORITY.MEDIUM} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Medium</option>
            <option value={TASK_PRIORITY.HIGH} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">High</option>
            <option value={TASK_PRIORITY.URGENT} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Urgent</option>
          </select>

          {/* Assignment Filter */}
          <select
            value={filters.assignment}
            onChange={(e) => handleFilterChange('assignment', e.target.value)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              filters.assignment !== 'ALL'
                ? 'border-blueAccent/50 bg-blueAccent/10 text-blueAccent dark:text-blueAccent-light font-bold'
                : 'bg-ivory-soft/80 dark:bg-midnight-slate/80 border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text'
            }`}
          >
            <option value="ALL" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Assignment: All</option>
            <option value="MY_TASKS" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Assigned to Me</option>
            <option value="ASSIGNED_BY_ME" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Created by Me</option>
            <option value="UNASSIGNED" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Unassigned</option>
          </select>

          {/* Due Date Filter */}
          <select
            value={filters.dueDateFilter}
            onChange={(e) => handleFilterChange('dueDateFilter', e.target.value)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              filters.dueDateFilter !== ''
                ? 'border-coral/50 bg-coral/10 text-coral dark:text-coral-light font-bold'
                : 'bg-ivory-soft/80 dark:bg-midnight-slate/80 border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text'
            }`}
          >
            <option value="" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Due: Anytime</option>
            <option value="TODAY" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Due Today</option>
            <option value="TOMORROW" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Due Tomorrow</option>
            <option value="THIS_WEEK" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">This Week</option>
            <option value="OVERDUE" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Overdue</option>
          </select>

          {/* Sorting */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters((prev) => {
                const next = { ...prev, sortBy, sortOrder, page: 1 };
                fetchTasks(next);
                return next;
              });
            }}
            className="px-3 py-2 text-xs font-semibold bg-ivory-soft/80 dark:bg-midnight-slate/80 border border-ivory-subtle dark:border-midnight-subtle rounded-xl text-ivory-text dark:text-midnight-text cursor-pointer"
          >
            <option value="createdAt-desc" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Newest First</option>
            <option value="createdAt-asc" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Oldest First</option>
            <option value="dueDate-asc" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Due Date (Earliest)</option>
            <option value="updatedAt-desc" className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">Recently Updated</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-bold text-coral hover:bg-coral/10 border border-coral/30 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
