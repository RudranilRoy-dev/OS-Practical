export const codes = {
  file_info: `// file_info.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    if (argc < 2) {
        printf("Usage: %s <filename>\\n", argv[0]);
        exit(1);
    }

    printf("Program name : %s\\n", argv[0]);
    printf("File to examine: %s\\n", argv[1]);
    printf("Total arguments: %d\\n", argc);

    // execvp to run 'ls -l' on the given file
    char *args[] = {"ls", "-l", argv[1], NULL};
    execvp("ls", args);

    // If execvp fails:
    perror("execvp failed");
    return 1;
}`,

  exec1: `// exec1.c
#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    printf("I am exec1.c\\n");
    printf("\\nThe no. of arguments is %d.\\n", argc);
    printf("\\nThe arguments are:");

    for (int i = 0; i < argc; i++) {
        puts(argv[i]);
        printf("\\t");
    }

    return 0;
}`,

  exec2: `// exec2.c
#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    int i;
    printf("I am exec2.c called by execvp() ");
    printf("\\nThe no. of arguments is %d.", argc);
    printf("\\n");
    printf("\\nThe arguments are:");
    for (i = 0; i < argc; i++) {
        puts(argv[i]);
        printf("\\t");
    }

    return 0;
}`,

  exec_demo1: `// exec_demo1.c  (also referred to as exec_demo.c)
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main()
{
    // A null terminated array of character pointers
    char *args[] = {"./exec1", NULL};

    // Commented alternatives shown for learning:
    // char *args[] = {"./exec2", "5", "7", NULL};
    // execvp("./exec2", args);
    // execvp(args[0], args);
    // execvp("./exec1", args);

    execvp(args[0], args);

    /* All statements are ignored after execvp() call
       as this whole process (execDemo.c) is replaced
       by another process (exec1.c)
    */
    printf("Ending-----");

    return 0;
}`,

  exec_demo2: `// exec_demo2.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char *argv[])
{
    // A null terminated array of character pointers

    if (argc > 1) {
        argv[argc] = NULL;
    }

    puts(argv[0]);
    execvp(argv[1], &argv[1]);

    /* All statements are ignored after execvp() call
       as this whole process (execDemo.c) is replaced
       by another process (EXEC.c)
    */
    printf("%d", argc);
    printf("Ending-----");

    return 0;
}`,

  fork: `// fork.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>
#define MAX 20

int main(int argc, char* argv[])
{
    int pid, status;

    pid = fork();
    if (pid == 0)
    {
        execvp(argv[1], &argv[1]);
        printf("execvp failed");
        return 1;
    }
    else
        wait(&status);

    return 0;
}`,
};
