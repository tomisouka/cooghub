================================================================================
                    LINUX TERMINAL CHEAT SHEET
================================================================================

NAVIGATION COMMANDS
-------------------
pwd                         # Print Working Directory (where am I?)
ls                          # List files in current directory
ls -l                       # List with details (permissions, size, date)
ls -a                       # List all files (including hidden)
ls -la                      # List all files with details
cd /path/to/folder          # Change directory to specific path
cd ~                        # Go to home directory
cd ..                       # Go up one directory level
cd -                        # Go to previous directory


FILE & FOLDER OPERATIONS
------------------------
cp file1 file2              # Copy file1 to file2
cp -r folder1 folder2       # Copy folder recursively
mv file1 file2              # Move or rename file
rm file                     # Delete file
rm -r folder                # Delete folder and contents
mkdir foldername            # Create new directory
rmdir foldername            # Remove empty directory
touch filename              # Create empty file
cat filename                # Display file contents
less filename               # View file (page by page, press q to quit)
head filename               # Show first 10 lines
tail filename               # Show last 10 lines
nano filename               # Edit file with nano text editor


FILE PERMISSIONS & OWNERSHIP
----------------------------
chmod +x file               # Make file executable
chmod 755 file              # Set specific permissions (rwxr-xr-x)
chown user:group file       # Change file owner
sudo command                # Run command as superuser/admin


PACKAGE MANAGEMENT (APT)
------------------------
sudo apt update             # Refresh package lists from repositories
sudo apt upgrade            # Upgrade all installed packages
sudo apt install package    # Install a package
sudo apt remove package     # Remove a package
sudo apt autoremove         # Remove unused dependencies
sudo apt search keyword     # Search for packages
sudo apt show package       # Show package details
dpkg -l                     # List all installed packages


SYSTEM INFORMATION
------------------
whoami                      # Display current username
uname -a                    # Show system information
hostname                    # Show computer name
df -h                       # Show disk space usage (human readable)
du -sh folder               # Show folder size
free -h                     # Show RAM usage
top                         # Show running processes (press q to quit)
htop                        # Better process viewer (install: sudo apt install htop)
lsblk                       # List block devices (drives)
lscpu                       # CPU information
lspci                       # List PCI devices (graphics card, etc)


PROCESS MANAGEMENT
------------------
ps aux                      # Show all running processes
kill PID                    # Kill process by ID
killall processname         # Kill all processes with name
Ctrl+C                      # Stop current running command
Ctrl+Z                      # Pause current command
bg                          # Resume paused command in background
fg                          # Bring background command to foreground


NETWORK COMMANDS
----------------
ping website.com            # Test connection to website
ifconfig                    # Show network interfaces (may need: sudo apt install net-tools)
ip a                        # Show network interfaces (modern version)
wget URL                    # Download file from URL
curl URL                    # Transfer data from URL


SEARCH & FIND
-------------
find /path -name filename   # Find file by name
grep "text" file            # Search for text in file
grep -r "text" folder       # Search recursively in folder
locate filename             # Quick file search (needs: sudo updatedb first)


COMPRESSION & ARCHIVES
----------------------
tar -czvf archive.tar.gz folder     # Create compressed archive
tar -xzvf archive.tar.gz            # Extract archive
unzip file.zip                      # Extract zip file
zip -r archive.zip folder           # Create zip archive


HELP & DOCUMENTATION
--------------------
man command                 # Show manual for command (man ls, man apt)
command --help              # Show quick help for command
apropos keyword             # Search manual pages for keyword
which command               # Show location of command
history                     # Show command history
clear                       # Clear terminal screen


SHORTCUTS IN TERMINAL
---------------------
Tab                         # Auto-complete commands/file names
Ctrl+C                      # Cancel current command
Ctrl+D                      # Exit terminal
Ctrl+L                      # Clear screen (same as 'clear')
Ctrl+A                      # Move cursor to beginning of line
Ctrl+E                      # Move cursor to end of line
Ctrl+U                      # Delete from cursor to beginning
Ctrl+K                      # Delete from cursor to end
Up/Down arrows              # Navigate command history
Ctrl+R                      # Search command history


USEFUL TIPS
-----------
Use sudo with caution       # Only use when needed for system changes
~ means home directory      # ~/Documents = /home/username/Documents
. means current directory   # ./script.sh = run script in current folder
.. means parent directory   # cd .. = go up one level
* is a wildcard             # rm *.txt = delete all .txt files
| is a pipe                 # ls | grep word = search ls output for "word"
> redirects output          # ls > files.txt = save ls output to file
>> appends output           # echo "text" >> file.txt = add to end of file


FLATPAK COMMANDS (for apps like Kdenlive)
------------------------------------------
flatpak install flathub org.app.name    # Install flatpak app
flatpak update                          # Update all flatpak apps
flatpak list                            # List installed flatpak apps
flatpak uninstall org.app.name          # Remove flatpak app
flatpak run org.app.name                # Run flatpak app from terminal


COMMON BEGINNER MISTAKES
-------------------------
✗ Typing "CD" instead of "cd"           # Linux is case-sensitive!
✗ Forgetting sudo for installs          # apt install will fail without sudo
✗ Using rm -rf without being careful    # This PERMANENTLY deletes!
✗ Not reading error messages            # They usually tell you what's wrong
✗ Spaces in commands matter             # "ls-la" is wrong, "ls -la" is right


================================================================================
SAVE THIS FILE: Right-click artifact → Save/Download
Keep it open in a text editor while you practice!
================================================================================
