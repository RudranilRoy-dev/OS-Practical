import {
  ChapterHeader, H2, H3, P, InfoBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, SectionDivider, KeyBox
} from '../components/UI';

export default function Chapter1() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="1"
        title="Fundamentals of Processes"
        subtitle="Before you write a single line of exec() or fork(), you need to understand what a process actually IS. This chapter builds your mental model from the ground up."
        icon="⚙️"
        gradient="from-green-900/60 to-emerald-900/40"
      />

      <InfoBox>
        <strong>Start Here:</strong> Every programmer has written a program. But most beginners confuse "program" with "process." Understanding the difference is the very first step to mastering OS concepts.
      </InfoBox>

      <H2>1.1 What is a Program?</H2>
      <P>
        A <strong className="text-white">program</strong> is a <strong className="text-white">passive, static</strong> entity. It is a file stored on your hard disk — a set of instructions written in code, compiled into binary, and saved as a file like <Mono>a.out</Mono>, <Mono>ls</Mono>, or <Mono>firefox</Mono>.
      </P>
      <P>
        Think of a program like a <strong className="text-cyan-300">recipe written on paper</strong>. The recipe exists on paper whether or not anyone is cooking. It just sits there, static, waiting.
      </P>

      <H2>1.2 What is a Process?</H2>
      <P>
        A <strong className="text-white">process</strong> is a <strong className="text-white">running instance</strong> of a program. When you execute a program, the operating system loads it into memory, gives it resources, and starts running it. That running entity is called a <strong className="text-cyan-300">process</strong>.
      </P>
      <P>
        Continuing the analogy: a process is like <strong className="text-cyan-300">actually cooking using the recipe</strong>. The cooking is happening right now, using real resources (stove, ingredients, a chef), and it has a state (what step we're on).
      </P>

      <Table
        headers={['Feature', 'Program', 'Process']}
        rows={[
          ['Nature', 'Static, passive', 'Dynamic, active'],
          ['Location', 'Stored on disk', 'Lives in RAM (memory)'],
          ['Lifetime', 'Until manually deleted', 'From start to termination'],
          ['Resources', 'None (just a file)', 'CPU, Memory, Files, I/O'],
          ['Identity', 'Just a filename', 'Has a unique PID (Process ID)'],
          ['Count', 'One copy on disk', 'Multiple instances possible simultaneously'],
          ['Analogy', 'Recipe on paper', 'Actually cooking the recipe'],
        ]}
      />

      <TipBox>
        <strong>Memory Trick:</strong> "Program = Passive. Process = active-ly running." Both start with 'P', but program is a static 'P', while process is a performing 'P'!
      </TipBox>

      <H2>1.3 Process States — The Life of a Process</H2>
      <P>A process doesn't just "run" the whole time. It moves through different <strong className="text-white">states</strong> during its lifetime. Think of it like a person's workday.</P>

      <AsciiDiagram title="Process State Diagram" content={`
  ┌─────────┐    fork()/exec()    ┌─────────┐
  │   NEW   │ ─────────────────► │  READY  │
  └─────────┘                    └────┬────┘
                                      │ Scheduler picks it
                                      ▼
                                 ┌─────────┐
             ┌─── I/O done ───── │ RUNNING │ ──── I/O wait ──► ┌─────────┐
             │                   └────┬────┘                    │ WAITING │
             │                        │                         └─────────┘
             ▼                        │ exit()
        ┌─────────┐                   ▼
        │  READY  │             ┌──────────┐
        └─────────┘             │TERMINATED│
                                └──────────┘

  States Explained:
  ┌──────────────┬────────────────────────────────────────────────┐
  │ NEW          │ Process is being created (fork/exec called)     │
  │ READY        │ In memory, waiting for CPU time                 │
  │ RUNNING      │ CPU is executing its instructions RIGHT NOW     │
  │ WAITING      │ Waiting for I/O (disk read, keyboard input...)  │
  │ TERMINATED   │ Execution complete, being cleaned up            │
  └──────────────┴────────────────────────────────────────────────┘`} />

      <H2>1.4 The Process Image — Memory Layout</H2>
      <P>
        When a process is loaded into memory, it is organized into specific <strong className="text-white">segments</strong>. This organized memory layout is called the <strong className="text-cyan-300">Process Image</strong>. Think of it as the blueprint of how a process looks inside RAM.
      </P>

      <AsciiDiagram title="Process Memory Layout (Process Image)" content={`
  High Address ┌───────────────────────────────────┐
               │          STACK SEGMENT            │ ← Local variables, function calls
               │         (grows downward ↓)        │   Return addresses, parameters
               ├───────────────────────────────────┤
               │                                   │
               │          (unused space)           │ ← Gap between stack and heap
               │                                   │
               ├───────────────────────────────────┤
               │           HEAP SEGMENT            │ ← Dynamic memory (malloc, calloc)
               │          (grows upward ↑)         │
               ├───────────────────────────────────┤
               │           BSS SEGMENT             │ ← Uninitialized global/static vars
               ├───────────────────────────────────┤
               │           DATA SEGMENT            │ ← Initialized global/static vars
               ├───────────────────────────────────┤
               │           TEXT SEGMENT            │ ← Your compiled program code
               │         (read-only code)          │   (machine instructions)
  Low Address  └───────────────────────────────────┘`} />

      <Table
        headers={['Segment', 'What It Contains', 'Example']}
        rows={[
          ['Text', 'Compiled machine code instructions', 'Your main(), for loops, if statements compiled to binary'],
          ['Data', 'Initialized global/static variables', 'int count = 10; (declared outside main)'],
          ['BSS', 'Uninitialized global/static variables', 'int count; (no initial value outside main)'],
          ['Heap', 'Dynamically allocated memory', 'ptr = malloc(100); — grows upward'],
          ['Stack', 'Local variables, function call frames', 'int x = 5; inside a function — grows downward'],
        ]}
      />

      <ExamBox>
        <strong>🎯 Exam Alert:</strong> You WILL be asked "What is a Process Image?" — Answer: "The process image is the memory layout of a running process, consisting of Text, Data, BSS, Heap, and Stack segments." Also mention that when <Mono>execvp()</Mono> is called, the ENTIRE process image gets replaced.
      </ExamBox>

      <H2>1.5 Process Identification — PID, PPID, UID</H2>
      <P>Every process in a Unix/Linux system is uniquely identified and tracked using several identifiers:</P>

      <Table
        headers={['Identifier', 'Full Name', 'Description', 'How to get it in C']}
        rows={[
          ['PID', 'Process ID', 'Unique number identifying THIS process', <Mono key="g">getpid()</Mono>],
          ['PPID', 'Parent Process ID', 'PID of the process that created THIS process', <Mono key="pp">getppid()</Mono>],
          ['UID', 'User ID', 'ID of the user who owns/started this process', <Mono key="u">getuid()</Mono>],
          ['GID', 'Group ID', 'ID of the group the process belongs to', <Mono key="gg">getgid()</Mono>],
          ['EUID', 'Effective User ID', 'Used for permission checks (important for setuid)', <Mono key="e">geteuid()</Mono>],
        ]}
      />

      <H3>Real Linux Terminal Examples:</H3>
      <AsciiDiagram title="Checking Process Info in Terminal" content={`
  $ ps aux           # Show ALL processes with details
  $ ps -ef           # Alternative format showing PPID too
  $ pstree           # Show process TREE (parent-child relationships)
  $ echo $$          # Show PID of current shell
  $ ps aux | grep firefox   # Find firefox process

  Example output of 'ps -ef':
  UID    PID  PPID  ... CMD
  root     1     0  ... /sbin/init          ← PID 1 is always init/systemd
  user  1234     1  ... bash                ← Shell started by init
  user  1235  1234  ... ./myprogram         ← Your program started by bash`} />

      <TipBox>
        <strong>Key Insight:</strong> The process with PID 1 is ALWAYS <Mono>init</Mono> or <Mono>systemd</Mono> — it's the first process started by the kernel and the ancestor of ALL other processes. This is the root of the entire process tree!
      </TipBox>

      <SectionDivider title="Process Tree" subtitle="How processes relate to each other" />

      <H2>1.6 The Process Tree</H2>
      <P>Every process (except init) was created by another process. This creates a tree structure:</P>

      <AsciiDiagram title="Linux Process Tree Example" content={`
  systemd (PID 1)
  │
  ├── bash (PID 100)        ← Your terminal shell
  │   │
  │   ├── ./myprogram (PID 200)    ← You ran this
  │   │   │
  │   │   └── ls (PID 201)         ← myprogram called exec/fork to run ls
  │   │
  │   └── gcc main.c (PID 202)     ← Another command you ran
  │
  ├── firefox (PID 300)
  │   ├── firefox-renderer (PID 301)
  │   └── firefox-gpu (PID 302)
  │
  └── sshd (PID 400)               ← SSH daemon`} />

      <H2>1.7 How Does the OS Track Processes?</H2>
      <P>
        The Linux kernel maintains a data structure called the <strong className="text-white">Process Control Block (PCB)</strong> — also called <Mono>task_struct</Mono> in Linux — for every running process. This is like the process's "ID card" inside the kernel.
      </P>

      <Table
        headers={['PCB Field', 'What it Stores']}
        rows={[
          ['PID', 'Process ID number'],
          ['Process State', 'Running / Ready / Waiting / etc.'],
          ['Program Counter', 'Address of next instruction to execute'],
          ['CPU Registers', 'Saved register values when process is paused'],
          ['Memory Management Info', 'Pointers to page tables, memory segments'],
          ['Open File Table', 'List of open file descriptors (stdin, stdout, etc.)'],
          ['Scheduling Info', 'Priority, CPU time used'],
          ['Signal Information', 'Pending signals, signal handlers'],
        ]}
      />

      <KeyBox>
        <strong>Why This Matters for exec() and fork():</strong> When you call <Mono>fork()</Mono>, the OS creates a NEW PCB by copying the parent's PCB. When you call <Mono>exec()</Mono>, the PCB stays the same (same PID!) but the memory image (code, data, stack) gets replaced with the new program's image. This is the fundamental mechanism behind the shell!
      </KeyBox>
    </div>
  );
}
