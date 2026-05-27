import {
  ChapterHeader, H2, H3, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, KeyBox
} from '../components/UI';

export default function Chapter8() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="8"
        title="Practical Exam Important Notes"
        subtitle="The concentrated exam-winning knowledge. Everything you MUST know before stepping into your practical exam. These points appear in almost every OS exam."
        icon="📝"
        gradient="from-yellow-900/60 to-amber-900/40"
      />

      <ExamBox>
        <strong>How to Use This Chapter:</strong> Read these points the night before your exam. Each point is exam-tested and commonly asked. Don't skip any.
      </ExamBox>

      <H2>8.1 The 10 Golden Rules of exec()</H2>
      <div className="space-y-2">
        {[
          { num: '01', rule: 'exec() NEVER returns on success', detail: 'If execvp() returns, it FAILED. Code after exec() is dead code on success.' },
          { num: '02', rule: 'PID stays the same after exec()', detail: 'The process identity (PID) is preserved. Only the memory image changes.' },
          { num: '03', rule: 'argv array MUST end with NULL', detail: 'execvp() scans argv[] until NULL. Without it = undefined behavior.' },
          { num: '04', rule: '"v" in execvp means vector (array)', detail: 'Arguments are passed as an array. "l" variants use varargs (comma list).' },
          { num: '05', rule: '"p" in execvp means PATH search', detail: 'Without "p" variants, you must provide the full/relative path yourself.' },
          { num: '06', rule: 'argv[0] should be the program name', detail: 'By Unix convention, argv[0] of the exec\'d program is its own name.' },
          { num: '07', rule: 'Open file descriptors survive exec()', detail: 'stdin (0), stdout (1), stderr (2) are inherited unless FD_CLOEXEC is set.' },
          { num: '08', rule: 'exec fails: check errno', detail: 'ENOENT = file not found, EACCES = permission denied, ENOEXEC = not executable.' },
          { num: '09', rule: 'Environment variables survive exec()', detail: 'execvp() inherits the current process\'s environment (PATH, HOME, etc.).' },
          { num: '10', rule: 'exec replaces the ENTIRE memory image', detail: 'Text, data, BSS, heap, and stack are ALL replaced with the new program\'s.' },
        ].map(({ num, rule, detail }) => (
          <div key={num} className="flex gap-3 bg-gray-800/30 border border-gray-700/40 rounded-xl p-3">
            <span className="text-xs font-black text-yellow-400 w-8 flex-shrink-0 mt-0.5">#{num}</span>
            <div>
              <p className="text-sm font-bold text-white">{rule}</p>
              <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <H2>8.2 The 5 Golden Rules of fork()</H2>
      <div className="space-y-2">
        {[
          { rule: 'fork() returns 0 in child, child\'s PID in parent', detail: 'This is tested in EVERY OS exam. Zero means child. Positive means parent.' },
          { rule: 'fork() creates an EXACT copy of the parent', detail: 'Child gets copies of all variables, open files, code. They execute independently after fork().' },
          { rule: 'fork() + exec() is the shell pattern', detail: 'Shell forks → child execs command → parent waits. This is how ALL Unix shells work.' },
          { rule: 'fork() with -1 return means failure', detail: 'System-level failure (no memory, too many processes). Always check for -1.' },
          { rule: 'Parent should call wait() for each child', detail: 'Otherwise children become zombies. One wait() per fork() call (typically).' },
        ].map(({ rule, detail }, i) => (
          <div key={i} className="flex gap-3 bg-pink-900/20 border border-pink-700/30 rounded-xl p-3">
            <span className="text-xs font-black text-pink-400 w-6 flex-shrink-0 mt-0.5">{i + 1}.</span>
            <div>
              <p className="text-sm font-bold text-white">{rule}</p>
              <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <H2>8.3 Output Prediction Questions</H2>
      <P>Examiners love to show you code and ask "what is the output?" Here's how to approach them:</P>

      <AsciiDiagram title="Output Prediction Strategy" content={`
  Step 1: Trace fork() return values
          (pid==0 → child, pid>0 → parent, pid<0 → error)

  Step 2: Identify what each branch does
          (which prints? which execs? which waits?)

  Step 3: Determine order of execution
          (is parent waiting? does child run first?)

  Step 4: Track execvp() calls
          (after exec → all subsequent code is dead)

  Step 5: Consider what exec'd program prints
          (exec1, exec2 print their arguments)

  Common Trap:
  Code AFTER exec() ← what does it print?
  Answer: NOTHING (if exec succeeds)
          Only prints if exec FAILS`} />

      <H3>Predict Output — Practice Questions</H3>
      <div className="space-y-4">
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Question 1:</p>
          <p className="text-xs font-mono text-gray-300 mb-3">{'$ ./exec_demo1  (where exec1.c is compiled and available)'}</p>
          <p className="text-xs font-bold text-green-400 mb-1">Answer:</p>
          <p className="text-xs text-gray-300 font-mono">I am exec1.c{'\n'}The no. of arguments is 1.{'\n'}The arguments are:./exec1</p>
          <p className="text-xs text-gray-500 mt-2">Note: "Ending-----" is NEVER printed.</p>
        </div>
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Question 2:</p>
          <p className="text-xs font-mono text-gray-300 mb-3">{'$ ./fork ./exec2 hello world'}</p>
          <p className="text-xs font-bold text-green-400 mb-1">Answer:</p>
          <p className="text-xs text-gray-300 font-mono">I am exec2.c called by execvp(){'\n'}The no. of arguments is 3.{'\n'}The arguments are:./exec2{'\n'}hello{'\n'}world</p>
        </div>
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Question 3:</p>
          <p className="text-xs font-mono text-gray-300 mb-3">{'$ ./exec_demo2 ./exec1  (what prints, in what order?)'}</p>
          <p className="text-xs font-bold text-green-400 mb-1">Answer:</p>
          <p className="text-xs text-gray-300 font-mono">./exec_demo2{'\n'}I am exec1.c{'\n'}The no. of arguments is 1.{'\n'}The arguments are:./exec1</p>
          <p className="text-xs text-gray-500 mt-2">Note: puts(argv[0]) prints before exec. Exec then takes over.</p>
        </div>
      </div>

      <H2>8.4 Common Exam Patterns</H2>
      <Table
        headers={['Pattern', 'What to Write', 'Remember']}
        rows={[
          ['Create a child', 'pid = fork()', 'Always check return value'],
          ['Child executes', 'if(pid==0) execvp(...)', 'pid==0 → child'],
          ['Parent waits', 'else wait(&status)', 'pid>0 → parent'],
          ['Error after exec', 'perror("execvp failed"); return 1;', 'Runs only if exec fails'],
          ['Build argv', 'char *args[] = {"prog", "arg1", NULL}', 'NULL at the END always'],
          ['Dynamic argv', 'execvp(argv[1], &argv[1])', '&argv[1] skips our own name'],
          ['Error check fork', 'if(pid < 0) { perror(); exit(1); }', 'Always check for -1'],
        ]}
      />

      <H2>8.5 Must-Know Facts for Viva</H2>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          { q: 'PID after exec()?', a: 'Unchanged — same PID' },
          { q: 'Return of fork() in child?', a: '0 (zero)' },
          { q: 'Return of fork() in parent?', a: "Child's PID" },
          { q: 'exec() on failure?', a: 'Returns -1, sets errno' },
          { q: 'NULL in argv — why?', a: 'Marks end of argument array' },
          { q: 'argv[0] is?', a: "Always the program's own name" },
          { q: 'Zombie process?', a: 'Child exited, parent not called wait()' },
          { q: 'Orphan process?', a: 'Parent exited before child' },
          { q: 'PATH search in execvp?', a: "'p' means yes — searches PATH" },
          { q: 'fork() creates?', a: 'An identical copy (child process)' },
          { q: 'wait() does what?', a: 'Blocks parent until child exits' },
          { q: 'Code after exec()?', a: 'Dead code — never runs on success' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3 flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-blue-300">{q}</p>
              <p className="text-xs text-green-300 mt-1">→ {a}</p>
            </div>
          </div>
        ))}
      </div>

      <H2>8.6 Compilation and Running Commands</H2>
      <AsciiDiagram title="Compile and Run Commands" content={`
  # Compile individual files:
  $ gcc file_info.c -o file_info
  $ gcc exec1.c -o exec1
  $ gcc exec2.c -o exec2
  $ gcc exec_demo1.c -o exec_demo1
  $ gcc exec_demo2.c -o exec_demo2
  $ gcc fork.c -o fork

  # Run them:
  $ ./file_info /etc/passwd
  $ ./exec1                       # Run directly
  $ ./exec_demo1                  # exec_demo1 → exec1
  $ ./exec_demo2 ./exec1          # exec_demo2 → exec1
  $ ./exec_demo2 ./exec2 5 7      # exec_demo2 → exec2 with args
  $ ./fork ./exec1                # fork + exec pattern
  $ ./fork ./exec2 hello world    # fork → exec2 with args

  # Compile all at once:
  $ gcc *.c -o output    # (not recommended if multiple mains exist)

  # Debug compilation:
  $ gcc -Wall -Wextra -g file_info.c -o file_info`} />

      <TipBox>
        <strong>Exam Tip:</strong> Always compile exec1.c and exec2.c FIRST before running exec_demo1 or fork.c — those programs need the compiled exec1 and exec2 binaries to exist in the current directory!
      </TipBox>

      <KeyBox>
        <strong>The One Thing That Gets Everyone:</strong> Students forget that exec_demo1, exec_demo2, and fork.c look for <Mono>./exec1</Mono> or <Mono>./exec2</Mono> in the CURRENT DIRECTORY. If you're in a different directory, or haven't compiled them, execvp() will fail silently (or print "execvp failed").
      </KeyBox>
    </div>
  );
}
