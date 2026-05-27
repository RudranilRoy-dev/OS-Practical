import {
  ChapterHeader, H2, P, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, KeyBox, VivaQA, NumberedList, WarningBox
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter6() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="6"
        title="wait() and Synchronization"
        subtitle="Once you create a child with fork(), you need to manage its lifecycle. wait() is how the parent stays in sync with its children and how the OS avoids zombie processes."
        icon="⏳"
        gradient="from-teal-900/60 to-cyan-900/40"
      />

      <H2>6.1 Why Do We Need wait()?</H2>
      <P>
        When a parent creates a child with fork(), the child runs independently. But what if the parent needs to:
      </P>
      <NumberedList items={[
        'Know when the child has finished?',
        'Get the child\'s exit status (did it succeed or fail)?',
        'Prevent zombie processes from accumulating?',
        'Ensure correct sequencing (parent shouldn\'t print "done" before child finishes)?',
      ]} />
      <P>
        That's exactly what <Mono>wait()</Mono> provides — a synchronization mechanism between parent and child.
      </P>

      <H2>6.2 wait() Signature and Behavior</H2>
      <CodeBlock
        code={`#include <sys/wait.h>
#include <sys/types.h>

pid_t wait(int *status);

// Parameters:
// status = pointer to an int where exit info will be stored
//          Pass NULL if you don't care about exit status
//          Pass &status to capture exit information

// Return value:
// On success → PID of the terminated child
// On failure → -1 (no children exist, or signal interrupted)

// Example usage:
int status;
pid_t child_pid = wait(&status);  // blocks until any child exits

// Check how child terminated:
if (WIFEXITED(status)) {
    int exit_code = WEXITSTATUS(status);  // get exit code
    printf("Child exited normally with code: %d\\n", exit_code);
}
if (WIFSIGNALED(status)) {
    printf("Child killed by signal: %d\\n", WTERMSIG(status));
}`}
        language="c"
        filename="wait_usage.c"
      />

      <H2>6.3 Blocking Behavior — The Parent Sleeps</H2>
      <P>
        When the parent calls <Mono>wait()</Mono>, it <strong className="text-white">blocks</strong> (goes to sleep) until one of its children exits. This is the key synchronization mechanism.
      </P>

      <AsciiDiagram title="wait() Blocking Timeline" content={`
  Time ─────────────────────────────────────────────────────►

  Parent:  fork()──►wait()──[BLOCKED, sleeping]──►continues
                                                  ↑
  Child:             starts──────────────────►exits
  
  The parent is paused at wait() while the child runs.
  When the child exits, the OS wakes up the parent.
  
  Timeline detail:
  T=0: Parent calls fork(), child is created
  T=1: Parent calls wait(), goes to sleep
  T=2: Child starts executing
  T=3: Child calls exec(), becomes the target program
  T=4: Target program runs...
  T=5: Target program exits (returns 0)
  T=6: Child process terminates, OS signals parent
  T=7: Parent wakes up from wait(), gets child's exit status
  T=8: Parent continues execution`} />

      <H2>6.4 Zombie Processes — The Undead Problem</H2>
      <P>
        A <strong className="text-white">zombie process</strong> is a process that has <strong className="text-white">finished executing</strong> but still has an entry in the process table because its parent hasn't called <Mono>wait()</Mono> yet.
      </P>

      <AsciiDiagram title="Zombie Process Creation" content={`
  Normal lifecycle (with wait):
  ┌──────────┐   fork()  ┌──────────┐
  │  Parent  │──────────►│  Child   │
  └──────────┘           └──────────┘
       │                      │ exits
       │ wait()               │
       │◄─────────────────────┘ (exit status collected)
       │ continues            (child entry removed from table)
  
  Zombie lifecycle (without wait):
  ┌──────────┐   fork()  ┌──────────┐
  │  Parent  │──────────►│  Child   │
  └──────────┘           └──────────┘
       │                      │ exits
       │ (parent never          │
       │  calls wait())    [ZOMBIE!] ← still in process table
       │                           ← entry can't be removed!
       │                           ← takes up kernel resources
  
  Zombie shown in 'ps' as:
  USER   PID  ... Z    STAT ... [myprogram] <defunct>`} />

      <WarningBox>
        <strong>Zombie Processes:</strong> A zombie consumes a slot in the kernel's process table. If many zombies accumulate, the OS can run out of process table entries and be unable to create new processes! Always call wait() in the parent.
      </WarningBox>

      <H2>6.5 Orphan Processes</H2>
      <P>
        An <strong className="text-white">orphan process</strong> is the opposite situation — the <strong className="text-white">parent exits first</strong>, leaving the child still running.
      </P>

      <AsciiDiagram title="Orphan Process" content={`
  ┌──────────┐   fork()  ┌──────────┐
  │  Parent  │──────────►│  Child   │ (still running)
  └──────────┘           └──────────┘
       │
       exits ← parent exits before child finishes!
  
  Now the child has no parent (PPID = 100, but PID 100 is gone)
  
  Linux SOLUTION: init/systemd (PID 1) adopts the orphan!
  
  ┌──────────────────────────┐  adoption  ┌──────────┐
  │ init/systemd (PID: 1)   │───────────►│  Child   │
  └──────────────────────────┘           └──────────┘
  
  When the child eventually exits, init calls wait() for it.
  This prevents zombie accumulation.`} />

      <TipBox>
        <strong>Key Distinction:</strong> Zombie = child exits before parent calls wait(). Orphan = parent exits before child finishes. Both are edge cases you need to understand for viva!
      </TipBox>

      <H2>6.6 waitpid() — More Precise Control</H2>
      <CodeBlock
        code={`#include <sys/wait.h>

pid_t waitpid(pid_t pid, int *status, int options);

// pid parameter:
// -1       = wait for ANY child (same as wait())
// 0        = wait for any child in same process group
// > 0      = wait for specific child with that PID
// < -1     = wait for any child in abs(pid) process group

// options parameter:
// 0        = block until child exits (default)
// WNOHANG  = don't block — return immediately if no child exited
// WUNTRACED = also return for stopped children

// Examples:
waitpid(child_pid, &status, 0);        // wait for specific child
waitpid(-1, &status, 0);              // same as wait(&status)
waitpid(-1, &status, WNOHANG);        // non-blocking check`}
        language="c"
        filename="waitpid_usage.c"
      />

      <H2>6.7 Status Macros — Reading the Exit Information</H2>
      <Table
        headers={['Macro', 'What it does']}
        rows={[
          [<Mono key="1">WIFEXITED(status)</Mono>, 'Returns true if child exited normally (called exit() or returned from main)'],
          [<Mono key="2">WEXITSTATUS(status)</Mono>, 'Gets the exit code (0-255). Only valid if WIFEXITED is true'],
          [<Mono key="3">WIFSIGNALED(status)</Mono>, 'Returns true if child was killed by a signal'],
          [<Mono key="4">WTERMSIG(status)</Mono>, 'Gets the signal number that killed the child. Only valid if WIFSIGNALED is true'],
          [<Mono key="5">WIFSTOPPED(status)</Mono>, 'Returns true if child was stopped (not terminated)'],
          [<Mono key="6">WSTOPSIG(status)</Mono>, 'Gets the signal that caused the stop. Only valid if WIFSTOPPED is true'],
        ]}
      />

      <ExamBox>
        <strong>🎯 Exam Pattern:</strong> The wait(&status) in fork.c stores the child's exit info in status. If execvp() succeeds, the exec'd program runs to completion, exits normally, and wait() returns. If execvp() fails, the child does return 1, which wait() captures. The parent doesn't need to do anything special with status in fork.c — just calling wait() is enough to prevent zombies.
      </ExamBox>

      <KeyBox>
        <strong>Rule of thumb:</strong> Every fork() should have a corresponding wait() in the parent. If you create N children with N fork() calls, you should call wait() N times (or use waitpid() appropriately). This ensures all children are properly collected.
      </KeyBox>

      <VivaQA questions={[
        { q: 'What is a zombie process?', a: 'A zombie process is one that has finished executing but whose entry still exists in the process table because the parent hasn\'t called wait() to collect its exit status. It shows as "Z" or "<defunct>" in ps output.' },
        { q: 'What is an orphan process?', a: 'An orphan process is a child process whose parent has terminated before it. Linux automatically re-parents orphans to init (PID 1), which eventually calls wait() for them.' },
        { q: 'What does wait() return?', a: 'wait() returns the PID of the terminated child on success, or -1 on failure (e.g., no children exist).' },
        { q: 'What happens if a parent calls wait() before the child exits?', a: 'The parent blocks (suspends execution) until the child exits. This is the normal case.' },
        { q: 'What happens if the parent never calls wait()?', a: 'The child becomes a zombie — it exists in the process table with status "Z" until the parent calls wait() or the parent itself exits (at which point init adopts and reaps it).' },
      ]} />
    </div>
  );
}
