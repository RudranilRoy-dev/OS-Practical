import {
  ChapterHeader, H2, H3, P, InfoBox, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, SectionDivider, VivaQA, NumberedList
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter3() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="3"
        title="execvp() Deep Dive"
        subtitle="The exec family of functions is the heart of Unix process management. Understanding execvp() means understanding how programs launch other programs — the foundation of every shell."
        icon="⚡"
        gradient="from-purple-900/60 to-indigo-900/40"
      />

      <H2>3.1 The exec() Family — An Overview</H2>
      <P>
        The <strong className="text-white">exec family</strong> is a group of C library functions that let a process <strong className="text-cyan-300">replace itself</strong> with a different program. All of them ultimately call the same kernel system call: <Mono>execve()</Mono>.
      </P>

      <Table
        headers={['Function', 'Arguments Style', 'Path Search', 'Environment', 'Use Case']}
        rows={[
          [<Mono key="1">execl()</Mono>, 'List (varargs)', 'No (full path)', 'Inherits', 'When you know exact path'],
          [<Mono key="2">execle()</Mono>, 'List (varargs)', 'No (full path)', 'Custom', 'Custom environment needed'],
          [<Mono key="3">execlp()</Mono>, 'List (varargs)', 'Yes (uses PATH)', 'Inherits', 'Shell-like PATH search, list style'],
          [<Mono key="4">execv()</Mono>, 'Array (argv)', 'No (full path)', 'Inherits', 'Full path, array arguments'],
          [<Mono key="5">execvp()</Mono>, 'Array (argv)', 'Yes (uses PATH)', 'Inherits', '⭐ Most common! Array + PATH search'],
          [<Mono key="6">execvpe()</Mono>, 'Array (argv)', 'Yes (uses PATH)', 'Custom', 'Custom environment + array'],
          [<Mono key="7">execve()</Mono>, 'Array (argv)', 'No (full path)', 'Custom', 'Direct kernel call — lowest level'],
        ]}
      />

      <InfoBox>
        <strong>Naming Key:</strong> The letters after "exec" tell you what it does:
        <br/>• <strong>v</strong> = vector (array of arguments) | <strong>l</strong> = list (varargs, comma-separated)
        <br/>• <strong>p</strong> = PATH search enabled | <strong>e</strong> = custom environment
        <br/>So <Mono>execvp</Mono> = exec + vector arguments + PATH search.
      </InfoBox>

      <H2>3.2 execvp() — Signature and Parameters</H2>

      <CodeBlock
        code={`#include <unistd.h>

int execvp(const char *file, char *const argv[]);

// Parameters:
// file  = name or path of program to execute
//         If no '/' in name → searches PATH directories
//         If contains '/' → used as direct path
//
// argv  = NULL-terminated array of strings
//         argv[0] = program name (by convention)
//         argv[1] = first actual argument
//         ...
//         argv[n] = NULL  ← MUST end with NULL
//
// Return value:
//         On SUCCESS: NEVER returns (process is replaced!)
//         On FAILURE: returns -1, sets errno`}
        language="c"
        filename="execvp_signature.c"
      />

      <H2>3.3 Understanding PATH Search</H2>
      <P>
        When you call <Mono>execvp("ls", args)</Mono> with just "ls" (no slash), how does the OS find the <Mono>ls</Mono> program? It searches through the <strong className="text-white">PATH environment variable</strong>.
      </P>

      <AsciiDiagram title="How PATH Resolution Works" content={`
  Your PATH variable (check with: echo $PATH):
  /usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin

  When execvp("ls", args) is called:
  1. Is there a '/' in "ls"?  NO → do PATH search
  2. Try /usr/local/bin/ls  → Does it exist? No
  3. Try /usr/bin/ls        → Does it exist? No
  4. Try /bin/ls            → Does it exist? YES! ✓
  5. Execute /bin/ls

  When execvp("./exec1", args) is called:
  1. Is there a '/' in "./exec1"? YES → use directly
  2. Execute ./exec1 (from current directory)

  When execvp("/bin/ls", args) is called:
  1. Is there a '/' in "/bin/ls"? YES → use directly
  2. Execute /bin/ls`} />

      <TipBox>
        <strong>Use "./" for your own programs!</strong> Programs in the current directory are NOT in PATH by default. So to exec your own compiled program, you must use <Mono>"./myprogram"</Mono> (with the ./) or the full path. Just using <Mono>"myprogram"</Mono> will fail!
      </TipBox>

      <H2>3.4 The Most Critical Fact About exec()</H2>
      <P>
        This is the single most important thing to understand about exec():
      </P>

      <div className="bg-red-950/30 border-2 border-red-500/40 rounded-xl p-6 my-6">
        <p className="text-red-300 font-black text-lg mb-3 text-center">⚠️ EXEC NEVER RETURNS ON SUCCESS ⚠️</p>
        <p className="text-gray-300 text-sm leading-relaxed text-center">
          If execvp() succeeds, the calling process is <strong className="text-white">completely replaced</strong> by the new program.
          The SAME PID continues, but with a brand new memory image.
          There is NO way to "come back" — the original process is gone.
          Any code after execvp() will NEVER run on success.
        </p>
      </div>

      <AsciiDiagram title="execvp() Success vs Failure" content={`
  ON SUCCESS:
  ┌────────────────────────────────────────────┐
  │ exec_demo1.c process (PID: 1234)           │
  │                                            │
  │  execvp("./exec1", args);                  │
  │  ↓                                         │
  │  [PROCESS IMAGE REPLACED]                  │
  │                                            │
  │  printf("Ending----"); ← NEVER EXECUTES   │
  └────────────────────────────────────────────┘
              ↓ transforms into ↓
  ┌────────────────────────────────────────────┐
  │ exec1.c process (STILL PID: 1234!)         │
  │                                            │
  │  printf("I am exec1.c\\n");  ← Runs!       │
  └────────────────────────────────────────────┘

  ON FAILURE:
  ┌────────────────────────────────────────────┐
  │ exec_demo1.c process (PID: 1234)           │
  │                                            │
  │  execvp("./badprogram", args);  ← fails!  │
  │  returns -1                                │
  │  ↓ execution CONTINUES here               │
  │  perror("execvp failed");  ← this runs!   │
  └────────────────────────────────────────────┘`} />

      <SectionDivider title="Internal Working" subtitle="What happens inside the OS" />

      <H2>3.5 What Happens Inside the OS When exec() is Called</H2>

      <NumberedList items={[
        <><strong className="text-white">System Call Entry:</strong> execvp() is a library wrapper. It eventually calls the kernel's <Mono>execve()</Mono> system call, switching from user mode to kernel mode.</>,
        <><strong className="text-white">File Opening & Validation:</strong> The kernel opens the specified executable file, validates it (checks permissions, checks if it's a valid executable format like ELF).</>,
        <><strong className="text-white">ELF Header Parsing:</strong> The kernel reads the ELF header to understand the program's structure — where the text segment starts, data segment sizes, entry point address.</>,
        <><strong className="text-white">Old Memory Freed:</strong> The kernel destroys the calling process's entire memory address space — text, data, BSS, heap, stack. All gone.</>,
        <><strong className="text-white">New Memory Mapped:</strong> The kernel maps the new program's segments into the process's address space. Text segment is mapped read-only. Data and BSS segments are set up.</>,
        <><strong className="text-white">Stack Initialized:</strong> A fresh stack is created with argc, argv, and the environment variables (envp) placed at the top.</>,
        <><strong className="text-white">Registers Reset:</strong> The program counter (instruction pointer) is set to the entry point of the new program (its <Mono>main()</Mono> function, or technically its <Mono>_start</Mono> function).</>,
        <><strong className="text-white">Return to User Mode:</strong> Control returns to user mode, and the NEW program starts executing from its beginning.</>,
      ]} />

      <H3>What Gets Inherited (Survives exec):</H3>
      <Table
        headers={['Inherited (Survives)', 'Replaced (Destroyed)']}
        rows={[
          ['PID (Process ID)', 'Text segment (code)'],
          ['PPID (Parent Process ID)', 'Data and BSS segments'],
          ['Open file descriptors (stdin, stdout, stderr)', 'Heap memory'],
          ['Environment variables', 'Stack'],
          ['User ID, Group ID', 'Signal handlers (reset to default)'],
          ['Current working directory', 'Shared memory mappings (usually)'],
          ['Resource limits', 'Thread local storage'],
        ]}
      />

      <ExamBox>
        <strong>🎯 Exam Critical:</strong> "The PID does NOT change after exec()." This is a very commonly tested fact. The process keeps the SAME PID but gets a completely new program image. exec() is like renovating a house — the address (PID) stays the same but everything inside changes.
      </ExamBox>

      <H2>3.6 Error Handling with exec()</H2>

      <CodeBlock
        code={`#include <stdio.h>
#include <unistd.h>
#include <errno.h>     // for errno
#include <string.h>    // for strerror()

int main()
{
    char *args[] = {"./nonexistent_program", NULL};

    execvp(args[0], args);

    // If we reach here, execvp() FAILED!
    // It returned -1 and set errno

    // Method 1: perror() — prints system error message
    perror("execvp failed");

    // Method 2: Manual with strerror()
    fprintf(stderr, "Error: %s\\n", strerror(errno));

    // Common errno values after exec failure:
    // ENOENT (2)  = file not found
    // EACCES (13) = permission denied
    // ENOEXEC     = not a valid executable

    return 1;  // Return non-zero to indicate failure
}`}
        language="c"
        filename="exec_error_handling.c"
      />

      <WarningBox>
        <strong>Never do this:</strong> <Mono>printf("execvp failed");</Mono> alone without returning/exiting! If exec fails, the code continues running. You should always print the error AND then return or exit with a non-zero status code.
      </WarningBox>

      <VivaQA questions={[
        { q: 'What does execvp() do?', a: 'execvp() replaces the current process\'s memory image (code, data, stack) with a new program. The PID stays the same but the program changes completely. If successful, it never returns — execution continues in the new program.' },
        { q: 'What do the "v" and "p" mean in execvp?', a: '"v" means vector — arguments are passed as an array (argv[]). "p" means PATH — the function searches the PATH environment variable to find the executable, just like the shell does.' },
        { q: 'When does execvp() return?', a: 'execvp() only returns when it FAILS. On success, the process is replaced and there is nothing to return to. On failure, it returns -1 and sets errno.' },
        { q: 'Why must argv end with NULL in execvp()?', a: 'execvp() scans the argv array to find arguments. Since it doesn\'t know the count, it relies on the NULL pointer at the end to know where the arguments stop. Without NULL, it would read beyond the array — undefined behavior.' },
        { q: 'Does execvp() change the PID?', a: 'No! The PID remains exactly the same. exec() only replaces the memory content, not the process identity.' },
      ]} />
    </div>
  );
}
