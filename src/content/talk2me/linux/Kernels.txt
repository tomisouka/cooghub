Linux Kernel
                    (same for all)
                         |
        ┌────────────────┴────────────────┐
        |                                  |
   Linux Mint                          Arch Linux
        |                                  |
        |                                  |
    [SHARED LAYER - Everything Below is Identical]
    ├── File System Structure (/, /home, /etc, /usr)
    ├── Terminal Commands (ls, cd, grep, chmod, etc.)
    ├── Bash Shell & Scripting
    ├── User/Group Permissions (rwx model)
    ├── systemd (init system)
    └── Core Unix Philosophy
        |
        |
    [DIVERGENCE POINT - Different Choices Made Here]
        |
        ┴────────────────────────────────────────────────
        |                                                |
   Linux Mint Path                              Arch Linux Path
        |                                                |
    ├── APT Package Manager                      ├── Pacman Package Manager
    │   └── apt install                          │   └── pacman -S
    │   └── apt update                           │   └── pacman -Syu
    │                                            │
    ├── Debian Package Format (.deb)             ├── Arch Package Format (.pkg.tar.zst)
    │                                            │
    ├── Ubuntu/Debian Repositories               ├── Arch User Repository (AUR)
    │                                            │
    ├── Cinnamon Desktop (default)               ├── No default desktop
    │   └── Pre-installed                        │   └── You choose & install
    │                                            │
    ├── Driver Manager (GUI)                     ├── Manual driver installation
    │                                            │
    ├── Update Manager (GUI)                     ├── Command-line updates only
    │                                            │
    ├── Lots of pre-installed software           ├── Minimal base system
    │   └── Ready to use immediately             │   └── Build it yourself
    │                                            │
    ├── Stable/tested packages                   ├── Rolling release
    │   └── Ubuntu LTS base                      │   └── Bleeding edge updates
    │                                            │
    └── Beginner-friendly tools                  └── Advanced user tools
        └── Mint Welcome, Software Manager           └── Wiki, manual config
