import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Code, Cpu, GitBranch, Terminal, AlertTriangle,
  HelpCircle, Zap, List, ChevronRight, Menu, X, Star
} from 'lucide-react';

const chapters = [
  { id: 'title', label: 'Title Page', icon: Star, color: 'text-yellow-400' },
  { id: 'toc', label: 'Table of Contents', icon: List, color: 'text-blue-400' },
  { id: 'ch1', label: 'Ch 1: Fundamentals', icon: Cpu, color: 'text-green-400' },
  { id: 'ch2', label: 'Ch 2: Command Line Args', icon: Terminal, color: 'text-cyan-400' },
  { id: 'ch3', label: 'Ch 3: execvp() Deep Dive', icon: Zap, color: 'text-purple-400' },
  { id: 'ch4', label: 'Ch 4: Process Replacement', icon: GitBranch, color: 'text-orange-400' },
  { id: 'ch5', label: 'Ch 5: fork() Deep Dive', icon: GitBranch, color: 'text-pink-400' },
  { id: 'ch6', label: 'Ch 6: wait() & Sync', icon: Cpu, color: 'text-teal-400' },
  { id: 'ch7', label: 'Ch 7: Code Walkthroughs', icon: Code, color: 'text-indigo-400' },
  { id: 'ch8', label: 'Ch 8: Exam Notes', icon: BookOpen, color: 'text-yellow-400' },
  { id: 'ch9', label: 'Ch 9: Viva Q&A', icon: HelpCircle, color: 'text-green-400' },
  { id: 'ch10', label: 'Ch 10: Errors & Debug', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'ch11', label: 'Ch 11: Linux Internals', icon: Terminal, color: 'text-cyan-400' },
  { id: 'ch12', label: 'Ch 12: Advanced Concepts', icon: Zap, color: 'text-purple-400' },
  { id: 'cheatsheet', label: 'Cheat Sheet', icon: Star, color: 'text-yellow-400' },
];

interface SidebarProps {
  activeChapter: string;
  onChapterClick: (id: string) => void;
}

export default function Sidebar({ activeChapter, onChapterClick }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wider uppercase">OS Lab Guide</p>
            <p className="text-xs text-gray-400">Process Management</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scroll">
        {chapters.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChapter === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => { onChapterClick(ch.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-blue-400' : ch.color + ' opacity-70 group-hover:opacity-100'} />
              <span className="text-xs font-medium leading-tight">{ch.label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto text-blue-400" />}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700/50">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs font-bold text-blue-300 mb-1">📚 Exam Ready</p>
          <p className="text-xs text-gray-400">Complete practical exam guide with viva Q&A</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center text-white shadow-xl"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-gray-700/50 z-40"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 xl:w-72 bg-gray-900/95 border-r border-gray-700/50 fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </div>
    </>
  );
}
