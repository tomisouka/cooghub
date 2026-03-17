┌─────────────────────────────────────────────────────────────────┐
│                    YOUR HOME FOLDER (~/)                        │
│                                                                 │
│  📁 Documents/         ← Your visible files live here           │
│  📁 Downloads/                                                  │
│  📁 Pictures/                                                   │
│  📁 Projects/                                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         HIDDEN FOLDERS (start with a dot)                │  │
│  │                                                          │  │
│  │  .config/  ⚙️  ← App settings & preferences             │  │
│  │  │                                                       │  │
│  │  ├─ Code/         (VS Code settings)                    │  │
│  │  ├─ firefox/      (Firefox config)                      │  │
│  │  └─ git/          (Git global config)                   │  │
│  │                                                          │  │
│  │  .cache/  💾  ← Temporary cached data                   │  │
│  │  │              (SAFE to delete - will regenerate)      │  │
│  │  │                                                       │  │
│  │  ├─ thumbnails/                                         │  │
│  │  ├─ mozilla/                                            │  │
│  │  └─ pip/                                                │  │
│  │                                                          │  │
│  │  .local/  📦  ← Local app data & binaries               │  │
│  │  │                                                       │  │
│  │  ├─ share/        (app data, icons, fonts)             │  │
│  │  └─ bin/          (sometimes used for executables)     │  │
│  │                                                          │  │
│  │  .ssh/  🔐  ← SSH keys (IMPORTANT - don't delete!)     │  │
│  │  │                                                       │  │
│  │  ├─ id_rsa        (private key)                        │  │
│  │  ├─ id_rsa.pub    (public key)                         │  │
│  │  └─ known_hosts                                         │  │
│  │                                                          │  │
│  │  DEVELOPMENT TOOLS:                                     │  │
│  │  ════════════════════                                   │  │
│  │  .npm/     📦  Node package cache                       │  │
│  │  .cargo/   🦀  Rust tools & packages                    │  │
│  │  .dotnet/  🔷  .NET SDK files                           │  │
│  │  .pyenv/   🐍  Python version manager                   │  │
│  │                                                          │  │
│  │  SHELL CONFIG FILES:                                    │  │
│  │  ════════════════════                                   │  │
│  │  .bashrc          ← Bash shell configuration           │  │
│  │  .zshrc           ← Zsh shell configuration            │  │
│  │  .bash_history    ← Command history                    │  │
│  │                                                          │  │
│  │  YOUR CUSTOM FOLDERS:                                   │  │
│  │  ═════════════════════                                  │  │
│  │  .dump/    🗑️   Your personal dump folder              │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  bin/  🔧  ← Custom executables (NO dot - visible!)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

         ╔═══════════════════════════════════════╗
         ║      CLEANUP SAFETY GUIDE             ║
         ╠═══════════════════════════════════════╣
         ║  ✅ SAFE to delete:                   ║
         ║     • .cache/ contents                ║
         ║     • .dump/ (your folder)            ║
         ║     • Old dev tool folders if unused  ║
         ║                                       ║
         ║  ⚠️  CAREFUL:                         ║
         ║     • .config/ (you'll lose settings) ║
         ║     • .local/share/ (app data)        ║
         ║                                       ║
         ║  ❌ NEVER delete:                     ║
         ║     • .ssh/ (your security keys!)     ║
         ║     • .bashrc / .zshrc (shell breaks) ║
         ╚═══════════════════════════════════════╝

            To see all hidden folders: ls -la ~/