```text
Operating System (Linux)
│
├── Kernel
│   └── Hardware, memory, processes
│
├── User Space
│   │
│   ├── Applications
│   │   ├── VS Code
│   │   ├── Brave
│   │   └── Geany
│   │
│   ├── Package Management Layer
│   │   │
│   │   ├── apt (High-level package manager)
│   │   │   ├── update  -> refresh package lists
│   │   │   ├── upgrade -> apply updates
│   │   │   ├── install -> install software
│   │   │   └── remove  -> uninstall software
│   │   │
│   │   └── dpkg (Low-level installer)
│   │       ├── installs .deb files
│   │       ├── configures packages
│   │       └── fixes interrupted installs
│   │
│   ├── Configuration
│   │   ├── /etc        (system-wide configs)
│   │   └── ~/.config  (user configs)
│   │
│   └── Desktop Environment
│       ├── Cinnamon
│       └── XFCE4
│
└── Boot Layer
    ├── initramfs
    └── systemd

Flow Example:
User → apt → dpkg → filesystem → kernel
```

