import {
  ChapterHeader, H2, H3, P, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Mono, KeyBox
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter10() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="10"
        title="Common Errors and Debugging"
        subtitle="Every beginner makes the same mistakes. This chapter catalogs them all with clear explanations of what went wrong and how to fix it."
        icon="🐛"
        gradient="from-red-900/60 to-orange-900/40"
      />

      <WarningBox>
        <strong>Study these carefully:</strong> These are real mistakes that cause programs to crash, produce wrong output, or exhibit undefined behavior. Examiners specifically test for these.
      </WarningBox>

      <H2>Error 1 — Missing NULL Terminator in argv Array</H2>
      <AsciiDiagram title="The Most Common Mistake" content={`
  ❌ WRONG:
  char *args[] = {"./exec1", "hello"};  // No NULL!
  execvp(args[0], args);
  
  What happens:
  execvp() scans args[], reads "./exec1", reads "hello",
  then reads GARBAGE (whatever is next in memory)...
  → Undefined behavior, likely segfault or exec with wrong args
  
  ✅ CORRECT:
  char *args[] = {"./exec1", "hello", NULL};  // NULL at end!
  execvp(args[0], args);`} />

      <H2>Error 2 — Not Checking exec() Return Value</H2>
      <CodeBlock
        code={`// ❌ WRONG — no error handling:
execvp("./exec1", args);
// If exec fails, code continues — very confusing!

// ✅ CORRECT — proper error handling:
execvp("./exec1", args);
// If we get here, exec FAILED:
perror("execvp failed");
return 1;  // or exit(1)`}
        language="c"
        filename="error2_fix.c"
      />

      <H2>Error 3 — Not Checking fork() Return Value</H2>
      <CodeBlock
        code={`// ❌ WRONG — not handling fork failure:
pid = fork();
if (pid == 0) { /* child */ }
else { wait(&status); }  // What if pid == -1?

// ✅ CORRECT:
pid = fork();
if (pid < 0) {
    perror("fork failed");
    exit(1);  // Can't continue without a child
}
else if (pid == 0) {
    // Child code
}
else {
    wait(&status);  // Parent waits
}`}
        language="c"
        filename="error3_fix.c"
      />

      <H2>Error 4 — Wrong Path for execvp()</H2>
      <AsciiDiagram title="Path Errors" content={`
  ❌ WRONG — missing ./prefix:
  char *args[] = {"exec1", NULL};
  execvp("exec1", args);
  → FAILS! "exec1" not in PATH
  
  ❌ WRONG — wrong relative path:
  char *args[] = {"../exec1", NULL};
  execvp(args[0], args);
  → Fails unless exec1 is actually in the parent directory
  
  ✅ CORRECT — using ./ for current directory:
  char *args[] = {"./exec1", NULL};
  execvp("./exec1", args);  // or execvp(args[0], args)
  
  ✅ CORRECT — using absolute path:
  char *args[] = {"/home/user/lab/exec1", NULL};
  execvp(args[0], args);
  
  ✅ CORRECT — using PATH (for system commands):
  char *args[] = {"ls", "-l", NULL};
  execvp("ls", args);  // searches PATH for ls → finds /bin/ls`} />

      <H2>Error 5 — Code After exec() Confusion</H2>
      <CodeBlock
        code={`// ❌ WRONG UNDERSTANDING:
execvp("./exec1", args);
printf("This always prints!");  // Students think this always runs

// ✅ CORRECT UNDERSTANDING:
execvp("./exec1", args);
// ONLY reaches here if exec FAILED!
printf("execvp failed! This ONLY prints on failure.");
perror("Reason");
return 1;`}
        language="c"
        filename="error5_understanding.c"
      />

      <H2>Error 6 — Wrong argc Check</H2>
      <CodeBlock
        code={`// ❌ WRONG — accessing argv[1] without checking:
int main(int argc, char *argv[]) {
    execvp(argv[1], &argv[1]);  // What if argc == 1? argv[1] = NULL!
    // execvp(NULL, ...) → crashes!
}

// ✅ CORRECT — always validate argc first:
int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <program> [args]\\n", argv[0]);
        return 1;
    }
    execvp(argv[1], &argv[1]);
    perror("execvp failed");
    return 1;
}`}
        language="c"
        filename="error6_fix.c"
      />

      <H2>Error 7 — Child Process Executing Parent Code</H2>
      <CodeBlock
        code={`// ❌ WRONG — missing return in child:
pid = fork();
if (pid == 0) {
    execvp(argv[1], &argv[1]);
    printf("exec failed\\n");
    // ← NO RETURN/EXIT! Child falls through to parent code!
}
// Both parent AND (failed) child execute this:
wait(&status);  // Child calling wait() = undefined/wrong!

// ✅ CORRECT — always exit/return in child:
pid = fork();
if (pid == 0) {
    execvp(argv[1], &argv[1]);
    printf("exec failed\\n");
    return 1;  // ← Child exits here. Does NOT fall through.
}
else {
    wait(&status);  // Only parent executes this
}`}
        language="c"
        filename="error7_fix.c"
      />

      <H2>Error 8 — Zombie Process (Missing wait())</H2>
      <AsciiDiagram title="Zombie Process Bug" content={`
  ❌ WRONG — parent exits without waiting:
  pid = fork();
  if (pid == 0) {
      // child does something long...
      sleep(5);
      return 0;
  }
  // Parent exits immediately!
  return 0;  // Child becomes ORPHAN → adopted by init
  
  Or worse:
  pid = fork();
  if (pid != 0) {
      // parent does other work and loops
      // child has finished but parent never calls wait()
      // → ZOMBIE CHILD accumulates in process table!
  }
  
  ✅ CORRECT:
  pid = fork();
  if (pid == 0) { ... }
  else {
      wait(&status);  // Parent waits for child → no zombie!
  }`} />

      <H2>Error 9 — Using String Literal as argv[0]</H2>
      <CodeBlock
        code={`// ❌ DANGEROUS — modifying string literals:
char *args[3];
args[0] = "myprogram";  // String literal — READ ONLY!
args[0][0] = 'M';       // CRASH! Modifying read-only memory

// ✅ SAFE — use char arrays for modifiable strings:
char name[] = "myprogram";  // Array on stack — modifiable
char *args[] = {name, NULL};

// ✅ Also safe — don't modify, just use literals:
char *args[] = {"./exec1", "hello", NULL};
execvp(args[0], args);  // Fine — we're not modifying`}
        language="c"
        filename="error9_fix.c"
      />

      <H2>Error 10 — Forgetting to Include Headers</H2>
      <AsciiDiagram title="Required Headers Cheatsheet" content={`
  Function        Required Header
  ─────────────────────────────────────
  fork()          #include <unistd.h>
  execvp()        #include <unistd.h>
  wait()          #include <sys/wait.h>  ← often forgotten!
  waitpid()       #include <sys/wait.h>
  exit()          #include <stdlib.h>
  perror()        #include <stdio.h>     (or errno.h for errno itself)
  printf()        #include <stdio.h>
  getpid()        #include <unistd.h>
  getppid()       #include <unistd.h>

  Common errors without proper headers:
  'fork' undeclared → add #include <unistd.h>
  'wait' undeclared → add #include <sys/wait.h>
  'WIFEXITED' undeclared → add #include <sys/wait.h>`} />

      <H2>Debugging Tips</H2>
      <CodeBlock
        code={`// Tip 1: Use strace to see system calls:
$ strace ./exec_demo1

// Tip 2: Use perror() to get OS error messages:
execvp("./exec1", args);
perror("execvp");  // Prints: "execvp: No such file or directory"

// Tip 3: Check errno manually:
#include <errno.h>
execvp("./exec1", args);
if (errno == ENOENT) printf("File not found!\\n");
if (errno == EACCES) printf("Permission denied!\\n");

// Tip 4: Check if file exists before exec:
$ ls -la ./exec1     # does it exist?
$ file ./exec1       # is it actually executable?
$ chmod +x ./exec1   # make it executable

// Tip 5: Compile with warnings:
$ gcc -Wall -Wextra -g fork.c -o fork`}
        language="bash"
        filename="debugging_tips.sh"
      />

      <KeyBox>
        <strong>The Debugging Mindset:</strong> When something goes wrong with exec(), ask yourself: (1) Does the file exist? (2) Is it executable (chmod +x)? (3) Is it compiled? (4) Am I in the right directory? (5) Does argv end with NULL? (6) Did I check the return value of execvp?
      </KeyBox>

      <TipBox>
        <strong>Golden Debugging Rule:</strong> If a program crashes or behaves unexpectedly: add <Mono>perror()</Mono> immediately after every exec() and fork() call. The system error messages will tell you EXACTLY what went wrong.
      </TipBox>
    </div>
  );
}
