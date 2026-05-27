import { useState } from 'react';
import {
  ChapterHeader, H3, P, InfoBox, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, KeyBox, VivaQA, NumberedList, SuccessBox
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';
import { codes } from '../data/codes';
import { ChevronDown, ChevronRight } from 'lucide-react';

function CodeSection({ title, code, filename, children }: { title: string; code: string; filename: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-700/50 rounded-2xl overflow-hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 bg-gray-800/60 hover:bg-gray-800/80 transition-colors text-left"
      >
        {open ? <ChevronDown size={18} className="text-blue-400" /> : <ChevronRight size={18} className="text-blue-400" />}
        <span className="font-bold text-white">{title}</span>
        <span className="text-xs text-gray-500 ml-auto font-mono">{filename}</span>
      </button>
      {open && (
        <div className="p-6 space-y-4">
          <CodeBlock code={code} language="c" filename={filename} />
          {children}
        </div>
      )}
    </div>
  );
}

export default function Chapter7() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="7"
        title="Complete Code Walkthroughs"
        subtitle="Every single code file from your lab session — explained line-by-line, with execution flow, OS behavior, memory diagrams, expected output, and viva questions."
        icon="💻"
        gradient="from-indigo-900/60 to-blue-900/40"
      />

      <InfoBox>
        This is the most important chapter for your practical exam. Each code is explained in complete detail. Click any section to expand/collapse it.
      </InfoBox>

      {/* =================== file_info.c =================== */}
      <CodeSection title="📄 file_info.c — execvp Launching System Command" code={codes.file_info} filename="file_info.c">
        <H3>Purpose of the Program</H3>
        <P>
          file_info.c demonstrates how a C program can use <Mono>execvp()</Mono> to run a system command (<Mono>ls -l</Mono>) on a file whose name is provided as a command-line argument. It's a bridge between your program and existing system tools.
        </P>

        <H3>Header Files Explained</H3>
        <Table
          headers={['Header', 'What it provides']}
          rows={[
            [<Mono key="1">#include &lt;stdio.h&gt;</Mono>, 'printf(), perror() — for output and error messages'],
            [<Mono key="2">#include &lt;stdlib.h&gt;</Mono>, 'exit() — for clean program termination'],
            [<Mono key="3">#include &lt;unistd.h&gt;</Mono>, 'execvp() — the star of the show; all exec functions live here'],
          ]}
        />

        <H3>Line-by-Line Explanation</H3>
        <AsciiDiagram title="Line-by-Line Breakdown" content={`
  int main(int argc, char *argv[])
  └── Takes command line args. argc = count, argv = array of strings

  if (argc < 2) {
  └── If user didn't provide a filename (argc would be 1 minimum)
      printf("Usage: %s <filename>\\n", argv[0]);
      └── Print how to use this program correctly
      exit(1);
      └── Exit with error code 1 (non-zero = something went wrong)
  }

  printf("Program name : %s\\n", argv[0]);
  └── Print the name of THIS program (always argv[0])

  printf("File to examine: %s\\n", argv[1]);
  └── Print the filename the user passed as argument

  printf("Total arguments: %d\\n", argc);
  └── Print how many arguments were given

  char *args[] = {"ls", "-l", argv[1], NULL};
  └── Build the argument array for execvp:
      args[0] = "ls"        ← program to run
      args[1] = "-l"        ← flag: long listing format
      args[2] = argv[1]     ← filename passed by user
      args[3] = NULL        ← MANDATORY null terminator

  execvp("ls", args);
  └── Replace THIS process with 'ls -l <filename>'
      "ls" → searched in PATH → found at /bin/ls
      On success: NEVER returns here

  perror("execvp failed");
  └── ONLY runs if execvp() returned (failed)
      perror prints: "execvp failed: <system error message>"

  return 1;
  └── Exit with error (also only reached if execvp failed)`} />

        <H3>Dry Run Example</H3>
        <AsciiDiagram title="Execution Trace" content={`
  Command: $ ./file_info /etc/passwd

  argc = 2
  argv[0] = "./file_info"
  argv[1] = "/etc/passwd"

  Output before exec:
  Program name : ./file_info
  File to examine: /etc/passwd
  Total arguments: 2

  args array: {"ls", "-l", "/etc/passwd", NULL}
  execvp("ls", args) → ls -l /etc/passwd

  After exec (ls takes over):
  -rw-r--r-- 1 root root 2432 Jan  1 12:00 /etc/passwd`} />

        <H3>Memory/Process Visualization</H3>
        <AsciiDiagram title="Process Replacement" content={`
  Before execvp:                After execvp:
  ┌────────────────────┐        ┌────────────────────┐
  │ PID: 5000          │        │ PID: 5000 (SAME!)  │
  │ Code: file_info.c  │  ───►  │ Code: /bin/ls      │
  │ args: {"ls","-l",..│        │ args: ["ls","-l",..]│
  └────────────────────┘        └────────────────────┘`} />

        <VivaQA questions={[
          { q: 'Why is argc checked before using argv[1]?', a: 'If argc < 2, argv[1] doesn\'t exist. Accessing it would cause undefined behavior (likely a segfault). Always validate argc before accessing argv elements.' },
          { q: 'Why is NULL added at the end of args[]?', a: 'execvp() scans the args array until it finds NULL to know where arguments end. Without NULL, it would read garbage memory past the array — undefined behavior.' },
          { q: 'Why does exit(1) rather than return(1) appear in the error check?', a: 'Both work from main(). exit(1) is more explicit about intentional program termination. exit() flushes buffers and calls cleanup functions (atexit handlers). return from main() also ultimately calls exit(), but exit() makes intent clear.' },
        ]} />

        <ExamBox>
          <strong>🎯 Improvement:</strong> A professional version would check for execvp failure using errno and handle permission errors (EACCES) and file-not-found (ENOENT) separately.
        </ExamBox>
      </CodeSection>

      {/* =================== exec1.c =================== */}
      <CodeSection title="📄 exec1.c — The Target Program (Receiver)" code={codes.exec1} filename="exec1.c">
        <H3>Purpose of the Program</H3>
        <P>
          exec1.c is a <strong className="text-white">target program</strong> — it's designed to be launched BY another program using execvp(). It simply announces itself and prints what arguments it received. This is crucial for understanding what exec() passes to the new program.
        </P>

        <H3>Line-by-Line Explanation</H3>
        <NumberedList items={[
          <><Mono>int main(int argc, char *argv[])</Mono> — Receives whatever arguments the caller passed to execvp(). These become exec1's own argc and argv.</>,
          <><Mono>printf("I am exec1.c\n")</Mono> — Identifies itself. Only runs if exec1 is successfully exec'd.</>,
          <><Mono>printf("\nThe no. of arguments is %d.\n", argc)</Mono> — Prints argument count. Note: argc here counts exec1's OWN arguments, not the caller's.</>,
          <><Mono>for (int i = 0; i &lt; argc; i++)</Mono> — Iterates through ALL arguments including argv[0] (program name).</>,
          <><Mono>puts(argv[i])</Mono> — Prints each argument string followed by a newline (puts adds '\n' automatically).</>,
          <><Mono>printf("\t")</Mono> — Prints a tab after each argument (slight formatting quirk).</>,
        ]} />

        <H3>What argv Looks Like When exec1 Runs</H3>
        <AsciiDiagram title="argv in exec1 when called from exec_demo1" content={`
  exec_demo1 calls: execvp(args[0], args)
  where args = {"./exec1", NULL}

  exec1 receives:
  ┌─────────────────────────────┐
  │ argc    = 1                 │
  │ argv[0] = "./exec1"         │
  │ argv[1] = NULL              │
  └─────────────────────────────┘

  But if exec_demo called: execvp("./exec2", {"./exec2","5","7",NULL})
  Then exec1/exec2 receives:
  ┌─────────────────────────────┐
  │ argc    = 3                 │
  │ argv[0] = "./exec2"         │
  │ argv[1] = "5"               │
  │ argv[2] = "7"               │
  │ argv[3] = NULL              │
  └─────────────────────────────┘`} />

        <ExamBox>
          <strong>🎯 KEY EXAM FACT:</strong> When execvp() transfers control to exec1.c, the argv[0] of exec1 is whatever was args[0] in the caller's execvp() call. If you pass <Mono>{"./exec1"}</Mono> as args[0], then exec1's argv[0] is <Mono>"./exec1"</Mono>.
        </ExamBox>

        <VivaQA questions={[
          { q: 'What is the difference between puts() and printf() for printing strings?', a: 'puts(str) prints the string and automatically adds a newline at the end. printf("%s\\n", str) is equivalent. puts() is simpler but you cannot format the output. printf() gives full control but you must add \\n manually.' },
          { q: 'Why is exec1.c considered a "target" program?', a: 'Because it\'s designed to be launched by another program (exec_demo1) via execvp(). It\'s not meant to be run directly (though you can). Its purpose is to demonstrate receiving arguments from exec().' },
        ]} />
      </CodeSection>

      {/* =================== exec2.c =================== */}
      <CodeSection title="📄 exec2.c — Target Program with int i Declaration" code={codes.exec2} filename="exec2.c">
        <H3>Purpose of the Program</H3>
        <P>
          exec2.c is almost identical to exec1.c — it's another target program that announces itself and prints its arguments. The key difference is the <Mono>int i;</Mono> declaration style (C89 style, declared at top of function) and the message says "called by execvp()".
        </P>

        <H3>Key Difference from exec1.c</H3>
        <Table
          headers={['Feature', 'exec1.c', 'exec2.c']}
          rows={[
            ['i variable', 'Declared in for loop: for(int i=0;...)', 'Declared separately: int i; before loop'],
            ['Message', '"I am exec1.c"', '"I am exec2.c called by execvp()"'],
            ['C Standard', 'C99/C11 (declaration in for)', 'C89/C90 compatible'],
            ['Functionality', 'Identical', 'Identical'],
          ]}
        />

        <H3>C89 vs C99 Style</H3>
        <CodeBlock
          code={`// C89 style (exec2.c uses this):
int main()
{
    int i;  // MUST declare all variables at top of block
    for (i = 0; i < argc; i++) { ... }
}

// C99/C11 style (exec1.c uses this):
int main()
{
    for (int i = 0; i < argc; i++) { ... }
    // Variable declared inside for loop — C99 feature
}`}
          language="c"
          filename="c89_vs_c99.c"
        />

        <TipBox>
          <strong>Why it matters for exams:</strong> If your compiler uses <Mono>gcc -std=c89</Mono> or <Mono>gcc -ansi</Mono>, it won't accept the C99 style. Always declare variables at the top of a block for maximum compatibility, especially in exam environments.
        </TipBox>

        <VivaQA questions={[
          { q: 'What is the functional difference between exec1.c and exec2.c?', a: 'Functionally, there is almost no difference. Both accept argc/argv, print them, and exit. exec2.c uses C89 variable declaration style (int i at top) while exec1.c uses C99 style (int i inside for). exec2 also mentions being called by execvp() in its message.' },
        ]} />
      </CodeSection>

      {/* =================== exec_demo1.c =================== */}
      <CodeSection title="📄 exec_demo1.c — Simple execvp Demonstration" code={codes.exec_demo1} filename="exec_demo1.c">
        <H3>Purpose of the Program</H3>
        <P>
          exec_demo1.c is the <strong className="text-white">caller</strong> — it shows the simplest possible use of execvp(). It creates a hardcoded argument array and calls execvp() to become exec1.c. The commented-out alternatives show different ways to call execvp().
        </P>

        <H3>Understanding the Commented-Out Code</H3>
        <CodeBlock
          code={`// Original working code:
char *args[] = {"./exec1", NULL};

// COMMENTED ALTERNATIVES (for learning):
// char *args[] = {"./exec2", "5", "7", NULL};  // Call exec2 with args
// execvp("./exec2", args);                     // Specify exec2 explicitly
// execvp(args[0], args);                       // Use args[0] as program name
// execvp("./exec1", args);                     // Explicit path

// ACTUAL CALL:
execvp(args[0], args);  // args[0] = "./exec1"

// ALL OF THESE are equivalent ways to exec "./exec1":
execvp("./exec1", args);      // explicit program name
execvp(args[0], args);        // use args[0] as name (same result)`}
          language="c"
          filename="exec_demo1_alternatives.c"
        />

        <H3>Complete Execution Flow</H3>
        <AsciiDiagram title="exec_demo1.c Full Execution Flow" content={`
  $ ./exec_demo1

  Step 1: OS loads exec_demo1 into memory (PID = 1234)
  Step 2: main() starts
  Step 3: args[] = {"./exec1", NULL} — array created on stack
  Step 4: execvp(args[0], args) called
         → args[0] = "./exec1"
         → PATH not searched (has "./")
         → ./exec1 found in current directory
  Step 5: exec_demo1's memory DESTROYED
  Step 6: exec1's code loaded (STILL PID 1234)
  Step 7: exec1's main() starts with:
         argc = 1
         argv[0] = "./exec1"
         argv[1] = NULL
  Step 8: exec1 prints its output
  Step 9: exec1 returns 0, process exits

  printf("Ending-----") → NEVER RUNS (process was replaced)

  Expected Output:
  I am exec1.c
  The no. of arguments is 1.
  The arguments are:./exec1`} />

        <H3>What If exec Fails?</H3>
        <AsciiDiagram title="exec_demo1 Failure Scenario" content={`
  If "./exec1" doesn't exist or isn't compiled:

  Step 1-4: Same as above
  Step 5: execvp() returns -1 (FAILS)
  Step 6: Execution CONTINUES in exec_demo1
  Step 7: printf("Ending-----") RUNS!

  Expected Output on failure:
  Ending-----

  Note: There's no error handling in exec_demo1!
  A better version would have perror() after execvp()`} />

        <WarningBox>
          <strong>Beginner Mistake:</strong> Many students think <Mono>printf("Ending-----")</Mono> ALWAYS runs. It only runs if execvp() FAILS. If exec succeeds, exec_demo1 is gone and can never print anything.
        </WarningBox>

        <VivaQA questions={[
          { q: 'In exec_demo1.c, what does execvp(args[0], args) mean?', a: 'execvp(args[0], args) calls execvp with args[0]="./exec1" as the program to run, and the full args array ({"./exec1", NULL}) as the argument list. So exec1 receives argv[0]="./exec1" and argc=1.' },
          { q: 'Why is printf("Ending-----") never printed on successful exec?', a: 'When execvp() succeeds, the entire process memory (including exec_demo1\'s code) is replaced with exec1\'s code. The printf line no longer exists in memory. There is nothing to execute it. It only runs if execvp() FAILS and returns control to exec_demo1.' },
          { q: 'What is the difference between execvp(args[0], args) and execvp("./exec1", args)?', a: 'They are functionally identical in this case since args[0] IS "./exec1". The first form is more flexible because changing args[0] automatically changes the target program.' },
        ]} />
      </CodeSection>

      {/* =================== exec_demo2.c =================== */}
      <CodeSection title="📄 exec_demo2.c — Dynamic execvp Using argv" code={codes.exec_demo2} filename="exec_demo2.c">
        <H3>Purpose of the Program</H3>
        <P>
          exec_demo2.c is more sophisticated — instead of hardcoding the target program, it takes arguments from the command line and uses them dynamically. It accepts its own argv and forwards part of it to execvp(). This is the pattern used by the shell!
        </P>

        <H3>Line-by-Line Explanation</H3>
        <AsciiDiagram title="Detailed Line Analysis" content={`
  int main(int argc, char *argv[])
  └── argc and argv are from the COMMAND LINE when exec_demo2 runs

  if (argc > 1) {
  └── Only if at least one argument was passed (besides program name)
      argv[argc] = NULL;
      └── This EXPLICITLY sets the end marker to NULL
          Why? C standard guarantees argv[argc] is already NULL,
          but this makes it crystal clear and is a defensive practice
          IMPORTANT: argv[argc] is valid to access (one past last arg)
  }

  puts(argv[0]);
  └── Print the name of exec_demo2 itself

  execvp(argv[1], &argv[1]);
  └── argv[1] = program to execute (e.g., "./exec1")
      &argv[1] = address of argv[1] = the sub-array starting at argv[1]
      This passes ALL arguments starting from argv[1] to the new program

  printf("%d", argc);   ← DEAD CODE if exec succeeds
  printf("Ending-----"); ← DEAD CODE if exec succeeds
  └── Both only run if execvp() fails`} />

        <H3>The &argv[1] Magic — Visualized</H3>
        <AsciiDiagram title="&argv[1] Pointer Arithmetic" content={`
  Command: $ ./exec_demo2 ./exec1
  
  argv layout:
  Index:  [0]          [1]       [2]
  Value:  "./exec_demo2" "./exec1"  NULL
  Addr:   0x1000       0x1010    0x1020
  
  &argv[1] = address of argv[1] = 0x1010
  
  So execvp(argv[1], &argv[1]) =
     execvp("./exec1", pointer to {"./exec1", NULL})
  
  exec1 receives:
  argv[0] = "./exec1"
  argv[1] = NULL
  argc = 1

  ─────────────────────────────────────────────

  Command: $ ./exec_demo2 ./exec2 hello world
  
  argv layout:
  Index:  [0]           [1]      [2]      [3]     [4]
  Value:  "./exec_demo2" "./exec2" "hello" "world" NULL
  
  &argv[1] → starts at "./exec2"
  
  execvp("./exec2", {"./exec2", "hello", "world", NULL})
  
  exec2 receives:
  argv[0] = "./exec2"
  argv[1] = "hello"
  argv[2] = "world"
  argv[3] = NULL
  argc = 3`} />

        <H3>The argv[argc] = NULL Line — Is It Necessary?</H3>
        <InfoBox>
          The C standard (ISO C99, §5.1.2.2.1) guarantees: "argv[argc] shall be a null pointer." So argv[argc] is ALWAYS NULL already. The line <Mono>argv[argc] = NULL;</Mono> is a <strong>defensive programming practice</strong> — it makes the intent explicit and protects against non-standard environments. It's not strictly necessary but is good practice.
        </InfoBox>

        <H3>Expected Output</H3>
        <AsciiDiagram title="Expected Outputs for Different Commands" content={`
  $ ./exec_demo2 ./exec1
  ./exec_demo2                          ← from puts(argv[0])
  [exec1 takes over from here]
  I am exec1.c
  The no. of arguments is 1.
  The arguments are:./exec1

  $ ./exec_demo2 ./exec2 apple banana
  ./exec_demo2
  [exec2 takes over]
  I am exec2.c called by execvp()
  The no. of arguments is 3.
  The arguments are:./exec2
  apple
  banana

  Note: "%d" and "Ending-----" are NEVER printed on success`} />

        <VivaQA questions={[
          { q: 'What does &argv[1] mean in execvp(argv[1], &argv[1])?', a: '&argv[1] is the address of the argv[1] element, which is a pointer to the second pointer in the argv array. It effectively creates a sub-array starting at argv[1], pointing to: {argv[1], argv[2], ..., NULL}. This skips argv[0] (exec_demo2\'s name) and starts from the target program name.' },
          { q: 'Why is argv[argc] = NULL set explicitly?', a: 'The C standard guarantees argv[argc] is already NULL, but explicitly setting it is defensive programming. It makes the code\'s intent clear and ensures correctness even in edge cases or non-standard environments.' },
          { q: 'What happens if you run exec_demo2 without any arguments?', a: 'If argc == 1 (only program name), the if(argc>1) block is skipped. Then puts(argv[0]) prints the program name. Then execvp(argv[1], &argv[1]) tries to exec NULL — which will fail with ENOENT (no such file). The printf lines would then run.' },
        ]} />

        <KeyBox>
          <strong>This IS the Shell:</strong> exec_demo2.c is essentially a primitive shell! It takes a program name + arguments from the command line and exec's them. The real bash does this with fork() + exec_demo2-style logic.
        </KeyBox>
      </CodeSection>

      {/* =================== fork.c =================== */}
      <CodeSection title="📄 fork.c — The Complete Shell Pattern" code={codes.fork} filename="fork.c">
        <H3>Purpose of the Program</H3>
        <P>
          fork.c is the crown jewel of this lab — it demonstrates the complete <strong className="text-white">fork + exec + wait</strong> pattern. This is exactly how every Unix shell works: create a child, make the child exec the command, parent waits for it to finish.
        </P>

        <H3>Header Files Explained</H3>
        <Table
          headers={['Header', 'What it provides', 'Why needed']}
          rows={[
            [<Mono key="1">#include &lt;stdio.h&gt;</Mono>, 'printf()', 'Error messages'],
            [<Mono key="2">#include &lt;stdlib.h&gt;</Mono>, 'exit(), malloc()', 'Program termination'],
            [<Mono key="3">#include &lt;unistd.h&gt;</Mono>, 'fork(), execvp()', 'The core functions'],
            [<Mono key="4">#include &lt;sys/wait.h&gt;</Mono>, 'wait()', 'Waiting for child'],
            [<Mono key="5">#include &lt;string.h&gt;</Mono>, 'String functions', 'String manipulation (not used directly here)'],
            [<Mono key="6">#define MAX 20</Mono>, 'Constant = 20', 'Not directly used in this code (may be for buffer sizes)'],
          ]}
        />

        <H3>Complete Line-by-Line Analysis</H3>
        <AsciiDiagram title="fork.c Line-by-Line" content={`
  int main(int argc, char* argv[])
  └── Takes command line args
      argv[0] = "./fork"
      argv[1] = program to run (e.g., "./exec1")
      argv[2...n] = arguments for that program
      argc = total count

  int pid, status;
  └── pid: stores return value of fork()
      status: stores exit information of child after wait()

  pid = fork();
  └── CREATE A CHILD PROCESS!
      Fork returns TWICE:
      - In parent: pid = child's PID (e.g., 5001)
      - In child:  pid = 0

  if (pid == 0)
  └── THIS IS THE CHILD PROCESS (pid==0 means child)
  {
      execvp(argv[1], &argv[1]);
      └── Child execs the target program
          argv[1] = program name (e.g., "./exec1")
          &argv[1] = array of args starting at argv[1]
          If success: child BECOMES the target program (gone!)
          If failure: continues to next line

      printf("execvp failed");
      └── ONLY prints if execvp() failed
          (if exec succeeded, this never runs)

      return 1;
      └── Exit child with error code 1
  }
  else
  └── THIS IS THE PARENT PROCESS (pid > 0)
      wait(&status);
      └── Parent BLOCKS here until child exits
          &status: address to store child's exit info
          Returns when child is done
          Prevents zombie processes

  return 0;
  └── Parent exits normally after child is done`} />

        <H3>Complete Execution Flow Visualization</H3>
        <AsciiDiagram title="fork.c Full Execution Timeline" content={`
  $ ./fork ./exec1
  
  Time ──────────────────────────────────────────────────────►
  
  T=0: fork.c starts, argc=2, argv=["./fork","./exec1",NULL]
  
  T=1: fork() called
  ┌─────────────────────────────────────────────────────┐
  │                    FORK HAPPENS                     │
  └─────────────────────────────────────────────────────┘
  
  PARENT (PID 100)               CHILD (PID 101)
  pid = 101 (child's PID)        pid = 0
  
  T=2: pid != 0 (parent)         T=2: pid == 0 (child)
       goes to else                    goes to if block
  
  T=3: wait(&status) called      T=3: execvp("./exec1",
       PARENT SLEEPS ─────────         &argv[1]) called
                     waiting    
                                 T=4: Child's memory REPLACED
                                      with exec1.c
  
                                 T=5: exec1 runs:
                                      "I am exec1.c"
                                      argc = 1
                                      argv[0] = "./exec1"
  
                                 T=6: exec1 exits (return 0)
                                 ↓ Child process TERMINATES
  
  T=7: wait() RETURNS ◄──────────── Child terminated!
       parent wakes up
       status = 0 (exit code)
  
  T=8: parent: return 0, exits
  
  Full output:
  I am exec1.c
  The no. of arguments is 1.
  The arguments are:./exec1`} />

        <H3>What if execvp Fails in the Child?</H3>
        <AsciiDiagram title="exec Failure in Child" content={`
  $ ./fork ./nonexistent_program
  
  PARENT                         CHILD
  wait(&status) → sleeping       execvp("./nonexistent", ...) → FAILS
                                 printf("execvp failed") → RUNS!
                                 return 1; → child exits with code 1
  wait() returns ←──────────────── child exits
  status contains: exit code 1
  
  Output: execvp failed
  
  Parent could check:
  if (WIFEXITED(status) && WEXITSTATUS(status) != 0) {
      printf("Child failed!\\n");
  }`} />

        <H3>Process Tree During Execution</H3>
        <AsciiDiagram title="Process Tree" content={`
  During execution of $ ./fork ./exec1:

  bash (PID 50)
  └── fork.c (PID 100) ← you ran this
      └── exec1 (PID 101) ← fork() created child, exec'd exec1

  After exec1 exits:
  bash (PID 50)
  └── fork.c (PID 100) ← still running (in wait())
  [PID 101 is gone]

  After fork.c's wait() returns:
  bash (PID 50)
  [both 100 and 101 are gone]`} />

        <SuccessBox>
          <strong>Why fork.c is the Shell in Miniature:</strong><br/>
          1. Shell (fork.c) receives command from user (via argv)<br/>
          2. Shell forks → creates child<br/>
          3. Child exec's the command<br/>
          4. Parent (shell) waits<br/>
          5. Command runs and exits<br/>
          6. Shell resumes — ready for next command (in a real shell, there'd be a loop)<br/>
          This is exactly what bash, sh, zsh do for every command you type!
        </SuccessBox>

        <VivaQA questions={[
          { q: 'In fork.c, what does the child process do?', a: 'The child process (where pid==0) calls execvp(argv[1], &argv[1]) to replace itself with the program specified in argv[1]. If execvp fails, it prints "execvp failed" and exits with code 1.' },
          { q: 'In fork.c, what does the parent process do?', a: 'The parent process (where pid>0, i.e., the else branch) calls wait(&status) which blocks until the child process exits. Once the child is done, wait() returns and the parent proceeds to return 0.' },
          { q: 'Why is wait() important in fork.c?', a: 'wait() serves two purposes: (1) It synchronizes the parent with the child — parent doesn\'t exit before child finishes. (2) It prevents zombie processes by collecting the child\'s exit status, allowing the OS to clean up the child\'s process table entry.' },
          { q: 'What happens if you remove the wait() from fork.c?', a: 'Without wait(), the parent might exit before the child finishes. Two things could happen: (1) The child becomes an orphan and is adopted by init. (2) Until the parent exits, if the child finishes first, it becomes a zombie temporarily. Also, output from parent and child might be interleaved.' },
          { q: 'Why does the child branch use return 1 after execvp failure?', a: 'If execvp fails, the child process needs to exit cleanly. return 1 (or exit(1)) exits the CHILD process with an error code. The parent\'s wait() will then return with this exit status. Without this return, the child would continue executing the parent\'s code path — which is wrong.' },
          { q: 'In what order does the output appear?', a: 'The output comes entirely from exec1.c (after the child exec\'s it) because: (1) fork.c\'s parent only calls wait() — no printf before it. (2) fork.c\'s child calls execvp before any printf. (3) exec1.c produces all visible output. The parent\'s return 0 is silent.' },
        ]} />
      </CodeSection>
    </div>
  );
}
