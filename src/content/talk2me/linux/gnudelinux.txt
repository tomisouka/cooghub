┌─────────────────────────────────────────────────────────────────────┐
│            THE GNU + LINUX COMBINATION                              │
│         "What people call 'Linux' is really GNU/Linux"              │
└─────────────────────────────────────────────────────────────────────┘

        BEFORE THE MERGE (Early 1990s)
        ═══════════════════════════════

┌──────────────────────┐              ┌──────────────────────┐
│    GNU PROJECT       │              │   LINUX KERNEL       │
│     (Est. 1983)      │              │    (Est. 1991)       │
│  Richard Stallman    │              │  Linus Torvalds      │
├──────────────────────┤              ├──────────────────────┤
│                      │              │                      │
│  ✓ Bash (shell)      │              │  ✓ Kernel core       │
│  ✓ GCC (compiler)    │              │  ✓ Process mgmt      │
│  ✓ Coreutils (ls,    │              │  ✓ Memory mgmt       │
│    cp, mv, cat...)   │              │  ✓ Device drivers    │
│  ✓ Grep, sed, awk    │              │  ✓ File systems      │
│  ✓ Tar, gzip         │              │  ✓ Networking        │
│  ✓ Emacs editor      │              │                      │
│  ✓ Make              │              │  ✗ NO USER TOOLS     │
│  ✓ Glibc (C library) │              │  ✗ NO SHELL          │
│                      │              │  ✗ NO COMPILER       │
│  ✗ NO KERNEL!        │              │  ✗ NO UTILITIES      │
│    (GNU Hurd was     │              │                      │
│     in development)  │              │  Just the core!      │
└──────────────────────┘              └──────────────────────┘
         INCOMPLETE                          INCOMPLETE


                              1991: THE MERGE
                              ═══════════════
                                     │
                    ┌────────────────┴────────────────┐
                    │  Linus: "I need tools to build  │
                    │   and use my kernel..."         │
                    │  GNU: "We need a kernel..."     │
                    └────────────────┬────────────────┘
                                     ▼

┌─────────────────────────────────────────────────────────────────────┐
│                    COMPLETE GNU/LINUX SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │   USERS/APPS    │  (You interact here)
                         │  Firefox, VLC   │
                         │  LibreOffice    │
                         └────────┬────────┘
                                  │
                ┌─────────────────▼─────────────────┐
                │         GNU TOOLS LAYER           │  ◄── GNU Project
                ├───────────────────────────────────┤
                │  Shell (Bash)                     │
                │  $ ls -la                         │
                │  $ cp file.txt backup/            │
                │  $ gcc program.c -o program       │
                │  $ tar -xzf archive.tar.gz        │
                │                                   │
                │  Core Utilities:                  │
                │  • File ops: ls, cp, mv, rm, cat  │
                │  • Text: grep, sed, awk, sort     │
                │  • System: ps, top, kill, df      │
                │  • Network: wget, curl            │
                │                                   │
                │  Development:                     │
                │  • GCC compiler                   │
                │  • Make build system              │
                │  • GDB debugger                   │
                │  • Binutils (linker, assembler)   │
                │                                   │
                │  C Library (glibc)                │
                │  • printf(), malloc(), open()     │
                └────────────┬──────────────────────┘
                             │
                             │ System Calls
                             │ (read, write, open, fork, exec...)
                             │
                ┌────────────▼──────────────────────┐
                │      LINUX KERNEL LAYER           │  ◄── Linus Torvalds
                ├───────────────────────────────────┤
                │                                   │
                │  Process Management               │
                │  ┌───┐ ┌───┐ ┌───┐               │
                │  │PID│ │PID│ │PID│               │
                │  │ 1 │ │ 2 │ │ 3 │               │
                │  └───┘ └───┘ └───┘               │
                │                                   │
                │  Memory Management                │
                │  [RAM] [SWAP] [PAGE TABLE]        │
                │                                   │
                │  File System Management           │
                │  ext4, btrfs, xfs, vfat...        │
                │                                   │
                │  Device Drivers                   │
                │  🖥️  💾  🖨️  🔊  📶              │
                │  GPU HDD USB Audio WiFi           │
                │                                   │
                │  Network Stack                    │
                │  TCP/IP, routing, firewall        │
                │                                   │
                └────────────┬──────────────────────┘
                             │
                ┌────────────▼──────────────────────┐
                │         HARDWARE                  │
                │  CPU  RAM  Disk  Network  GPU     │
                └───────────────────────────────────┘