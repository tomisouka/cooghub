┌─────────────────────────────────────────────┐
│           REMOTE SERVER (GitHub)            │
│  "The Official Record Keeper"               │
│  - Everyone's shared truth                  │
│  - Single source of truth                   │
└─────────────────────────────────────────────┘
                    ↑↓
              git push / git pull
                    ↑↓
┌─────────────────────────────────────────────┐
│            YOUR LOCAL COPY                  │
│  "Your Personal Workspace"                  │
│  ├─ Working Directory (files you see)       │
│  ├─ Staging Area (git add)                  │
│  └─ Local Repository (git commit)           │
└─────────────────────────────────────────────┘

-----------------------------------------------

YOU: [Edit files] → git add → git commit → git push → SERVER
        ↓             ↓           ↓           ↓
     Working      Staging      Local       Remote
    Directory      Area       Repo         Repo
   (untracked)   (ready to    (saved       (shared
                 be saved)    locally)     with all)

----------------------------------------------

            Main Story (master/main branch)
            │
            ├─ Feature A (feature/login branch)
            │  "Let me work on login without messing up main"
            │
            └─ Bug Fix (fix/crash branch)
               "Let me fix crash without affecting feature A"

---------------------------------------------

# 1. Listen to current conversation
git pull origin main

# 2. Start a new topic (branch)
git checkout -b feature/login-system

# 3. Make your points locally
git add .
git commit -m "Added login form"

# 4. Continue the conversation locally
git add .
git commit -m "Added validation"

# 5. Share your complete thoughts
git push origin feature/login-system

# 6. Ask to merge into main conversation (Pull Request on GitHub)
#    Others review your work before it becomes part of main story

---------------------------------------------------

YOU: "Let me work on this feature in my own space (branch)"
     ↓
     You work locally (add/commit)
     ↓
     When ready, share: "Hey team, review my work!" (push + PR)
     ↓
     Team approves → Merged into main story

----------------------------------------------------

[Your Computer]
    ├─ Working Files (what you edit)
    ├─ Staging Area (git add → "these changes")
    └─ Local Git (git commit → "save checkpoint")
    
[Remote Server]
    └─ All commits from everyone (git push → share)

-----------------------------------------------------------

# Your workflow is perfectly valid:
git add .
git commit -m "My changes"
git push origin main

---------------------------

git checkout -b experiment/new-design
# Break everything, try things
# If it works: git merge experiment
# If it fails: git checkout main (go back to safe state)

---------------------------------

# On main: working on feature A
git stash  # Save incomplete work
git checkout -b fix/urgent-bug
# Fix bug, commit, push
git checkout main  # Back to feature A
git stash pop  # Resume where you left off

----------------------------------

main: A - B - C (stable)
        \
         alice-feature: D - E - F
         \
          bob-feature: G - H



