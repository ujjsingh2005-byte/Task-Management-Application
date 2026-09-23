import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../common/Toast';
import { TaskFormModal } from '../tasks/TaskFormModal';
import { OCCConflictModal } from '../tasks/OCCConflictModal';
import { CommandPalette } from '../common/CommandPalette';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K and C)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }

      // Quick 'C' key to create task when not typing inside input/textarea
      if (
        e.key.toLowerCase() === 'c' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !commandPaletteOpen &&
        !createTaskModalOpen
      ) {
        e.preventDefault();
        setCreateTaskModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, createTaskModalOpen]);

  return (
    <div className="min-h-screen bg-ivory-base dark:bg-obsidian-base text-ivory-text dark:text-obsidian-text flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenCreateTask={() => setCreateTaskModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreateTask={() => setCreateTaskModalOpen(true)}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          <Outlet context={{ onOpenCreateTask: () => setCreateTaskModalOpen(true) }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals, Spotlight & Alert Containers */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenCreateTask={() => setCreateTaskModalOpen(true)}
      />
      <TaskFormModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      />
      <OCCConflictModal />
      <ToastContainer />
    </div>
  );
};
