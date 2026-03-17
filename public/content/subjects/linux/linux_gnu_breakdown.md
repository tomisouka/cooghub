═══════════════════════════════════════════════════════════════════════════════════════════════════
                          OPERATING SYSTEMS ARCHITECTURE COMPARISON
═══════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│         LINUX/GNU           │          WINDOWS            │           macOS             │
├─────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│                             │                             │                             │
│    ┌───────────────────┐   │    ┌───────────────────┐   │    ┌───────────────────┐   │
│    │  USER INTERFACE   │   │    │  USER INTERFACE   │   │    │  USER INTERFACE   │   │
│    │   (Desktop Env)   │   │    │   (Windows UI)    │   │    │      (Aqua)       │   │
│    │  GNOME/KDE/XFCE   │   │    │   Explorer/GUI    │   │    │     Finder/GUI    │   │
│    └─────────┬─────────┘   │    └─────────┬─────────┘   │    └─────────┬─────────┘   │
│              │              │              │              │              │              │
│    ┌─────────▼─────────┐   │    ┌─────────▼─────────┐   │    ┌─────────▼─────────┐   │
│    │  USER APPLICATIONS│   │    │  USER APPLICATIONS│   │    │  USER APPLICATIONS│   │
│    │  Firefox, Chrome  │   │    │   Office, Chrome  │   │    │  Safari, Mail     │   │
│    │  LibreOffice, etc │   │    │   Edge, etc       │   │    │  Pages, etc       │   │
│    └─────────┬─────────┘   │    └─────────┬─────────┘   │    └─────────┬─────────┘   │
│              │              │              │              │              │              │
│  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │
│  │   GNU UTILITIES      │  │  │   WIN32 API/WIN64   │  │  │    COCOA/CARBON      │  │
│  │  bash, grep, sed     │  │  │  System Libraries   │  │  │   macOS Frameworks   │  │
│  │  coreutils, gcc      │  │  │  .NET Framework     │  │  │   Core Foundation    │  │
│  └───────────┬──────────┘  │  └───────────┬──────────┘  │  └───────────┬──────────┘  │
│              │              │              │              │              │              │
│  ════════════▼═══════════  │  ════════════▼═══════════  │  ════════════▼═══════════  │
│   USER SPACE │ KERNEL      │   USER SPACE │ KERNEL      │   USER SPACE │ KERNEL      │
│  ════════════▼═══════════  │  ════════════▼═══════════  │  ════════════▼═══════════  │
│              │              │              │              │              │              │
│  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │
│  │    LINUX KERNEL      │  │  │    NT KERNEL         │  │  │      XNU KERNEL      │  │
│  │   (Monolithic)       │  │  │   (Hybrid)           │  │  │   (Hybrid: Mach+BSD) │  │
│  │                      │  │  │                      │  │  │                      │  │
│  │ • Process Mgmt       │  │  │ • Process Mgmt       │  │  │ • Mach Microkernel   │  │
│  │ • Memory Mgmt        │  │  │ • Memory Mgmt        │  │  │ • BSD Subsystem      │  │
│  │ • File Systems       │  │  │ • File Systems       │  │  │ • I/O Kit            │  │
│  │ • Device Drivers     │  │  │ • Device Drivers     │  │  │ • Process Mgmt       │  │
│  │ • Network Stack      │  │  │ • Network Stack      │  │  │ • Network Stack      │  │
│  │ • Security (SELinux) │  │  │ • Security           │  │  │ • Security (Sandbox) │  │
│  └───────────┬──────────┘  │  └───────────┬──────────┘  │  └───────────┬──────────┘  │
│              │              │              │              │              │              │
│  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │  ┌───────────▼──────────┐  │
│  │   HARDWARE LAYER     │  │  │   HARDWARE LAYER     │  │  │   HARDWARE LAYER     │  │
│  │  CPU, RAM, Disk      │  │  │  CPU, RAM, Disk      │  │  │  CPU, RAM, Disk      │  │
│  │  Network, GPU        │  │  │  Network, GPU        │  │  │  Network, GPU        │  │
│  └──────────────────────┘  │  └──────────────────────┘  │  └──────────────────────┘  │
│                             │                             │                             │
└─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════
                                    KEY DIFFERENCES
═══════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  FEATURE             │  LINUX/GNU              │  WINDOWS                │  macOS                │
├──────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────┤
│  Kernel Type         │  Monolithic             │  Hybrid (NT)            │  Hybrid (XNU)         │
│  Source Code         │  Open Source            │  Closed Source          │  Partially Open       │
│  License             │  GPL                    │  Proprietary            │  Proprietary          │
│  Shell               │  bash/zsh               │  cmd/PowerShell         │  zsh (formerly bash)  │
│  File System         │  ext4/btrfs/xfs         │  NTFS/FAT32             │  APFS/HFS+            │
│  Path Separator      │  /                      │  \                      │  /                    │
│  Root Directory      │  /                      │  C:\                    │  /                    │
│  Package Manager     │  apt/yum/pacman         │  winget/chocolatey      │  Homebrew/MacPorts    │
│  Case Sensitivity    │  Yes (files)            │  No (files)             │  Optional             │
│  Multi-User          │  Built-in (strong)      │  Built-in               │  Built-in (UNIX-like) │
│  Permissions         │  rwx (UNIX)             │  ACL (complex)          │  rwx + ACL            │
│  Registry            │  No                     │  Yes                    │  Limited (plist)      │
│  Hardware Support    │  Wide (may need config) │  Wide (plug-and-play)   │  Limited (Apple HW)   │
└──────────────────────┴─────────────────────────┴─────────────────────────┴───────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════
                                 FILE SYSTEM STRUCTURE
═══════════════════════════════════════════════════════════════════════════════════════════════════

         LINUX/GNU                    WINDOWS                       macOS
    
         /  (root)                    C:\                          /  (root)
         │                            │                            │
         ├── bin/                     ├── Windows/                ├── Applications/
         ├── boot/                    ├── Program Files/          ├── Library/
         ├── dev/                     ├── Users/                  ├── System/
         ├── etc/                     │   └── Username/           ├── Users/
         ├── home/                    │       ├── Desktop/        │   └── username/
         │   └── username/            │       ├── Documents/      │       ├── Desktop/
         │       ├── Desktop/         │       └── Downloads/      │       ├── Documents/
         │       ├── Documents/       ├── ProgramData/            │       └── Downloads/
         │       └── Downloads/       └── Temp/                   ├── bin/
         ├── lib/                                                  ├── etc/
         ├── opt/                                                  ├── tmp/
         ├── proc/                                                 ├── usr/
         ├── root/                                                 └── var/
         ├── sbin/
         ├── tmp/
         ├── usr/
         └── var/


═══════════════════════════════════════════════════════════════════════════════════════════════════
                                    COMMAND EXAMPLES
═══════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TASK                │  LINUX/GNU              │  WINDOWS (CMD/PS)       │  macOS                │
├──────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────┤
│  List Files          │  ls -la                 │  dir / Get-ChildItem    │  ls -la               │
│  Change Directory    │  cd /home/user          │  cd C:\Users\User       │  cd /Users/user       │
│  Copy File           │  cp file1 file2         │  copy file1 file2       │  cp file1 file2       │
│  Move/Rename         │  mv old new             │  move old new           │  mv old new           │
│  Delete File         │  rm file                │  del file               │  rm file              │
│  View File           │  cat file               │  type file              │  cat file             │
│  Find Files          │  find / -name file      │  where /R C:\ file      │  find / -name file    │
│  Processes           │  ps aux / top           │  tasklist / taskmgr     │  ps aux / top         │
│  Kill Process        │  kill PID               │  taskkill /PID          │  kill PID             │
│  Network Info        │  ifconfig / ip addr     │  ipconfig               │  ifconfig             │
│  Disk Usage          │  df -h                  │  wmic logicaldisk       │  df -h                │
│  Current User        │  whoami                 │  whoami                 │  whoami               │
│  Clear Screen        │  clear                  │  cls                    │  clear                │
│  Environment Vars    │  echo $PATH             │  echo %PATH%            │  echo $PATH           │
└──────────────────────┴─────────────────────────┴─────────────────────────┴───────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════
                                    PHILOSOPHY
═══════════════════════════════════════════════════════════════════════════════════════════════════

    LINUX/GNU                          WINDOWS                           macOS
    
    "Everything is a file"             "User-friendly for all"           "It just works"
    
    • Freedom & flexibility            • Widespread compatibility        • Seamless integration
    • Customizable & open              • Enterprise standard             • User experience focus
    • Community-driven                 • Gaming & productivity           • Premium hardware/software
    • Server & development             • GUI-first approach              • Creative professionals
    • Free (as in freedom)             • Commercial licensing            • Walled garden ecosystem
    • Multi-distribution choice        • One unified platform            • Tight hardware control

═══════════════════════════════════════════════════════════════════════════════════════════════════