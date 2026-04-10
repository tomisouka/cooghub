[ Windows Game ]
       |
       v
+------------------------+
|        PROTON          |
|  +------------------+ |
|  |       WINE       | | <-- Windows API → Linux (system calls, memory, files)
|  +------------------+ |
|  |      DXVK        | | <-- DirectX → Vulkan (graphics, shaders)
|  +------------------+ |
|  |  Proton Extras   | | <-- Steam patches, libraries, tweaks
|  +------------------+ |
+------------------------+
       |
       v
+------------------------+
|  Anti-Cheat Layer?      | <-- optional
|  User-space: ✅ ok       |
|  Kernel-space: ❌ blocks |
|  Hooks system calls,    |
|  inspects memory, etc.  |
+------------------------+
       |
       v
+------------------------+
|     Linux Kernel       |
|  +------------------+ |
|  |   GPU Driver     | | <-- communicates with GPU hardware
|  +------------------+ |
+------------------------+
       |
       v
    Hardware (CPU, GPU, RAM, etc.)
