═══════════════════════════════════════════════════════════════
                    LINUX PERMISSIONS CHEAT SHEET
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ UNDERSTANDING PERMISSION NOTATION                           │
└─────────────────────────────────────────────────────────────┘

Example:  -rwxr-xr--  1  jodye  jodye  4096  Jan 24 12:00  file.txt
          │││││││││││  │    │      │     │       │          │
          │││││││││││  │    │      │     │       │          └─ Filename
          │││││││││││  │    │      │     │       └─ Date modified
          │││││││││││  │    │      │     └─ File size (bytes)
          │││││││││││  │    │      └─ Group owner
          │││││││││││  │    └─ User owner
          │││││││││││  └─ Number of hard links
          │││││││││└─ Others permissions
          ││││││└└─ Group permissions
          │││└└└─ Owner permissions
          └─ File type (- = file, d = directory, l = symlink)

┌─────────────────────────────────────────────────────────────┐
│ PERMISSION TYPES                                            │
└─────────────────────────────────────────────────────────────┘

r  =  READ       (4)  │  View file contents / List directory
w  =  WRITE      (2)  │  Modify file / Add/remove files in directory
x  =  EXECUTE    (1)  │  Run file as program / Enter directory
-  =  NO ACCESS  (0)  │  Permission denied

┌─────────────────────────────────────────────────────────────┐
│ OCTAL NOTATION (NUMERIC)                                    │
└─────────────────────────────────────────────────────────────┘

Binary    Octal    Symbolic    Description
───────────────────────────────────────────────────────────────
0 0 0       0        ---       No permissions
0 0 1       1        --x       Execute only
0 1 0       2        -w-       Write only
0 1 1       3        -wx       Write + Execute
1 0 0       4        r--       Read only
1 0 1       5        r-x       Read + Execute
1 1 0       6        rw-       Read + Write
1 1 1       7        rwx       Full permissions

┌─────────────────────────────────────────────────────────────┐
│ COMMON PERMISSION PATTERNS                                  │
└─────────────────────────────────────────────────────────────┘

chmod 644 file.txt    │  rw-r--r--  │  Owner: read/write, Others: read
chmod 755 file.sh     │  rwxr-xr-x  │  Owner: full, Others: read/execute
chmod 600 secret.key  │  rw-------  │  Owner only (private files)
chmod 700 script.sh   │  rwx------  │  Owner only (private executable)
chmod 777 public/     │  rwxrwxrwx  │  Everyone (⚠️ dangerous!)
chmod 666 shared.txt  │  rw-rw-rw-  │  Everyone can read/write

┌─────────────────────────────────────────────────────────────┐
│ VIEWING PERMISSIONS                                         │
└─────────────────────────────────────────────────────────────┘

ls -l                 # List files with permissions
ls -ld directory/     # Show directory permissions (not contents)
stat -c "%a" file     # Show numeric permissions (e.g., 755)

┌─────────────────────────────────────────────────────────────┐
│ CHANGING PERMISSIONS (chmod)                                │
└─────────────────────────────────────────────────────────────┘

NUMERIC METHOD:
───────────────
chmod 755 file        # Set exact permissions: rwxr-xr-x
chmod 644 file        # Set exact permissions: rw-r--r--

SYMBOLIC METHOD:
────────────────
chmod u+x file        # Add execute for owner (user)
chmod g+w file        # Add write for group
chmod o-r file        # Remove read for others
chmod a+r file        # Add read for all (a = all)
chmod u=rwx file      # Set owner to rwx (replaces existing)

WHO:  u = user/owner  │  g = group  │  o = others  │  a = all
WHAT: + = add  │  - = remove  │  = = set exactly
PERM: r = read  │  w = write  │  x = execute

┌─────────────────────────────────────────────────────────────┐
│ CHANGING OWNERSHIP (chown)                                  │
└─────────────────────────────────────────────────────────────┘

sudo chown alice file         # Change owner to alice
sudo chown alice:staff file   # Change owner to alice, group to staff
sudo chown :staff file        # Change group only
sudo chown -R alice dir/      # Change recursively for directory

┌─────────────────────────────────────────────────────────────┐
│ SPECIAL PERMISSIONS                                         │
└─────────────────────────────────────────────────────────────┘

SETUID (4000):  chmod u+s file  or  chmod 4755 file
  ├─ Runs with owner's privileges (shows as 's' in owner execute)
  └─ Example: /usr/bin/passwd runs as root

SETGID (2000):  chmod g+s file  or  chmod 2755 file
  ├─ On files: runs with group's privileges
  └─ On dirs: new files inherit directory's group

STICKY BIT (1000):  chmod +t dir  or  chmod 1777 dir
  ├─ Only file owner can delete their files in directory
  └─ Example: /tmp (shows as 't' in others execute)

┌─────────────────────────────────────────────────────────────┐
│ PRACTICAL EXAMPLES                                          │
└─────────────────────────────────────────────────────────────┘

# Create file and check permissions
touch example.txt
ls -l example.txt

# Make script executable
chmod +x script.sh
./script.sh

# Secure private key
chmod 600 ~/.ssh/id_rsa

# Share file with group
chmod 664 shared.txt

# Public directory (sticky bit)
mkdir /shared
chmod 1777 /shared

# Recursive permission change
chmod -R 755 /var/www/html/

┌─────────────────────────────────────────────────────────────┐
│ QUICK REFERENCE                                             │
└─────────────────────────────────────────────────────────────┘

VIEW:         ls -l  │  stat -c "%a" file
CHANGE PERM:  chmod  │  chmod 755 file  │  chmod u+x file
CHANGE OWNER: chown  │  sudo chown user:group file
ROOT ACCESS:  sudo   │  sudo chmod 644 file

═══════════════════════════════════════════════════════════════