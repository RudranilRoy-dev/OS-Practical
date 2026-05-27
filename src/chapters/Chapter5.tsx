import {
  ChapterHeader, H2, P, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Table, SectionDivider, KeyBox, VivaQA, NumberedList
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter5() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="5"
        title="fork() Deep Dive"
        subtitle="fork() is arguably the most important system call in all of Unix. It creates a new process by duplicating the calling process. Understanding its return values is the key to everything."
        icon="🌿"
        gradient="from-pink-900/60 to-rose-900/40"
      />

      <H2>5.1 What is fork()?</H2>
      <P>
        <strong className="text-white">fork()</strong> is a system call that <strong className="text-cyan-300">creates a new process</strong> by duplicating the calling process. The calling process is called the <strong className="text-white">parent</strong>. The new process is called the <strong className="text-white">child</strong>.
      </P>
      <P>
        After fork(), you have TWO processes running the SAME code. It's like creating an identical twin — both are running the same program simultaneously.
      </P>

      <AsciiDiagram title="fork() Creates a Twin" content={`
  BEFORE fork():
  ┌────────────────────────┐
  │  Parent Process        │
  │  PID: 100              │
  │  Code: same_program.c  │
  │  Data: x=10            │
  └────────────────────────┘
  
  fork() is called...
  
  AFTER fork(): TWO processes!
  ┌────────────────────────┐     ┌────────────────────────┐
  │  Parent Process        │     │  Child Process          │
  │  PID: 100              │     │  PID: 101 (new!)        │
  │  PPID: (grandparent)   │     │  PPID: 100 (parent!)    │
  │  Code: same_program.c  │     │  Code: same_program.c   │
  │  Data: x=10 (copy)     │     │  Data: x=10 (copy)      │
  └────────────────────────┘     └────────────────────────┘
  
  Both processes continue from the line AFTER fork()!`} />

      <H2>5.2 The fork() Signature</H2>

      <CodeBlock
        code={`#include <unistd.h>
#include <sys/types.h>

pid_t fork(void);

// Return value (THIS IS THE CRITICAL PART!):
// In PARENT process → returns the PID of the child (e.g., 1234)
// In CHILD process  → returns 0
// On ERROR          → returns -1 (no child created)

// pid_t is just an integer type (defined as int on most systems)`}
        language="c"
        filename="fork_signature.c"
      />

      <H2>5.3 The Three Return Values — The Magic of fork()</H2>
      <P>
        The most mind-bending thing about fork() is that it appears to <strong className="text-white">return TWICE</strong> — once in the parent, once in the child. Same function call, two different return values, two different processes.
      </P>

      <Table
        headers={['Where', 'Return Value', 'Meaning', 'What you should do']}
        rows={[
          ['In Parent', 'Child\'s PID (e.g., 1234)', 'Fork succeeded, child was created', 'Call wait() to wait for child, or do parent work'],
          ['In Child', '0 (zero)', 'I am the child process', 'Do child work (usually exec())'],
          ['Anywhere', '-1 (negative)', 'Fork failed! No child created', 'Handle error (print message, exit)'],
        ]}
      />

      <AsciiDiagram title="fork() Return Value Flow" content={`
  pid = fork();
  
  ═══════════════════════════════════════
  ONE CALL, TWO RETURNS, TWO PROCESSES:
  ═══════════════════════════════════════
  
  Parent process:           Child process:
  pid = 1234 (child's PID)  pid = 0
  
  if (pid == 0)             if (pid == 0)  ← THIS IS TRUE for child!
  {                         {
      // child code              // child runs this
  }                         }
  else                      else
  {                         {
      wait(&status);             // child does NOT run this
  }                         }
  
  ──────────────────────────────────────────
  REMEMBER: 
  pid == 0  → "I am the CHILD"
  pid > 0   → "I am the PARENT, child is pid"
  pid < 0   → "fork() FAILED"
  ──────────────────────────────────────────`} />

      <TipBox>
        <strong>Memory Trick:</strong> "Zero means Child" — The child gets 0 because it has no children yet. The parent gets the child's PID because it needs to track and manage its child.
      </TipBox>

      <H2>5.4 fork() Code Pattern — The Standard Template</H2>

      <CodeBlock
        code={`#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main()
{
    pid_t pid;
    int status;

    pid = fork();

    if (pid < 0) {
        // CASE 1: fork() FAILED
        perror("fork failed");
        return 1;
    }
    else if (pid == 0) {
        // CASE 2: I am the CHILD
        printf("Child: my PID = %d\\n", getpid());
        printf("Child: my parent's PID = %d\\n", getppid());
        // Do child work here (usually exec())
        return 0;
    }
    else {
        // CASE 3: I am the PARENT
        printf("Parent: my PID = %d\\n", getpid());
        printf("Parent: my child's PID = %d\\n", pid);
        wait(&status);  // Wait for child to finish
        printf("Parent: child has finished\\n");
    }

    return 0;
}`}
        language="c"
        filename="fork_template.c"
      />

      <SectionDivider title="Internal OS Mechanics" subtitle="What happens inside the kernel" />

      <H2>5.5 What Happens Inside the OS During fork()</H2>

      <NumberedList items={[
        <><strong className="text-white">System Call:</strong> fork() switches to kernel mode via a system call interrupt.</>,
        <><strong className="text-white">New PCB Created:</strong> The kernel creates a new Process Control Block (task_struct in Linux) by copying the parent's PCB.</>,
        <><strong className="text-white">New PID Assigned:</strong> The kernel assigns a new, unique PID to the child.</>,
        <><strong className="text-white">Memory Duplication (COW):</strong> The child gets a copy of the parent's address space. MODERN Linux uses Copy-on-Write (COW) — memory pages are NOT immediately copied; they're shared and only copied when one process tries to write.</>,
        <><strong className="text-white">File Descriptor Copying:</strong> Open file descriptors are copied (NOT duplicated — both parent and child point to the same kernel file table entries).</>,
        <><strong className="text-white">Different Return Values Set:</strong> The kernel sets the return value to 0 in the child's registers and to child_PID in the parent's registers.</>,
        <><strong className="text-white">Both scheduled:</strong> Both processes are now in the READY state and the scheduler will run them independently.</>,
      ]} />

      <H2>5.6 Copy-on-Write (COW) — The Optimization</H2>
      <P>
        Naively, fork() would need to copy ALL of the parent's memory — which could be gigabytes! This would be extremely slow. Linux is smarter:
      </P>

      <AsciiDiagram title="Copy-on-Write Mechanism" content={`
  AFTER fork() — pages are SHARED (not copied):
  
  Parent address space:    Child address space:
  ┌─────────────────┐      ┌─────────────────┐
  │ Page A (read)   │─────►│ Physical Page 1 │◄───│ Page A (read)  │
  │ Page B (read)   │─────►│ Physical Page 2 │◄───│ Page B (read)  │
  │ Page C (read)   │─────►│ Physical Page 3 │◄───│ Page C (read)  │
  └─────────────────┘      └─────────────────┘    └─────────────────┘
  
  When CHILD writes to Page B:
  1. Page fault triggered!
  2. Kernel copies Physical Page 2 → Physical Page 4
  3. Child's Page B now points to Physical Page 4
  4. Parent's Page B still points to Physical Page 2
  
  Parent:    │ Page B → Physical Page 2 │ (unchanged)
  Child:     │ Page B → Physical Page 4 │ (new copy with child's change)
  
  Result: Memory only copied when ACTUALLY needed!`} />

      <KeyBox>
        <strong>Why COW Matters:</strong> Because of Copy-on-Write, fork() is extremely fast even for large processes. The child process immediately calls exec() in most cases (the shell pattern), which throws away the copied memory anyway. COW avoids copying memory that exec() would immediately discard.
      </KeyBox>

      <H2>5.7 Execution Order After fork()</H2>
      <P>
        After fork(), both parent and child are ready to run. The order in which they execute is <strong className="text-white">non-deterministic</strong> — it depends on the CPU scheduler.
      </P>

      <WarningBox>
        <strong>Critical Point:</strong> You CANNOT guarantee whether parent or child runs first after fork(). Different runs of the same program might produce different orderings. This is why wait() exists — to impose ordering when needed.
      </WarningBox>

      <AsciiDiagram title="Possible Execution Orderings" content={`
  Scenario A (Parent runs first):
  ─────────────────────────────
  Parent: fork() → runs → wait() → waits...
                                       Child: runs → exits
  Parent: continues after wait()

  Scenario B (Child runs first):
  ─────────────────────────────
  Parent: fork() → scheduler switches to child
                   Child: runs → exits
  Parent: continues from fork() → wait() → immediately returns

  BOTH scenarios are valid and possible!
  Your code must work correctly in either case.`} />

      <H2>5.8 The fork.c Pattern — Combining fork() and exec()</H2>
      <CodeBlock
        code={`// From fork.c — the shell pattern
pid = fork();
if (pid == 0)
{
    // Child: exec the target program
    execvp(argv[1], &argv[1]);
    printf("execvp failed");  // Only runs if exec FAILS
    return 1;
}
else
    wait(&status);  // Parent: wait for child`}
        language="c"
        filename="fork_exec_pattern.c"
      />

      <ExamBox>
        <strong>🎯 The Shell Pattern Explained:</strong><br/>
        1. Parent (shell) calls fork() → creates child<br/>
        2. Child calls exec() → becomes the user's command<br/>
        3. Parent calls wait() → waits for the command to finish<br/>
        4. Child (command) runs and exits<br/>
        5. wait() in parent returns → parent (shell) continues<br/>
        6. Shell prints prompt, ready for next command<br/>
        This is EXACTLY how every Unix shell works!
      </ExamBox>

      <VivaQA questions={[
        { q: 'How many times does fork() return?', a: 'fork() appears to return twice — once in the parent process (returning the child\'s PID) and once in the child process (returning 0). It\'s one system call that creates two execution contexts.' },
        { q: 'What is the return value of fork() in the child?', a: 'Zero (0). The child always receives 0 from fork(). This is how a process knows it is the child.' },
        { q: 'What is the return value of fork() in the parent?', a: 'The PID (Process ID) of the newly created child process. This allows the parent to track and manage its child.' },
        { q: 'What is Copy-on-Write in context of fork()?', a: 'Instead of immediately copying all parent memory pages when fork() is called, Linux uses Copy-on-Write (COW): pages are shared between parent and child initially, and only copied when one process attempts to write to them. This makes fork() fast.' },
        { q: 'Can you guarantee which runs first — parent or child — after fork()?', a: 'No. The execution order depends on the OS scheduler and is non-deterministic. You should never write code that assumes a specific execution order between parent and child unless you use synchronization (like wait()).' },
      ]} />
    </div>
  );
}
