          WINDOWS                          |          LINUX (theory)
------------------------------------------|---------------------------------------
[ LockDown Browser ]                       | [ LockDown Browser ]
       |                                   |        |
       v                                   |        v
+------------------------+                 | +------------------------+
| Windows Kernel Hooks   | <-- required     | | WINE / Proton          |
| - Blocks other apps    |                   | | - Translates system    |
| - Locks keyboard/mouse |                   | |   calls to Linux       |
| - OS verification      |                   | +------------------------+
+------------------------+                 |        |
       |                                   |        v
       v                                   | +------------------------+
    Hardware                               | | Exam Security Hooks?   |
                                           | | - Kernel-level hooks   |
                                           | |   won’t work           |
                                           | | - User-space may work  |
                                           | +------------------------+
                                           |        |
                                           |        v
                                           |    Linux Kernel
                                           |        |
                                           |        v
                                           |    Hardware
