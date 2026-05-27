import {
  ChapterHeader, H2, H3, P, InfoBox,
  AsciiDiagram, Mono, KeyBox
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter12() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="12"
        title="Advanced Concepts for Extra Marks"
        subtitle="Beyond the basics — signals, pipe+fork patterns, environment variables, and security. Master these for distinction-level grades and technical interviews."
        icon="🚀"
        gradient="from-purple-900/60 to-violet-900/40"
      />

      <InfoBox>
        These topics may not be in your basic lab exercises but could be asked in viva for bonus marks. They also appear in placement interview questions.
      </InfoBox>

      <H2>12.1 Signals and Process Control</H2>
      <P>
        Signals are software interrupts sent to processes. They are the OS's way of telling a process something happened.
      </P>

      <AsciiDiagram title="Common Signals" content={`
  Signal    Number    Default Action    Caused By
  ──────────────────────────────────────────────────────
  SIGTERM   15        Terminate         kill PID (graceful)
  SIGKILL   9         Kill (forced)     kill -9 PID (no handler!)
  SIGINT    2         Terminate         Ctrl+C in terminal
  SIGCHLD   17        Ignore            Child exits/stops
  SIGSEGV   11        Core dump         Segmentation fault
  SIGPIPE   13        Terminate         Write to closed pipe
  SIGSTOP   19        Stop              Ctrl+Z (can't be caught!)
  SIGCONT   18        Continue          fg command (resume)
  SIGHUP    1         Terminate         Terminal closed
  SIGALRM   14        Terminate         alarm() timer expires

  Send signal in C:
  kill(pid, SIGTERM);   // Send SIGTERM to process
  raise(SIGINT);        // Send signal to yourself
  
  Handle signal in C:
  signal(SIGCHLD, handler);   // old API
  sigaction(SIGCHLD, &sa, NULL);  // modern, recommended`} />

      <H2>12.2 Pipe + Fork — Inter-Process Communication</H2>
      <P>
        A pipe connects the output of one process to the input of another. This is how <Mono>ls | grep .c</Mono> works.
      </P>

      <CodeBlock
        code={`#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main()
{
    int pipefd[2];   // pipefd[0] = read end, pipefd[1] = write end
    pipe(pipefd);    // Create the pipe

    pid_t pid = fork();

    if (pid == 0) {
        // CHILD: Read from pipe and write to stdout
        close(pipefd[1]);                    // Close write end (not needed)
        dup2(pipefd[0], STDIN_FILENO);       // stdin = read end of pipe
        close(pipefd[0]);                    // Close original read end

        // Now child's stdin comes from the pipe!
        char *args[] = {"grep", ".c", NULL};
        execvp("grep", args);
    }
    else {
        // PARENT: Write ls output into pipe
        close(pipefd[0]);                    // Close read end (not needed)
        dup2(pipefd[1], STDOUT_FILENO);      // stdout = write end of pipe
        close(pipefd[1]);                    // Close original write end

        // Now parent's stdout goes into the pipe!
        char *args[] = {"ls", NULL};
        execvp("ls", args);
        // wait() not needed here since parent also execs
    }

    return 0;
    // This implements: ls | grep .c
}`}
        language="c"
        filename="pipe_fork.c"
      />

      <H2>12.3 Environment Variables</H2>
      <P>
        Environment variables are key=value pairs inherited by child processes. They configure program behavior without command-line arguments.
      </P>

      <CodeBlock
        code={`#include <stdio.h>
#include <stdlib.h>   // for getenv()
#include <unistd.h>

// Third parameter to main() — environment:
int main(int argc, char *argv[], char *envp[])
{
    // Method 1: getenv() — easiest way
    char *path = getenv("PATH");
    char *home = getenv("HOME");
    printf("PATH = %s\\n", path);
    printf("HOME = %s\\n", home);

    // Method 2: iterate envp[]
    for (char **env = envp; *env != NULL; env++) {
        printf("%s\\n", *env);  // Prints KEY=VALUE pairs
    }

    // Method 3: use extern environ
    extern char **environ;
    for (char **e = environ; *e; e++) {
        printf("%s\\n", *e);
    }

    // Set environment variable for child:
    setenv("MY_VAR", "hello", 1);  // 1 = overwrite if exists
    char *args[] = {"./child_program", NULL};
    execvp(args[0], args);  // child inherits MY_VAR

    return 0;
}`}
        language="c"
        filename="env_vars.c"
      />

      <H2>12.4 dup2() — File Descriptor Manipulation</H2>
      <AsciiDiagram title="dup2() for I/O Redirection" content={`
  Normal state:
  fd 0 (stdin)  → terminal keyboard
  fd 1 (stdout) → terminal screen
  fd 2 (stderr) → terminal screen

  After: int fd = open("output.txt", O_WRONLY|O_CREAT, 0644);
         dup2(fd, STDOUT_FILENO);  // fd 1 now → output.txt!
         close(fd);               // close duplicate

  New state:
  fd 0 (stdin)  → terminal keyboard
  fd 1 (stdout) → output.txt         ← printf goes HERE now!
  fd 2 (stderr) → terminal screen

  When child execs "ls" after this setup:
  ls writes to stdout (fd 1) → goes to output.txt
  This is how shell implements: ls > output.txt`} />

      <H2>12.5 waitpid() with WNOHANG — Non-Blocking Check</H2>

      <CodeBlock
        code={`#include <sys/wait.h>

// Server pattern: handle multiple children without blocking
void sigchld_handler(int sig)
{
    int status;
    pid_t pid;

    // Reap ALL available children (WNOHANG = don't block)
    while ((pid = waitpid(-1, &status, WNOHANG)) > 0) {
        printf("Child %d finished\\n", pid);
        if (WIFEXITED(status)) {
            printf("Exit code: %d\\n", WEXITSTATUS(status));
        }
    }
}

int main()
{
    // Install SIGCHLD handler
    signal(SIGCHLD, sigchld_handler);

    // Fork multiple children
    for (int i = 0; i < 5; i++) {
        if (fork() == 0) {
            // Each child does something
            sleep(i);
            exit(i);  // Exit with different codes
        }
    }

    // Parent does its own work (not blocked)
    while (1) {
        printf("Parent working...\\n");
        sleep(1);
    }

    return 0;
}`}
        language="c"
        filename="sigchld_handler.c"
      />

      <H2>12.6 Security Issues in exec() Programs</H2>

      <AsciiDiagram title="Common Security Vulnerabilities" content={`
  1. PATH Injection:
  ─────────────────
  // VULNERABLE:
  execvp("ls", args);   // Searches PATH — attacker can put
                         // malicious "ls" earlier in PATH!
  
  // SAFER:
  execvp("/bin/ls", args);  // Absolute path — no PATH search
  
  2. Argument Injection:
  ──────────────────────
  // User provides: argv[1] = "--help; rm -rf /"
  // If passed directly to shell:
  system(argv[1]);  // DANGEROUS! system() uses /bin/sh
  
  // Safe alternative:
  char *args[] = {"ls", argv[1], NULL};  // No shell involved
  execvp("/bin/ls", args);  // args passed as-is, not interpreted
  
  3. setuid Race Conditions:
  ──────────────────────────
  // If a setuid program opens a file, forks, and drops privileges:
  // attacker may swap the file between check and open (TOCTOU attack)
  
  4. Environment Variable Poisoning:
  ────────────────────────────────
  // Attacker sets LD_PRELOAD to inject malicious library
  // Mitigation: exec() on setuid programs ignores LD_PRELOAD`} />

      <H2>12.7 execve() — The True System Call</H2>

      <CodeBlock
        code={`#include <unistd.h>

// execve() is the ACTUAL system call. All other exec functions call this.
int execve(const char *pathname, char *const argv[], char *const envp[]);

// pathname: MUST be absolute or relative path — NO PATH search!
// argv: NULL-terminated argument array (same as execvp's argv)
// envp: NULL-terminated environment array (KEY=VALUE strings)

// Example:
char *args[] = {"/bin/ls", "-l", NULL};
char *env[] = {"PATH=/bin:/usr/bin", "HOME=/root", NULL};

execve("/bin/ls", args, env);
// ls runs with ONLY the specified environment variables
// (ignores the current process's environment)

// This gives you COMPLETE CONTROL over the child's environment`}
        language="c"
        filename="execve_example.c"
      />

      <H3>Comparison Table: execvp() vs execve()</H3>
      <AsciiDiagram title="execvp vs execve" content={`
  Feature              execvp()              execve()
  ─────────────────────────────────────────────────────────
  PATH search          YES                   NO
  Custom environment   NO (inherits)         YES (explicit)
  First arg            Program name/path     Must be full path
  Use case             General use           Full control
  Header               unistd.h              unistd.h
  Underlying call      Calls execve()        IS the syscall`} />

      <KeyBox>
        <strong>Interview Gold:</strong> If asked "how does exec() work at the lowest level?", say: "All exec() variants ultimately call execve() which is the actual Linux system call (syscall number 59 on x86_64). It calls do_execve() in the kernel which loads the ELF binary using load_elf_binary(), replaces the process address space, and transfers control to the new program's entry point."
      </KeyBox>
    </div>
  );
}
