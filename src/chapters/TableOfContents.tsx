import { ChapterHeader, P } from '../components/UI';
import { BookOpen } from 'lucide-react';

const tocData = [
  {
    chapter: '1', title: 'Fundamentals of Processes',
    subtopics: ['What is a Process?', 'Process vs Program', 'Process States', 'Process Image / Memory Layout', 'PID, PPID, UID Explained'],
    color: 'text-green-400', dot: 'bg-green-400'
  },
  {
    chapter: '2', title: 'Command Line Arguments',
    subtopics: ['argc and argv explained', 'String array visualization', 'NULL termination', 'Pointer to pointer (*argv[])', 'Dry run examples'],
    color: 'text-cyan-400', dot: 'bg-cyan-400'
  },
  {
    chapter: '3', title: 'execvp() Deep Dive',
    subtopics: ['exec family overview', 'execvp() signature & parameters', 'PATH resolution', 'Why exec replaces the process', 'Internal OS mechanism'],
    color: 'text-purple-400', dot: 'bg-purple-400'
  },
  {
    chapter: '4', title: 'Process Replacement',
    subtopics: ['Memory image replacement', 'What gets replaced vs inherited', 'Why code after exec never runs', 'exec failure handling'],
    color: 'text-orange-400', dot: 'bg-orange-400'
  },
  {
    chapter: '5', title: 'fork() Deep Dive',
    subtopics: ['fork() fundamentals', 'Return values (0, PID, -1)', 'Parent & child execution', 'Copy-on-Write (COW)', 'fork bomb'],
    color: 'text-pink-400', dot: 'bg-pink-400'
  },
  {
    chapter: '6', title: 'wait() and Synchronization',
    subtopics: ['wait() vs waitpid()', 'Zombie processes', 'Orphan processes', 'Status codes explained', 'Synchronization patterns'],
    color: 'text-teal-400', dot: 'bg-teal-400'
  },
  {
    chapter: '7', title: 'Complete Code Walkthroughs',
    subtopics: ['file_info.c', 'exec1.c & exec2.c', 'exec_demo1.c', 'exec_demo2.c', 'fork.c'],
    color: 'text-indigo-400', dot: 'bg-indigo-400'
  },
  {
    chapter: '8', title: 'Practical Exam Important Notes',
    subtopics: ['Must-know facts', 'Common exam patterns', 'Tricky questions', 'Output prediction', 'Exam-oriented code patterns'],
    color: 'text-yellow-400', dot: 'bg-yellow-400'
  },
  {
    chapter: '9', title: 'Viva Questions with Answers',
    subtopics: ['Basic level questions', 'Intermediate questions', 'Advanced questions', 'Trick questions', 'Interview-style questions'],
    color: 'text-green-400', dot: 'bg-green-400'
  },
  {
    chapter: '10', title: 'Common Errors and Debugging',
    subtopics: ['NULL termination errors', 'exec path errors', 'fork() misuse', 'Zombie process bugs', 'Permission errors'],
    color: 'text-red-400', dot: 'bg-red-400'
  },
  {
    chapter: '11', title: 'Real Linux Internal Working',
    subtopics: ['Kernel process table', 'execve() system call', 'ELF binary loading', 'fork() in the kernel', 'Scheduler interaction'],
    color: 'text-cyan-400', dot: 'bg-cyan-400'
  },
  {
    chapter: '12', title: 'Advanced Concepts for Extra Marks',
    subtopics: ['Signals & process control', 'File descriptor inheritance', 'Environment variables', 'setuid & security', 'pipe() + fork() patterns'],
    color: 'text-purple-400', dot: 'bg-purple-400'
  },
];

export default function TableOfContents() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="—"
        title="Table of Contents"
        subtitle="Your complete navigation guide through every concept, code, and exam question in this document."
        icon="📋"
        gradient="from-gray-800 to-gray-900"
      />

      <P>This document is structured to take you from <strong className="text-white">zero knowledge</strong> to <strong className="text-white">exam-ready</strong> in a logical, progressive manner. Each chapter builds on the previous one. Do not skip ahead!</P>

      <div className="space-y-3 mt-6">
        {tocData.map((item) => (
          <div key={item.chapter} className="bg-gray-800/30 border border-gray-700/40 rounded-xl p-4 hover:border-gray-600/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-gray-300">{item.chapter}</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm mb-2 ${item.color}`}>{item.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.subtopics.map((sub) => (
                    <span key={sub} className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`w-1 h-1 rounded-full ${item.dot} opacity-60`}></span>
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <BookOpen size={16} className="text-gray-600 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">How to Use This Guide</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'First Time?', desc: 'Read chapters 1–6 in order. Build your foundation before looking at code.' },
            { icon: '📝', title: 'Exam Tomorrow?', desc: 'Jump to Ch 8 (Exam Notes) + Ch 9 (Viva Q&A) + the Cheat Sheet.' },
            { icon: '💻', title: 'Need Code Help?', desc: 'Go to Chapter 7 for complete code walkthroughs with line-by-line explanations.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-bold text-white mb-1">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
