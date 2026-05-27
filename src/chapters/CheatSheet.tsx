import { ChapterHeader, AsciiDiagram, Mono, Table } from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function CheatSheet() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="★"
        title="Final Revision Cheat Sheet"
        subtitle="Everything critical — condensed into one power-packed reference page. Review this 30 minutes before your exam."
        icon="⚡"
        gradient="from-yellow-900/60 to-amber-900/40"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {/* exec() Quick Reference */}
        <div className="bg-gray-800/40 border border-purple-500/30 rounded-xl p-4">
          <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-3">⚡ exec() Quick Reference</p>
          <div className="space-y-1 text-xs font-mono">
            {[
              ['Never returns', 'on success'],
              ['Returns -1', 'on failure'],
              ['PID unchanged', 'after exec'],
              ['argv ends with', 'NULL always'],
              ['"v" = vector', 'array args'],
              ['"./" prefix', 'for local files'],
              ['"p" = PATH', 'search enabled'],
              ['Memory', 'completely replaced'],
              ['Open FDs', 'inherited'],
              ['Signal handlers', 'reset to default'],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-purple-300">{key}</span>
                <span className="text-gray-400">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* fork() Quick Reference */}
        <div className="bg-gray-800/40 border border-pink-500/30 rounded-xl p-4">
          <p className="text-xs font-black uppercase tracking-widest text-pink-400 mb-3">🌿 fork() Quick Reference</p>
          <div className="space-y-1 text-xs font-mono">
            {[
              ['In CHILD', 'returns 0'],
              ['In PARENT', 'returns child PID'],
              ['On failure', 'returns -1'],
              ['pid==0', '→ child branch'],
              ['pid>0', '→ parent branch'],
              ['pid<0', '→ error branch'],
              ['Child copies', 'parent memory (COW)'],
              ['Order?', 'non-deterministic'],
              ['Parent should', 'call wait()'],
              ['PID', 'different for child'],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-pink-300">{key}</span>
                <span className="text-gray-400">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* wait() Quick Reference */}
        <div className="bg-gray-800/40 border border-teal-500/30 rounded-xl p-4">
          <p className="text-xs font-black uppercase tracking-widest text-teal-400 mb-3">⏳ wait() Quick Reference</p>
          <div className="space-y-1 text-xs font-mono">
            {[
              ['Blocks until', 'child exits'],
              ['Returns', 'child PID'],
              ['Pass &status', 'to get exit code'],
              ['WIFEXITED(s)', 'normal exit?'],
              ['WEXITSTATUS(s)', 'exit code value'],
              ['WIFSIGNALED(s)', 'killed by signal?'],
              ['WTERMSIG(s)', 'signal number'],
              ['Zombie', 'no wait() called'],
              ['Orphan', 'parent exited first'],
              ['init adopts', 'orphan processes'],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-teal-300">{key}</span>
                <span className="text-gray-400">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* argc/argv Quick Reference */}
        <div className="bg-gray-800/40 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">💬 argc/argv Quick Reference</p>
          <div className="space-y-1 text-xs font-mono">
            {[
              ['argc min', '= 1 (prog name)'],
              ['argv[0]', '= program name'],
              ['argv[argc]', '= NULL always'],
              ['char *argv[]', '= char **argv (same)'],
              ['&argv[1]', '= skip program name'],
              ['execvp needs', 'NULL at end of array'],
              ['puts(str)', '= print + newline'],
              ['argv string', 'ends with \\0'],
              ['array ends', 'with NULL pointer'],
              ['argc count', 'INCLUDES argv[0]'],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-gray-700/30 pb-1">
                <span className="text-cyan-300">{key}</span>
                <span className="text-gray-400">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Fork+Exec Template */}
      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">⭐ The Master Template — fork+exec+wait</p>
        <CodeBlock
          code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char *argv[])
{
    if (argc < 2) {
        printf("Usage: %s <program> [args]\\n", argv[0]);
        return 1;
    }

    int pid, status;
    pid = fork();

    if (pid < 0) {
        perror("fork failed");
        return 1;
    }
    else if (pid == 0) {
        // CHILD: execute the program
        execvp(argv[1], &argv[1]);
        perror("execvp failed");   // Only runs if exec fails
        return 1;
    }
    else {
        // PARENT: wait for child
        wait(&status);
    }

    return 0;
}`}
          language="c"
          filename="master_template.c"
        />
      </div>

      {/* Memory Layout Quick Ref */}
      <AsciiDiagram title="Process Memory Layout (Quick)" content={`
  HIGH  ┌──────────────┐
        │   STACK      │ ← local vars, grows ↓
        │     ↓        │
        │  (free gap)  │
        │     ↑        │
        │   HEAP       │ ← malloc, grows ↑
        ├──────────────┤
        │   BSS        │ ← uninit globals
        ├──────────────┤
        │   DATA       │ ← init globals
        ├──────────────┤
        │   TEXT       │ ← your code (read-only)
  LOW   └──────────────┘`} />

      {/* exec family table */}
      <Table
        headers={['Function', 'Args Style', 'PATH?', 'Env?']}
        rows={[
          [<Mono key="1">execl()</Mono>, 'list', 'No', 'Inherit'],
          [<Mono key="2">execv()</Mono>, 'array', 'No', 'Inherit'],
          [<Mono key="3">execlp()</Mono>, 'list', 'YES', 'Inherit'],
          [<Mono key="4">execvp()</Mono>, 'array', 'YES', 'Inherit'],
          [<Mono key="5">execle()</Mono>, 'list', 'No', 'Custom'],
          [<Mono key="6">execve()</Mono>, 'array', 'No', 'Custom'],
        ]}
      />

      {/* Last-minute brain dumps */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">🧠 Last-Minute Brain Dump — 20 Facts</p>
        <div className="grid md:grid-cols-2 gap-1">
          {[
            '1. exec() success = NEVER returns',
            '2. fork() child gets PID = 0',
            '3. fork() parent gets child\'s PID',
            '4. exec() keeps same PID',
            '5. argv[] MUST end with NULL',
            '6. argv[argc] is always NULL (C standard)',
            '7. argc always ≥ 1',
            '8. argv[0] = program name',
            '9. &argv[1] = sub-array from index 1',
            '10. "p" in execvp = PATH search',
            '11. "v" in execvp = vector/array args',
            '12. wait() blocks until child exits',
            '13. zombie = child done, no wait() called',
            '14. orphan = parent gone, child still running',
            '15. init (PID 1) adopts orphans',
            '16. fork() copies memory (COW)',
            '17. exec() destroys old memory',
            '18. exec() keeps open file descriptors',
            '19. puts() adds newline automatically',
            '20. execvp on "./" skips PATH search',
          ].map((fact) => (
            <p key={fact} className="text-xs text-gray-300 py-0.5">{fact}</p>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center py-8 border-t border-gray-700/50">
        <p className="text-2xl mb-2">🎓</p>
        <p className="text-white font-bold mb-1">You are now EXAM READY!</p>
        <p className="text-xs text-gray-500 italic">
          "The expert in anything was once a beginner who refused to give up."
        </p>
        <p className="text-xs text-gray-600 mt-3">
          UNIX/Linux Process Management | OS Lab Practical Exam Guide
        </p>
      </div>
    </div>
  );
}
