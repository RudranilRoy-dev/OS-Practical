import {
  ChapterHeader, H2, P, InfoBox, WarningBox, TipBox,
  ExamBox, AsciiDiagram, Table, Mono, SectionDivider, VivaQA, NumberedList
} from '../components/UI';
import CodeBlock from '../components/CodeBlock';

export default function Chapter2() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader
        number="2"
        title="Command Line Arguments"
        subtitle="Understanding argc, argv, and how programs receive input from the shell. This is foundational knowledge — exec() passes arguments exactly this way."
        icon="💬"
        gradient="from-cyan-900/60 to-blue-900/40"
      />

      <InfoBox>
        Before we can understand <Mono>execvp()</Mono>, we MUST understand how command line arguments work. They are passed to every program the same way — as an array of strings.
      </InfoBox>

      <H2>2.1 When You Type a Command...</H2>
      <P>When you type something like this in your terminal:</P>

      <AsciiDiagram title="What happens when you type a command" content={`
  $ ls -l /home/user

  The shell PARSES this into pieces:
  ┌────────┬─────────────────────────────────────┐
  │ argv[0]│  "ls"           ← program name      │
  │ argv[1]│  "-l"           ← first argument    │
  │ argv[2]│  "/home/user"   ← second argument   │
  │ argv[3]│  NULL           ← end marker        │
  └────────┴─────────────────────────────────────┘

  argc = 3   (total count of arguments)
             (notice: NULL is NOT counted)`} />

      <H2>2.2 The main() Function Signature</H2>
      <P>You've probably seen <Mono>int main()</Mono> before. But there's a more powerful version:</P>

      <CodeBlock
        code={`// Simple version — no arguments:
int main()
{
    // Cannot access command line arguments
    return 0;
}

// Full version — WITH command line arguments:
int main(int argc, char *argv[])
{
    // argc = argument count
    // argv = argument vector (array of strings)
    return 0;
}`}
        language="c"
        filename="main_signatures.c"
      />

      <H2>2.3 Understanding argc</H2>
      <P>
        <strong className="text-white">argc</strong> stands for <strong className="text-cyan-300">Argument Count</strong>. It is an <Mono>int</Mono> that tells you <strong className="text-white">how many arguments were passed</strong>, including the program name itself.
      </P>

      <Table
        headers={['Command Typed', 'argc Value', 'Why?']}
        rows={[
          ['$ ./myprogram', '1', 'Only the program name — argv[0]'],
          ['$ ./myprogram hello', '2', 'Program name + one argument'],
          ['$ ./myprogram 5 7', '3', 'Program name + two arguments'],
          ['$ ./myprogram a b c d', '5', 'Program name + four arguments'],
          ['$ ls -l /home', '3', 'Program name (ls) + -l + /home'],
        ]}
      />

      <TipBox>
        <strong>Golden Rule:</strong> argc is ALWAYS at least 1 because argv[0] always contains the program's own name. So argc can NEVER be 0 in a normally running program.
      </TipBox>

      <H2>2.4 Understanding argv — The Real Magic</H2>
      <P>
        <strong className="text-white">argv</strong> stands for <strong className="text-cyan-300">Argument Vector</strong>. It is an <strong className="text-white">array of character pointers</strong> — each pointer points to a string (a character array).
      </P>

      <P>The declaration <Mono>char *argv[]</Mono> means: "an array of pointers to characters." Each element is a C string (char*).</P>

      <AsciiDiagram title="argv Memory Visualization" content={`
  Command: $ ./exec_demo hello world 42

  argc = 4

  argv (in memory):
  ┌─────────┐       ┌───────────────┐
  │ argv[0] │ ────► │ "./exec_demo" │ \0  (null-terminated string)
  ├─────────┤       └───────────────┘
  │ argv[1] │ ────► │ "hello"       │ \0
  ├─────────┤       └───────────────┘
  │ argv[2] │ ────► │ "world"       │ \0
  ├─────────┤       └───────────────┘
  │ argv[3] │ ────► │ "42"          │ \0
  ├─────────┤       └───────────────┘
  │ argv[4] │ ────► NULL            ← VERY IMPORTANT: always ends with NULL
  └─────────┘

  Each string is a NULL-terminated C string (\0 = end of string)
  The array itself ends with a NULL pointer`} />

      <H2>2.5 NULL Termination — The Most Misunderstood Rule</H2>
      <P>
        There are TWO levels of NULL termination you must understand:
      </P>

      <NumberedList items={[
        <><strong className="text-white">Each string ends with \0:</strong> Every individual argument string (like "hello") ends with a null character <Mono>'\0'</Mono>. This is standard C string convention. It tells functions like <Mono>puts()</Mono> and <Mono>printf()</Mono> where the string ends.</>,
        <><strong className="text-white">The argv array ends with NULL:</strong> After the last argument pointer, there is a <Mono>NULL</Mono> pointer (not a null character — a NULL pointer!). This tells <Mono>execvp()</Mono> and other functions where the argument list ends.</>,
      ]} />

      <WarningBox>
        <strong>⚠️ Critical Distinction:</strong> <Mono>'\0'</Mono> (null character, value 0) terminates a STRING. <Mono>NULL</Mono> (null pointer, value 0) terminates the ARRAY. They have the same numeric value (0) but very different conceptual meanings. Confusing these is one of the most common beginner mistakes!
      </WarningBox>

      <AsciiDiagram title="Two Levels of NULL Termination Visualized" content={`
  argv = {"./program", "hello", NULL}

  Level 1: Each STRING ends with null character '\0'
  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
  │ . │ / │ p │ r │ o │ g │ r │ a │ m │\0 │  ← argv[0]
  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
  ┌───┬───┬───┬───┬───┬───┐
  │ h │ e │ l │ l │ o │\0 │  ← argv[1]
  └───┴───┴───┴───┴───┴───┘

  Level 2: The POINTER ARRAY ends with NULL pointer
  ┌──────────┬──────────┬──────────┐
  │ ptr→str0 │ ptr→str1 │  NULL    │  ← argv array itself
  └──────────┴──────────┴──────────┘
  argv[0]    argv[1]    argv[2]=NULL`} />

      <H2>2.6 char *argv[] vs char **argv</H2>
      <P>You'll see both forms in code. They are EQUIVALENT:</P>

      <CodeBlock
        code={`// These two are IDENTICAL in meaning:
int main(int argc, char *argv[])  // array of char pointers
int main(int argc, char **argv)   // pointer to char pointer

// Why? Because in C:
//   char *argv[]  =  "array of pointers to char"
//   char **argv   =  "pointer to pointer to char"
// When passed as function argument, arrays DECAY to pointers.
// So both mean the same thing to the compiler.

// Accessing is also identical:
argv[0]    // first string  (array notation)
*argv      // first string  (pointer notation — same thing!)
argv[1]    // second string
*(argv+1)  // second string (pointer arithmetic)`}
        language="c"
        filename="argv_equivalence.c"
      />

      <SectionDivider title="Practical Examples" />

      <H2>2.7 Working with argc and argv</H2>
      <CodeBlock
        code={`#include <stdio.h>

int main(int argc, char *argv[])
{
    printf("Number of arguments: %d\\n", argc);
    printf("Program name: %s\\n", argv[0]);

    // Loop through ALL arguments
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }

    // Alternative: loop until NULL (pointer style)
    char **p = argv;
    while (*p != NULL) {
        printf("-> %s\\n", *p);
        p++;
    }

    return 0;
}`}
        language="c"
        filename="args_demo.c"
      />

      <ExamBox>
        <strong>🎯 Exam Pattern — Predict the Output:</strong><br/>
        If you run: <Mono>$ ./args_demo apple banana 42</Mono><br/>
        Then: argc = 4, argv[0]="./args_demo", argv[1]="apple", argv[2]="banana", argv[3]="42", argv[4]=NULL<br/>
        Output: Number of arguments: 4, Program name: ./args_demo, etc.
      </ExamBox>

      <H2>2.8 Why &argv[1] is So Important</H2>
      <P>
        In both <Mono>exec_demo2.c</Mono> and <Mono>fork.c</Mono>, you'll see <Mono>&argv[1]</Mono> passed to <Mono>execvp()</Mono>. Let's understand WHY:
      </P>

      <AsciiDiagram title="&argv[1] Explanation" content={`
  Command: $ ./fork ./exec1 hello world

  Full argv:
  argv[0] = "./fork"    ← WE don't want to pass THIS to execvp
  argv[1] = "./exec1"   ← The PROGRAM to run
  argv[2] = "hello"     ← Arguments FOR exec1
  argv[3] = "world"
  argv[4] = NULL

  execvp(argv[1], &argv[1]) means:
  - Run the program named argv[1] = "./exec1"
  - Pass it the array starting AT argv[1]:
    &argv[1] → ["./exec1", "hello", "world", NULL]

  So exec1 receives:
  argv[0] = "./exec1"   ← its own name
  argv[1] = "hello"
  argv[2] = "world"
  argv[3] = NULL
  argc = 3`} />

      <TipBox>
        <strong>Why &argv[1]?</strong> Because <Mono>argv[0]</Mono> is the name of the CURRENT program (fork.c), not the program we want to exec. By passing <Mono>&argv[1]</Mono>, we skip argv[0] and start from the next argument — which IS the program name we want to execute.
      </TipBox>

      <VivaQA questions={[
        { q: 'What is argc?', a: 'argc (argument count) is an integer passed to main() that contains the total number of command-line arguments, including the program name itself (argv[0]).' },
        { q: 'What is argv?', a: 'argv (argument vector) is an array of character pointers (char*). Each element points to a null-terminated string representing one command-line argument. The array itself is terminated by a NULL pointer.' },
        { q: 'What is the minimum value of argc?', a: 'argc is always at least 1, because argv[0] always contains the program\'s name, even if no additional arguments are passed.' },
        { q: 'Why does argv end with NULL?', a: 'The NULL pointer at the end of argv signals the end of the argument list. Functions like execvp() depend on this NULL terminator to know where the arguments end without needing the count.' },
        { q: 'What is the difference between argv[argc] and NULL?', a: 'They refer to the same thing — argv[argc] is guaranteed by the C standard to be NULL. The standard says: "argv[argc] shall be a null pointer."' },
      ]} />
    </div>
  );
}
