import {
  ChapterHeader, H2, H3, P, ExamBox, Mono, VivaQA, KeyBox
} from '../components/UI';

export default function Chapter9() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="9"
        title="Viva Questions with Answers"
        subtitle="50+ carefully curated viva questions with detailed answers. From basic to advanced. Organized by difficulty and topic. Practice these until you can answer without thinking."
        icon="🎤"
        gradient="from-green-900/60 to-teal-900/40"
      />

      <ExamBox>
        <strong>How to Use This Chapter:</strong> Cover the answer column and try to answer each question yourself. For viva, you need to be able to answer quickly and confidently. Aim to answer every basic question in under 10 seconds.
      </ExamBox>

      <H2>Level 1 — Basic (You MUST get all of these)</H2>
      <VivaQA questions={[
        {
          q: 'What is a process?',
          a: 'A process is a running instance of a program. It is a dynamic entity that has a program counter, memory space (stack, heap, text, data), and system resources. Unlike a program (which is static code on disk), a process is alive and consuming resources.'
        },
        {
          q: 'What is the difference between a program and a process?',
          a: 'A program is a static file stored on disk containing code. A process is that program loaded into memory and actively executing. One program can have multiple processes (e.g., multiple firefox instances). A process has a PID, memory, state, and resources — a program has none of these.'
        },
        {
          q: 'What is argc?',
          a: 'argc (argument count) is an integer passed to main() that contains the total number of command-line arguments, INCLUDING the program name itself (argv[0]). Its minimum value is 1.'
        },
        {
          q: 'What is argv?',
          a: 'argv (argument vector) is an array of character pointers (char *argv[]). Each element points to a null-terminated string representing one command-line argument. argv[0] is always the program name. The array itself ends with a NULL pointer.'
        },
        {
          q: 'What is execvp()?',
          a: 'execvp() is a system call that replaces the current process\'s memory image with a new program. It takes a program name (searches PATH if no "/" present) and a NULL-terminated array of string arguments. If successful, it never returns — the process IS the new program.'
        },
        {
          q: 'What does fork() do?',
          a: 'fork() creates a new (child) process by duplicating the calling (parent) process. After fork(), two processes exist running the same code. The parent receives the child\'s PID as the return value; the child receives 0.'
        },
        {
          q: 'What are the return values of fork()?',
          a: '0 in the child process, the child\'s PID (positive integer) in the parent process, and -1 if fork() fails (no child is created).'
        },
        {
          q: 'What does wait() do?',
          a: 'wait() makes the parent process block (sleep) until one of its child processes terminates. It prevents zombie processes by collecting the child\'s exit status and allowing the OS to clean up the child\'s process table entry.'
        },
        {
          q: 'Why must argv[] end with NULL in execvp()?',
          a: 'execvp() doesn\'t receive the count of arguments — it scans the array until it finds a NULL pointer to know where arguments end. Without NULL, execvp() would read beyond the array into invalid memory — undefined behavior.'
        },
        {
          q: 'What is argv[0]?',
          a: 'argv[0] is always the name of the running program itself. It\'s the first element of the argv array. When a program is exec\'d, argv[0] is whatever was passed as the first element in the exec\'d program\'s argument array.'
        },
      ]} />

      <H2>Level 2 — Intermediate (These determine your grade)</H2>
      <VivaQA questions={[
        {
          q: 'Does exec() change the PID of a process?',
          a: 'No. exec() replaces the memory image (code, data, stack, heap) but the PID remains the same. The process\'s identity in the kernel\'s process table is preserved. exec() is like renovating a house — the address (PID) stays, everything inside changes.'
        },
        {
          q: 'What happens to code written after execvp() if exec succeeds?',
          a: 'It never executes. When exec() succeeds, the calling process\'s memory is completely replaced. The code after execvp() was part of the original process\'s memory — which no longer exists. Code after exec() is "dead code" — it only runs if exec() FAILS.'
        },
        {
          q: 'What is the difference between execvp() and execv()?',
          a: 'The "p" in execvp() means PATH search — it searches directories in the PATH environment variable to find the executable. execv() requires the full path to the executable. Both use array (vector) style arguments.'
        },
        {
          q: 'What is the purpose of the line argv[argc] = NULL in exec_demo2.c?',
          a: 'The C standard already guarantees argv[argc] is NULL, so this line is defensive programming — it explicitly ensures the null terminator is present. It\'s good practice when manipulating argv arrays to prevent accidentally passing non-terminated arrays to execvp().'
        },
        {
          q: 'Why does exec_demo2.c use &argv[1] instead of argv for execvp\'s second argument?',
          a: '&argv[1] passes a sub-array starting at argv[1], skipping argv[0] (which is exec_demo2\'s own name). The exec\'d program should receive its OWN name as argv[0], so we pass argv[1] (the target program name) as the first element of the new argv.'
        },
        {
          q: 'What is a zombie process and how is it created?',
          a: 'A zombie process is one that has finished executing but whose process table entry persists because the parent hasn\'t called wait(). The child\'s exit status is held in the process table until the parent reads it via wait(). Zombies appear as "Z" or "<defunct>" in ps.'
        },
        {
          q: 'What is an orphan process?',
          a: 'An orphan process is a child process whose parent has exited before it. Linux automatically re-parents orphans to init (PID 1), which periodically calls wait() to collect their exit status and prevent zombies.'
        },
        {
          q: 'What is the exec family? Name at least 4 functions.',
          a: <span>execl(), execv(), execlp(), execvp(), execle(), execvpe(), execve(). The suffixes tell you: 'l' = list arguments, 'v' = vector/array arguments, 'p' = PATH search, 'e' = custom environment. execve() is the actual system call; others are library wrappers.</span>
        },
        {
          q: 'Why is fork() + exec() better than exec() alone for a shell?',
          a: 'With exec() alone, the shell would destroy itself when exec\'ing a command. The shell uses fork() to create a child, the child exec\'s the command, and the parent (shell) calls wait(). When the command exits, the shell (parent) is still alive to receive the next command.'
        },
        {
          q: 'What does Copy-on-Write (COW) mean in context of fork()?',
          a: 'Instead of immediately copying all memory pages when fork() is called, Linux marks pages as shared between parent and child. Pages are only physically copied when one process tries to WRITE to them. This makes fork() fast for large processes and avoids copying memory that exec() would immediately discard.'
        },
      ]} />

      <H2>Level 3 — Advanced (For top grades and interviews)</H2>
      <VivaQA questions={[
        {
          q: 'What is the Process Control Block (PCB)?',
          a: 'The PCB (called task_struct in Linux) is the kernel data structure that represents a process. It stores: PID, PPID, process state, CPU registers, program counter, memory management info (page tables), open file descriptors, scheduling info, and signal handlers. When fork() is called, the kernel creates a new PCB by copying the parent\'s.'
        },
        {
          q: 'What happens inside the kernel when execvp() is called?',
          a: 'execvp() ultimately calls the execve() system call. The kernel: (1) validates the target executable (ELF format check), (2) destroys the process\'s current address space, (3) maps the new program\'s text, data segments into memory, (4) sets up a fresh stack with the new argc/argv, (5) resets the program counter to the new program\'s entry point, (6) returns to user mode in the new program\'s context.'
        },
        {
          q: 'What is the ELF format?',
          a: 'ELF (Executable and Linkable Format) is the standard binary format for executables on Linux. When you compile a C program with gcc, the output is an ELF file. exec() reads the ELF header to understand how to load the program into memory — where the text segment goes, what shared libraries to load, and where execution should begin.'
        },
        {
          q: 'What file descriptors survive exec()? Why is this important?',
          a: 'By default, file descriptors 0 (stdin), 1 (stdout), and 2 (stderr) — and all other open FDs — survive exec(). This is how shell I/O redirection works: the shell can open a file, duplicate it onto stdout (fd 1), then exec a program — the program writes to "stdout" but actually writes to the file.'
        },
        {
          q: 'What is a setuid executable and what happens during exec()?',
          a: 'A setuid executable has its setuid bit set (visible as "s" in ls -l). When exec()\'d, the process\'s Effective User ID (EUID) changes to the file owner\'s UID, even though the Real UID stays the same. This is how programs like passwd and sudo temporarily gain elevated privileges.'
        },
        {
          q: 'What is a fork bomb and why is it dangerous?',
          a: 'A fork bomb is malicious code that calls fork() recursively, creating exponentially many processes. The bash fork bomb looks like: :(){ :|:& };: It exhausts the process table and system memory, causing denial of service. Prevention: set ulimit -u to limit max processes per user.'
        },
        {
          q: 'How does the shell implement I/O redirection (e.g., ls > output.txt)?',
          a: 'The shell forks a child. The child (before exec\'ing ls): opens output.txt, uses dup2(fd, STDOUT_FILENO) to replace stdout (fd 1) with the file, closes the original fd. Then exec\'s ls. ls writes to "stdout" (fd 1), which is now the file. The parent waits normally.'
        },
        {
          q: 'What is SIGCHLD and how does it relate to wait()?',
          a: 'SIGCHLD is a signal sent to the parent process when a child exits, stops, or resumes. By default it\'s ignored. Servers use signal(SIGCHLD, handler) with a handler that calls waitpid(WNOHANG) to asynchronously reap children without blocking. This is the professional alternative to blocking wait().'
        },
      ]} />

      <H2>Trick Questions (Examiners Love These!)</H2>
      <VivaQA questions={[
        {
          q: 'How many times does fork() return?',
          a: '"Twice" — once in the parent and once in the child. But more precisely: it\'s one system call that creates two execution contexts, each receiving a different return value. In the parent it returns the child\'s PID; in the child it returns 0.'
        },
        {
          q: 'If fork() is called N times in sequence (not nested), how many processes are created?',
          a: 'N+1 total processes (original + N children). For example: fork();fork();fork() → 8 processes (2³). But be careful — each fork() doubles ALL existing processes, not just the original!'
        },
        {
          q: 'Can a child process call fork()? What happens?',
          a: 'Yes! A child can fork() to create grandchildren. This creates a process tree. Each process is independent and can call fork() up to system limits. This is how complex multi-process applications are built.'
        },
        {
          q: 'What if execvp() is the very first line in a program (before any printf)?',
          a: 'That\'s perfectly valid. execvp() replaces the process immediately. No output from the original program ever happens. The exec\'d program runs from its beginning. This is common in specialized launchers.'
        },
        {
          q: 'argv[argc] is NULL — how do we know this?',
          a: 'It\'s guaranteed by the C language standard (ISO C, §5.1.2.2.1): "argv[argc] shall be a null pointer." This is why the argv array always has one more slot than argc — the extra NULL at the end.'
        },
      ]} />

      <KeyBox>
        <strong>Viva Tip:</strong> When answering viva questions, always follow this structure: (1) Give the direct answer in ONE sentence. (2) Explain WHY/HOW in 2-3 sentences. (3) Give an example if applicable. Examiners reward structured, confident answers over long, rambling ones.
      </KeyBox>
    </div>
  );
}
