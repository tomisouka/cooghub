┌─────────────────────────────────────────────────────────────────┐
│                    OPERATING SYSTEM LAYERS                      │
└─────────────────────────────────────────────────────────────────┘

USER SPACE (mostly GNU):
━━━━━━━━━━━━━━━━━━━━━━━━
   Applications
        ↕
   GNU Tools & Utilities  ←── GNU provides ~70-80% of user space
        ↕
   GNU C Library (glibc)  ←── Bridges userspace and kernel
        ↕
   ═══════════════════════════════════════
        ↕
KERNEL SPACE (Linux):
━━━━━━━━━━━━━━━━━━━━
   Linux Kernel           ←── Linux provides the kernel (~20-30%)
        ↕
   Hardware

   
┌──────────────────────────────────────────────────────────────┐
│  USER TYPES: $ ls -la                                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  1. Bash (GNU) interprets input  │  ◄─── GNU
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  2. Executes 'ls' program (GNU)  │  ◄─── GNU
        │     from /bin/ls                 │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  3. ls uses glibc functions      │  ◄─── GNU
        │     opendir(), readdir()         │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  4. glibc makes system calls     │  
        │     open(), getdents()           │  ─────┐
        └──────────────────────────────────┘       │
                                                    │
        ═══════════════════════════════════════════╪═══
                                                    │
        ┌───────────────────────────────────────┐  │
        │  5. Linux kernel handles syscalls     │◄─┘  ◄─── LINUX
        │     - Checks permissions              │
        │     - Accesses filesystem             │
        │     - Reads directory data            │
        │     - Returns data to userspace       │
        └──────────────┬────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  6. Data flows back up            │
        │     Kernel → glibc → ls → bash   │  ◄─── GNU
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  7. Output displayed on terminal │  ◄─── GNU
        │     drwxr-xr-x 2 user user 4096  │
        │     -rw-r--r-- 1 user user  123  │
        └──────────────────────────────────┘