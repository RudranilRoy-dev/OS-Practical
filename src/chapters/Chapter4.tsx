import {
  ChapterHeader, H2, P, InfoBox, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, SectionDivider, KeyBox, NumberedList
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter4() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="4"
        title="Process Replacement"
        subtitle="The complete picture of what happens when exec() transforms one process into another. This chapter makes the concept of process replacement crystal clear."
        icon="🔄"
        gradient="from-orange-900/60 to-red-900/40"
      />

      <InfoBox>
        Process replacement is the most mind-bending concept for beginners. You call exec(), and suddenly your program IS a different program — same house, completely different furniture. Let's demystify this once and for all.
      </InfoBox>

      <H2>4.1 The Analogy — Moving Into a House</H2>
      <P>
        Imagine a house at address <strong className="text-cyan-300">1234 Memory Lane</strong> (this is the PID). Currently, Family A (exec_demo1.c) lives there. Then something magical happens:
      </P>

      <AsciiDiagram title="The House Analogy for Process Replacement" content={`
  BEFORE exec():
  ┌──────────────────────────────────────┐
  │ Address: PID 1234                    │
  │ Residents: exec_demo1.c              │
  │ Furniture: exec_demo1's code & data  │
  │ Rooms: exec_demo1's stack/heap       │
  └──────────────────────────────────────┘

  exec_demo1.c calls execvp("./exec1", args);

  AFTER exec():
  ┌──────────────────────────────────────┐
  │ Address: STILL PID 1234              │ ← Same address!
  │ Residents: exec1.c                   │ ← Different residents!
  │ Furniture: exec1's code & data       │ ← Different furniture!
  │ Rooms: exec1's stack/heap            │ ← Different everything inside!
  └──────────────────────────────────────┘

  The ADDRESS (PID) never changed.
  Everything INSIDE completely changed.`} />

      <H2>4.2 Step-by-Step Replacement Process</H2>

      <AsciiDiagram title="Detailed Process Replacement Flow" content={`
  exec_demo1.c running (PID: 5678)
  
  Memory Before:
  ┌─────────────────────┐
  │ TEXT: exec_demo1    │  ← execvp(args[0], args) is currently here
  │ DATA: args[] array  │
  │ STACK: main() frame │
  └─────────────────────┘
  
  Step 1: execvp() triggers kernel execve() system call
  Step 2: Kernel validates ./exec1 (exists? executable? permissions?)
  Step 3: Kernel reads exec1's ELF header
  Step 4: OLD memory is DESTROYED ─────────────────┐
  Step 5: exec1's code mapped to TEXT segment       │
  Step 6: exec1's globals set up in DATA/BSS        │  ALL happens
  Step 7: Fresh stack created with new argc/argv    │  atomically
  Step 8: Program counter → exec1's _start/main()  │
  Step 9: Back to user mode — exec1.c is running!  │
           ──────────────────────────────────────────┘
  
  Memory After:
  ┌─────────────────────┐
  │ TEXT: exec1.c code  │  ← Now executing exec1's main()
  │ DATA: exec1's data  │
  │ STACK: exec1's main │
  └─────────────────────┘
  
  PID is STILL 5678!`} />

      <H2>4.3 Why Code After exec() Never Runs</H2>
      <P>
        This confuses nearly every beginner. Look at this code from exec_demo1.c:
      </P>

      <CodeBlock
        code={`// exec_demo1.c
int main()
{
    char *args[] = {"./exec1", NULL};
    execvp(args[0], args);

    // ↓ THIS LINE NEVER RUNS IF exec SUCCEEDS ↓
    printf("Ending-----");  // Dead code on success

    return 0;  // Also never reached
}`}
        language="c"
        filename="exec_demo1.c"
      />

      <P>Why does <Mono>printf("Ending-----")</Mono> never execute?</P>

      <NumberedList items={[
        'execvp() is called — this triggers the kernel',
        'The kernel destroys exec_demo1\'s entire memory (including the stack where main() is executing)',
        'The kernel loads exec1.c\'s code into memory',
        'The program counter jumps to exec1.c\'s entry point',
        <>There is <strong className="text-white">no way back</strong> to exec_demo1.c — it no longer exists in memory</>,
        <>The <Mono>printf("Ending-----")</Mono> line was in exec_demo1.c\'s memory, which is GONE</>,
      ]} />

      <TipBox>
        <strong>Think of it this way:</strong> exec() is like completely renovating a house — you gut everything. Once the renovation starts, the old paint, walls, and furniture don't "resume" after renovation. They're gone. The new paint (exec1.c code) is what exists now.
      </TipBox>

      <ExamBox>
        <strong>🎯 Exam Trap Question:</strong> "What does printf("Ending-----") print in exec_demo1.c after execvp()?" — Answer: It prints NOTHING if execvp() succeeds. It only prints if execvp() FAILS. This is a classic trick question!
      </ExamBox>

      <SectionDivider title="What Survives vs What Dies" />

      <H2>4.4 Detailed Inheritance Table</H2>
      <P>After exec(), some things survive and some things are destroyed. Here's the complete picture:</P>

      <Table
        headers={['Category', 'Survives exec()?', 'Reason']}
        rows={[
          ['PID (Process ID)', '✅ YES', 'Process identity is in kernel\'s table, not memory'],
          ['PPID (Parent PID)', '✅ YES', 'Tracked in kernel PCB, not in process memory'],
          ['Open file descriptors', '✅ YES (usually)', 'File table is in kernel; FDs survive unless FD_CLOEXEC set'],
          ['stdin, stdout, stderr', '✅ YES', 'File descriptors 0, 1, 2 are inherited'],
          ['Current directory', '✅ YES', 'Stored in kernel, not process memory'],
          ['Environment variables', '✅ YES', 'Placed on the new stack by the kernel'],
          ['User ID (UID), GID', '✅ YES', 'Security credentials stored in kernel PCB'],
          ['Signal dispositions', '⚠️ RESET', 'Custom handlers are reset to SIG_DFL'],
          ['Code (TEXT segment)', '❌ REPLACED', 'Old program code gone, new code loaded'],
          ['Data (DATA segment)', '❌ REPLACED', 'Old globals gone, new program globals loaded'],
          ['Heap memory', '❌ DESTROYED', 'All malloc\'d memory is gone'],
          ['Stack', '❌ NEW', 'Completely fresh stack created with new argc/argv'],
          ['Thread-local storage', '❌ DESTROYED', 'Only one thread survives exec'], 
        ]}
      />

      <H2>4.5 The exec() Security Consideration — setuid</H2>
      <P>
        One important thing that CAN change after exec is the <strong className="text-white">Effective User ID (EUID)</strong>. When you exec a program that has the <strong className="text-cyan-300">setuid bit</strong> set (like <Mono>sudo</Mono> or <Mono>passwd</Mono>), the process temporarily gains that program's owner's privileges.
      </P>

      <CodeBlock
        code={`// Example: When bash execs 'sudo':
// Before exec:  EUID = 1000 (regular user)
// After exec:   EUID = 0 (root) — because sudo has setuid bit!

// This is why you can change your own password:
// passwd program has setuid bit → runs as root → can modify /etc/shadow

$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root ... /usr/bin/passwd
//  ^
//  's' in place of 'x' means setuid bit is set!`}
        language="bash"
        filename="setuid_example.sh"
      />

      <WarningBox>
        <strong>Security Issue:</strong> If your program calls exec() with a path that can be manipulated by a user (like reading from user input or an environment variable), an attacker can make your program run a different, malicious executable. Always use absolute paths or carefully validate paths before calling exec()!
      </WarningBox>

      <H2>4.6 exec() Without fork() vs With fork()</H2>
      <P>
        Here's the crucial design choice you'll encounter in every OS course:
      </P>

      <AsciiDiagram title="exec() Alone vs fork() + exec()" content={`
  EXEC WITHOUT FORK (exec_demo1.c):
  ──────────────────────────────────
  Parent (exec_demo1) ──────execvp()──────► Now exec1 (same PID)
  
  exec_demo1 IS GONE.
  exec1 runs. exec1 exits. Done.
  The parent shell waits.
  
  ┌─────────────────────────────────────────────────────┐
  │ Use when: you want to BECOME another program        │
  │ Use case: shell executing a user's command directly │
  └─────────────────────────────────────────────────────┘
  
  FORK + EXEC (fork.c — the shell model):
  ────────────────────────────────────────
  Parent (fork.c/shell) ──fork()──► Child (PID: new)
       │                                     │
       │ wait() — parent waits       execvp() — becomes target program
       │                                     │
       └───── Child finishes ──────── exec'd program exits
  
  The PARENT SURVIVES to run the next command.
  
  ┌─────────────────────────────────────────────────────┐
  │ Use when: you want to RUN another program but KEEP  │
  │           your own process alive afterward          │
  │ Use case: THIS is how bash/sh works!               │
  └─────────────────────────────────────────────────────┘`} />

      <KeyBox>
        <strong>The Shell Pattern:</strong> Every time you type a command in bash, bash does: (1) fork() → creates a child, (2) child does exec() → becomes your command, (3) parent (bash) does wait() → waits for command to finish, (4) child exits, (5) bash prints prompt again, ready for next command. This is the fundamental pattern of all Unix shells.
      </KeyBox>
    </div>
  );
}
