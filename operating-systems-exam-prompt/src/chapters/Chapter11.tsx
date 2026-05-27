import {
  ChapterHeader, H2, P, InfoBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, KeyBox, NumberedList
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter11() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="11"
        title="Real Linux Internal Working"
        subtitle="Go beyond textbooks. This chapter explores what actually happens inside the Linux kernel when you call fork() and exec(). For top grades and deep understanding."
        icon="🐧"
        gradient="from-cyan-900/60 to-blue-900/40"
      />

      <InfoBox>
        This chapter is for students who want to go above and beyond. Understanding Linux internals will help you answer 'why' questions in viva and impress examiners with deep knowledge.
      </InfoBox>

      <H2>11.1 The Linux Kernel and System Calls</H2>
      <P>
        Every time your C program calls <Mono>fork()</Mono>, <Mono>execvp()</Mono>, or <Mono>wait()</Mono>, these aren't just library functions — they're <strong className="text-white">system calls</strong> that involve switching from user mode to kernel mode.
      </P>

      <AsciiDiagram title="User Space vs Kernel Space" content={`
  ┌─────────────────────────────────────────────────────┐
  │                  USER SPACE                         │
  │  Your C program (exec_demo1.c, fork.c, etc.)        │
  │  C Library (glibc): fork(), execvp() wrappers       │
  └──────────────┬──────────────────────────────────────┘
                 │ System Call Interface (int 0x80 or syscall)
  ┌──────────────▼──────────────────────────────────────┐
  │                 KERNEL SPACE                        │
  │  sys_fork() → do_fork() → copy_process()            │
  │  sys_execve() → do_execve() → load_elf_binary()     │
  │  sys_wait4() → do_wait() → collect exit status      │
  │                                                     │
  │  Process Table (task_struct array)                  │
  │  Memory Manager (page tables, MMU)                  │
  │  File System (VFS, ext4, etc.)                      │
  └─────────────────────────────────────────────────────┘`} />

      <H2>11.2 Inside do_fork() — The fork() Implementation</H2>

      <NumberedList items={[
        <><strong className="text-white">copy_process():</strong> The core of fork(). Creates a new task_struct (PCB) and copies most fields from the parent. This includes copying open file descriptors, signal handlers, and memory management structures.</>,
        <><strong className="text-white">dup_mm():</strong> Duplicates the memory management structure. With COW, this doesn't copy physical pages — it marks parent pages as read-only and creates new page table entries pointing to the same physical frames.</>,
        <><strong className="text-white">copy_files():</strong> Copies the file descriptor table. Both parent and child now point to the same kernel file table entries (open file descriptions), so they share file positions.</>,
        <><strong className="text-white">Assign PID:</strong> A new PID is allocated from the PID namespace and assigned to the child's task_struct.</>,
        <><strong className="text-white">Set return values:</strong> The kernel sets the return value (in the eax register on x86) to 0 in the child's saved register state, and to child_pid in the parent's eax.</>,
        <><strong className="text-white">Wake up child:</strong> The child is placed in the run queue as TASK_RUNNING, making it eligible for CPU scheduling.</>,
      ]} />

      <H2>11.3 Inside do_execve() — The exec() Implementation</H2>

      <AsciiDiagram title="exec() Kernel Flow" content={`
  sys_execve() system call
  │
  ▼
  do_execve()
  │
  ├── open_exec() → open the executable file
  │                 (returns a file descriptor)
  │
  ├── bprm_mm_init() → allocate new mm_struct
  │                    (new memory address space)
  │
  ├── copy_strings() → copy argv and envp onto new stack
  │
  ├── search_binary_handler() → find the right loader
  │   ├── Is it ELF? → load_elf_binary()
  │   ├── Is it script (#!)? → load_script()
  │   └── Other formats...
  │
  ├── load_elf_binary() (for compiled C programs):
  │   ├── Read ELF header → validate format
  │   ├── Parse program headers → find LOAD segments
  │   ├── Map text segment → read-only executable pages
  │   ├── Map data segment → read-write pages
  │   ├── Map BSS → anonymous zero pages
  │   ├── Setup heap (brk) → starts above BSS
  │   ├── Load dynamic linker (ld.so) if needed
  │   └── Set entry point → _start (not main directly!)
  │
  ├── flush_old_exec() → DESTROY old address space
  │   (This is the point of no return!)
  │
  └── start_thread() → set PC to entry point
                        return to user mode → NEW PROGRAM RUNS!`} />

      <H2>11.4 ELF Binary Format — What Your Compiled Program Looks Like</H2>

      <AsciiDiagram title="ELF File Structure" content={`
  ELF File (your compiled exec1 binary):
  ┌─────────────────────────────────┐
  │ ELF Header                      │ ← Magic bytes, architecture info
  │ (e_type, e_machine, e_entry...) │   e_entry = address of _start
  ├─────────────────────────────────┤
  │ Program Headers (Segments)      │ ← Tell loader WHERE to put what
  │ LOAD: .text segment             │   rx (read+execute) permissions
  │ LOAD: .data+.bss segment        │   rw (read+write) permissions
  │ DYNAMIC: shared libs needed     │
  ├─────────────────────────────────┤
  │ Section Headers (for linking)   │
  │ .text  ← your compiled code    │
  │ .data  ← initialized globals   │
  │ .bss   ← uninitialized globals │
  │ .rodata ← string literals      │
  │ .symtab ← symbol table         │
  └─────────────────────────────────┘

  $ readelf -h ./exec1      # Read ELF header
  $ readelf -S ./exec1      # Read section headers
  $ objdump -d ./exec1      # Disassemble code`} />

      <H2>11.5 The Shell — How bash Implements Your Commands</H2>
      <CodeBlock
        code={`// Simplified bash source code (pseudo-code):
while (1) {
    // 1. Print prompt
    printf("$ ");
    fflush(stdout);

    // 2. Read user input
    char *line = readline();           // "ls -l /home"

    // 3. Parse into tokens
    char **args = parse(line);         // {"ls", "-l", "/home", NULL}

    // 4. Check if it's a builtin (cd, echo, exit...)
    if (is_builtin(args[0])) {
        execute_builtin(args);
        continue;
    }

    // 5. fork() to create a child
    pid_t pid = fork();

    if (pid == 0) {
        // Child: handle redirections, pipes, etc.
        setup_io_redirections();

        // exec the command
        execvp(args[0], args);

        // If we get here, exec failed
        perror(args[0]);
        exit(127);  // 127 = command not found
    }
    else if (pid > 0) {
        // Parent (shell): wait for child
        int status;
        waitpid(pid, &status, 0);
        // Loop back to print prompt
    }
    else {
        perror("fork");
    }
}`}
        language="c"
        filename="simplified_shell.c"
      />

      <H2>11.6 Process Scheduling</H2>
      <P>
        After fork(), both parent and child are in the ready state. The Linux kernel's <strong className="text-white">Completely Fair Scheduler (CFS)</strong> decides who runs when.
      </P>

      <AsciiDiagram title="CFS Scheduling" content={`
  Process Queue (simplified):
  ┌──────────┬──────────┬──────────┬──────────┐
  │ Parent   │ Child    │ firefox  │ systemd  │
  │ PID:100  │ PID:101  │ PID:300  │ PID:1    │
  │ vruntime │ vruntime │ vruntime │ vruntime │
  │ = 10ms   │ = 0ms    │ = 50ms   │ = 100ms  │
  └──────────┴──────────┴──────────┴──────────┘
       ↑
  CFS picks the process with LOWEST vruntime
  (Child gets to run first after fork — lowest vruntime)

  CPU timeslice:
  Child runs → vruntime increases → Parent gets a turn → ...
  
  This is why child often runs before parent after fork()!
  But it's NOT guaranteed — depends on system load.`} />

      <H2>11.7 The /proc Filesystem — Live Process Information</H2>

      <AsciiDiagram title="Exploring /proc" content={`
  $ ls /proc/1234/          # (1234 = your process's PID)
  cmdline  cwd  exe  fd  maps  mem  status  ...
  
  $ cat /proc/1234/cmdline  # Command that started this process
  $ cat /proc/1234/status   # Process status (Name, PID, PPID, State...)
  $ ls -la /proc/1234/exe   # Symlink to the executable
  $ ls /proc/1234/fd         # Open file descriptors
  
  $ cat /proc/1234/maps     # Memory map (text, data, heap, stack, libs)
  
  Example /proc/PID/status:
  Name:    exec1
  State:   R (running)
  Pid:     1234
  PPid:    1200          ← parent PID
  Uid:     1000 1000     ← real and effective UID
  VmRSS:   1200 kB      ← physical memory used
  VmSize:  4096 kB      ← virtual memory size`} />

      <ExamBox>
        <strong>🎯 Advanced Exam Bonus:</strong> If asked "how do you inspect a running process?", mention /proc/PID/. This shows deep Linux knowledge. Also mention: <Mono>strace ./program</Mono> traces system calls, <Mono>ltrace ./program</Mono> traces library calls, <Mono>gdb</Mono> for debugging.
      </ExamBox>

      <Table
        headers={['Command', 'What it Shows']}
        rows={[
          [<Mono key="1">ps aux</Mono>, 'All running processes with CPU/memory usage'],
          [<Mono key="2">pstree</Mono>, 'Visual process tree showing parent-child relationships'],
          [<Mono key="3">top / htop</Mono>, 'Real-time process monitor'],
          [<Mono key="4">strace ./program</Mono>, 'Shows every system call the program makes'],
          [<Mono key="5">cat /proc/PID/status</Mono>, 'Detailed info about a specific process'],
          [<Mono key="6">cat /proc/PID/maps</Mono>, 'Memory map of the process'],
          [<Mono key="7">ls /proc/PID/fd</Mono>, 'Open file descriptors'],
          [<Mono key="8">kill -9 PID</Mono>, 'Send SIGKILL to terminate a process'],
        ]}
      />

      <KeyBox>
        <strong>Real-World Application:</strong> Understanding these internals helps you debug production issues. When a process hangs, you can use <Mono>strace -p PID</Mono> to see what system call it's stuck on. When memory leaks occur, <Mono>/proc/PID/maps</Mono> shows memory usage. These are skills that real OS engineers use daily.
      </KeyBox>
    </div>
  );
}
