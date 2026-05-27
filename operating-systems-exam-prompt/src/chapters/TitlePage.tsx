import { motion } from 'framer-motion';
import { BookOpen, Cpu, Terminal, GitBranch, Zap, Star } from 'lucide-react';

export default function TitlePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
        >
          <Star size={12} />
          Premium Practical Exam Master Guide
          <Star size={12} />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            UNIX/Linux
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Process Management
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-400 mb-2 font-light"
        >
          Practical Exam Master Document
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 mb-12 italic"
        >
          "From Zero to Exam-Ready — A Complete OS Lab Companion"
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[
            { icon: Cpu, label: 'Process Internals', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300' },
            { icon: Terminal, label: 'exec() Family', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300' },
            { icon: GitBranch, label: 'fork() & wait()', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300' },
            { icon: BookOpen, label: 'Viva Q&A', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300' },
            { icon: Zap, label: 'Shell Internals', color: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-300' },
          ].map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r border text-xs font-medium ${color}`}
            >
              <Icon size={12} />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { num: '12', label: 'Chapters' },
            { num: '6', label: 'Code Files' },
            { num: '50+', label: 'Viva Questions' },
            { num: '100%', label: 'Exam Ready' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-black text-white mb-1">{num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Topics covered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">Topics Covered</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Process Fundamentals', 'Command Line Args', 'argc & argv',
              'execvp() System Call', 'fork() System Call', 'wait() & Synchronization',
              'Process Replacement', 'Shell Mechanism', 'fork+exec Model',
              'Error Handling', 'Memory Layout', 'Linux Internals',
              'Security Issues', 'Zombie Processes', 'Orphan Processes',
              'Process Tree', 'Signal Handling', 'File Descriptors',
            ].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="text-green-500 text-xs">✓</span>
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-xs text-gray-600 italic"
        >
          Operating Systems | Process Management | UNIX/Linux | C Programming Lab
        </motion.p>
      </motion.div>
    </div>
  );
}
