import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TitlePage from './chapters/TitlePage';
import TableOfContents from './chapters/TableOfContents';
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import Chapter4 from './chapters/Chapter4';
import Chapter5 from './chapters/Chapter5';
import Chapter6 from './chapters/Chapter6';
import Chapter7 from './chapters/Chapter7';
import Chapter8 from './chapters/Chapter8';
import Chapter9 from './chapters/Chapter9';
import Chapter10 from './chapters/Chapter10';
import Chapter11 from './chapters/Chapter11';
import Chapter12 from './chapters/Chapter12';
import CheatSheet from './chapters/CheatSheet';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const chapterOrder = [
  'title', 'toc', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6',
  'ch7', 'ch8', 'ch9', 'ch10', 'ch11', 'ch12', 'cheatsheet'
];

const chapterNames: Record<string, string> = {
  title: 'Title Page',
  toc: 'Table of Contents',
  ch1: 'Ch 1: Fundamentals',
  ch2: 'Ch 2: Command Line Args',
  ch3: 'Ch 3: execvp()',
  ch4: 'Ch 4: Process Replacement',
  ch5: 'Ch 5: fork()',
  ch6: 'Ch 6: wait()',
  ch7: 'Ch 7: Code Walkthroughs',
  ch8: 'Ch 8: Exam Notes',
  ch9: 'Ch 9: Viva Q&A',
  ch10: 'Ch 10: Errors & Debug',
  ch11: 'Ch 11: Linux Internals',
  ch12: 'Ch 12: Advanced',
  cheatsheet: 'Cheat Sheet',
};

const chapterComponents: Record<string, React.ComponentType> = {
  title: TitlePage,
  toc: TableOfContents,
  ch1: Chapter1,
  ch2: Chapter2,
  ch3: Chapter3,
  ch4: Chapter4,
  ch5: Chapter5,
  ch6: Chapter6,
  ch7: Chapter7,
  ch8: Chapter8,
  ch9: Chapter9,
  ch10: Chapter10,
  ch11: Chapter11,
  ch12: Chapter12,
  cheatsheet: CheatSheet,
};

export default function App() {
  const [activeChapter, setActiveChapter] = useState('title');
  const contentRef = useRef<HTMLDivElement>(null);

  const currentIndex = chapterOrder.indexOf(activeChapter);
  const prevChapter = currentIndex > 0 ? chapterOrder[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapterOrder.length - 1 ? chapterOrder[currentIndex + 1] : null;

  const handleChapterClick = (id: string) => {
    setActiveChapter(id);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ActiveComponent = chapterComponents[activeChapter] || TitlePage;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar activeChapter={activeChapter} onChapterClick={handleChapterClick} />

      {/* Main Content */}
      <div
        ref={contentRef}
        className="flex-1 lg:ml-64 xl:ml-72 min-h-screen overflow-y-auto"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800/60 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 pl-10 lg:pl-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-400">
                {chapterNames[activeChapter]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {chapterOrder.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-4 bg-blue-500'
                    : i < currentIndex
                    ? 'w-1.5 bg-blue-800'
                    : 'w-1.5 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Chapter Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="px-4 md:px-8 py-8"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="border-t border-gray-800/60 px-4 md:px-8 py-6 flex items-center justify-between">
          {prevChapter ? (
            <button
              onClick={() => handleChapterClick(prevChapter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-xl transition-all group text-sm"
            >
              <ChevronLeft size={16} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Previous</p>
                <p className="text-gray-300 font-medium text-xs">{chapterNames[prevChapter]}</p>
              </div>
            </button>
          ) : (
            <div />
          )}

          <div className="text-center hidden md:block">
            <p className="text-xs text-gray-600">
              {currentIndex + 1} / {chapterOrder.length}
            </p>
          </div>

          {nextChapter ? (
            <button
              onClick={() => handleChapterClick(nextChapter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-xl transition-all group text-sm"
            >
              <div className="text-right">
                <p className="text-xs text-gray-500">Next</p>
                <p className="text-gray-300 font-medium text-xs">{chapterNames[nextChapter]}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
