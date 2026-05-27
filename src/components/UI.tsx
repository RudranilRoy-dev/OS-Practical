import { ReactNode } from 'react';
import { AlertTriangle, Lightbulb, BookOpen, Zap, Info, CheckCircle, HelpCircle } from 'lucide-react';

interface BoxProps { children: ReactNode; className?: string; }

export const InfoBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 my-4 ${className}`}>
    <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-blue-200 leading-relaxed">{children}</div>
  </div>
);

export const WarningBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-yellow-950/40 border border-yellow-500/30 my-4 ${className}`}>
    <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-yellow-200 leading-relaxed">{children}</div>
  </div>
);

export const TipBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-green-950/40 border border-green-500/30 my-4 ${className}`}>
    <Lightbulb size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-green-200 leading-relaxed">{children}</div>
  </div>
);

export const ExamBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 my-4 ${className}`}>
    <BookOpen size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-purple-200 leading-relaxed">{children}</div>
  </div>
);

export const VivaBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-orange-950/40 border border-orange-500/30 my-4 ${className}`}>
    <HelpCircle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-orange-200 leading-relaxed">{children}</div>
  </div>
);

export const KeyBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 my-4 ${className}`}>
    <Zap size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-cyan-200 leading-relaxed">{children}</div>
  </div>
);

export const SuccessBox = ({ children, className = '' }: BoxProps) => (
  <div className={`flex gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 my-4 ${className}`}>
    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-emerald-200 leading-relaxed">{children}</div>
  </div>
);

export const SectionDivider = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="my-8">
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      <div className="text-center">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
    </div>
  </div>
);

export const ChapterHeader = ({
  number, title, subtitle, icon, gradient
}: {
  number: string; title: string; subtitle: string; icon: string; gradient: string;
}) => (
  <div className={`relative overflow-hidden rounded-2xl p-8 mb-8 bg-gradient-to-br ${gradient} border border-white/10`}>
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 text-8xl flex items-center justify-center">{icon}</div>
    <div className="relative z-10">
      <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 bg-white/10 px-3 py-1 rounded-full">
        Chapter {number}
      </span>
      <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{title}</h1>
      <p className="text-white/70 text-sm md:text-base max-w-2xl">{subtitle}</p>
    </div>
  </div>
);

export const AsciiDiagram = ({ title, content }: { title?: string; content: string }) => (
  <div className="my-4 rounded-xl overflow-hidden border border-gray-700/50">
    {title && (
      <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700/50">
        <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    )}
    <pre className="bg-gray-900/80 p-4 text-xs font-mono text-green-400 overflow-x-auto leading-relaxed whitespace-pre">
      {content}
    </pre>
  </div>
);

export const Table = ({ headers, rows, className = '' }: { headers: string[]; rows: (string | ReactNode)[][]; className?: string }) => (
  <div className={`overflow-x-auto rounded-xl border border-gray-700/50 my-4 ${className}`}>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-800/80">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-700/50">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/20'}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-4 py-3 text-gray-300 border-b border-gray-700/20 text-xs leading-relaxed">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Mono = ({ children }: { children: ReactNode }) => (
  <code className="font-mono text-xs bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded border border-gray-700/50">{children}</code>
);

export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
    <span className="w-1 h-6 bg-blue-500 rounded-full inline-block"></span>
    {children}
  </h2>
);

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-bold text-gray-100 mt-6 mb-3">{children}</h3>
);

export const H4 = ({ children }: { children: ReactNode }) => (
  <h4 className="text-base font-semibold text-gray-200 mt-4 mb-2">{children}</h4>
);

export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-gray-300 leading-relaxed text-sm mb-3">{children}</p>
);

export const Ul = ({ items }: { items: (string | ReactNode)[] }) => (
  <ul className="space-y-1.5 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
        <span className="text-blue-400 mt-1 flex-shrink-0">▸</span>
        <span className="leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

export const NumberedList = ({ items }: { items: (string | ReactNode)[] }) => (
  <ol className="space-y-2 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
        <span className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0 mt-0.5">
          {i + 1}
        </span>
        <span className="leading-relaxed">{item}</span>
      </li>
    ))}
  </ol>
);

export const VivaQA = ({ questions }: { questions: { q: string; a: string | ReactNode }[] }) => (
  <div className="space-y-3 my-4">
    {questions.map((item, i) => (
      <div key={i} className="rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="bg-orange-950/30 border-b border-orange-800/30 px-4 py-3">
          <p className="text-sm font-semibold text-orange-300">
            <span className="text-orange-500 mr-2">Q{i + 1}.</span>{item.q}
          </p>
        </div>
        <div className="bg-gray-900/40 px-4 py-3">
          <div className="text-sm text-gray-300 leading-relaxed">
            <span className="text-green-400 font-semibold mr-2">A:</span>{item.a}
          </div>
        </div>
      </div>
    ))}
  </div>
);
