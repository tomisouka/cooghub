#!/usr/bin/env bash
# fix_content.sh — Coogs Hub content sync + diagnostics
# Run from the root of your coogs-hub project:
#   bash fix_content.sh
#
# What it does:
#   1. Syncs src/content/ -> public/content/  (so Tauri builds + fetch() both work)
#   2. Creates public/pdfs/                   (so PDFViewer can find .pdf files)
#   3. Renames files with spaces/parens       (prevents broken HTTP fetches)
#   4. Patches subjects.json + subjects.js    (updates any renamed file paths)
#   5. Runs a diagnostic report               (shows what's registered vs missing)

# Use current working directory as project root
# Run this script from inside your coogs-hub folder: bash fix_content.sh
ROOT="$PWD"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

log()  { echo -e "${GREEN}[fix]${RESET} $*"; }
warn() { echo -e "${YELLOW}[warn]${RESET} $*"; }
info() { echo -e "${CYAN}[info]${RESET} $*"; }

echo ""
echo -e "${CYAN}============================================${RESET}"
echo -e "${CYAN}  COOGS HUB -- CONTENT FIX + DIAGNOSTICS  ${RESET}"
echo -e "${CYAN}============================================${RESET}"
echo ""

# ── 1. Sync src/content → public/content ──────────────────────────────────────
info "Syncing src/content/ -> public/content/ ..."

python3 - "src/content" "public/content" << 'PYEOF'
import os, shutil, sys

src_root  = sys.argv[1]
dest_root = sys.argv[2]

if not os.path.isdir(src_root):
    print(f"\033[1;33m[warn]\033[0m {src_root} not found -- skipping sync.")
    sys.exit(0)

copied = 0
for dirpath, dirnames, filenames in os.walk(src_root):
    rel_dir   = os.path.relpath(dirpath, src_root)
    dest_dir  = os.path.join(dest_root, rel_dir)
    os.makedirs(dest_dir, exist_ok=True)
    for fname in filenames:
        src_file  = os.path.join(dirpath, fname)
        dest_file = os.path.join(dest_dir, fname)
        if not os.path.exists(dest_file):
            shutil.copy2(src_file, dest_file)
            print(f"\033[0;32m[fix]\033[0m Copied: {src_file}")
            copied += 1

if copied == 0:
    print("\033[0;32m[fix]\033[0m All files already in sync -- nothing to copy.")
else:
    print(f"\033[0;32m[fix]\033[0m Sync complete -- {copied} file(s) copied.")
PYEOF

# ── 2. Create public/pdfs ─────────────────────────────────────────────────────
if [ ! -d "public/pdfs" ]; then
  mkdir -p public/pdfs
  log "Created public/pdfs/ -- drop your .pdf files here."
else
  log "public/pdfs/ already exists."
fi

# ── 3 + 4. Rename bad filenames and patch data files ──────────────────────────
info "Checking for bad filenames and patching data files..."

python3 - << 'PYEOF'
import os, re, json

root = os.getcwd()

# ── Step 3: rename files with spaces or parens ────────────────────────────────
search_dirs = [
    os.path.join(root, "public/content"),
    os.path.join(root, "src/content"),
]

renamed = {}

for search_dir in search_dirs:
    if not os.path.isdir(search_dir):
        continue
    for dirpath, dirnames, filenames in os.walk(search_dir):
        for fname in filenames:
            if " " in fname or "(" in fname or ")" in fname:
                new_fname = fname.replace(" ", "_").replace("(", "").replace(")", "")
                new_fname = re.sub(r"_+", "_", new_fname)
                if new_fname != fname:
                    old_path = os.path.join(dirpath, fname)
                    new_path = os.path.join(dirpath, new_fname)
                    if not os.path.exists(new_path):
                        os.rename(old_path, new_path)
                        print(f"\033[1;33m[warn]\033[0m Renamed: {fname}  ->  {new_fname}")
                        renamed[fname] = new_fname

if not renamed:
    print("\033[0;32m[fix]\033[0m No problematic filenames found.")

# ── Step 4: patch data files ──────────────────────────────────────────────────
# Hardcoded known renames (catches cases where file was already renamed on disk
# but data files still reference the old name)
known = {
    "automata_cosc3340_hw3_solutions (1).html": "automata_cosc3340_hw3_solutions_1.html",
    "algos_gopal_induction(1).html":            "algos_gopal_induction1.html",
    "discrete-math-guide (1).html":             "discrete-math-guide_1.html",
    "linear-algebra-guide (1).html":            "linear-algebra-guide_1.html",
}
known.update(renamed)

data_files = [
    os.path.join(root, "src/data/subjects.json"),
    os.path.join(root, "src/data/subjects.js"),
]

for data_path in data_files:
    if not os.path.exists(data_path):
        continue
    content = open(data_path).read()
    changed = False
    for old_name, new_name in known.items():
        if old_name in content:
            content = content.replace(old_name, new_name)
            base = os.path.basename(data_path)
            print(f"\033[0;32m[fix]\033[0m {base}: '{old_name}' -> '{new_name}'")
            changed = True
    if changed:
        open(data_path, "w").write(content)
PYEOF

# ── 5. Diagnostic report ──────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}── DIAGNOSTIC REPORT ───────────────────────${RESET}"
echo ""

python3 - << 'PYEOF'
import json, os

root = os.getcwd()

try:
    data = json.load(open(os.path.join(root, "src/data/subjects.json")))
except Exception as e:
    print(f"\033[0;31m[err]\033[0m Could not load subjects.json: {e}")
    exit(1)

html_files, pdf_files, code_files = [], [], []

def walk(obj):
    if isinstance(obj, list):
        for i in obj: walk(i)
    elif isinstance(obj, dict):
        f = obj.get("file", "")
        p = obj.get("path", "")
        if f.endswith(".html"): html_files.append(f)
        if f.endswith(".pdf"):  pdf_files.append(f)
        if p: code_files.append(p)
        for v in obj.values(): walk(v)

walk(data)

def resolve(f, ftype):
    if ftype == "pdf":
        return [os.path.join(root, "public/pdfs", f)]
    if ftype == "code":
        if f.startswith("./content/"):
            rel = f.replace("./content/", "")
            return [
                os.path.join(root, "public/content", rel),
                os.path.join(root, "src/content", rel),
            ]
        return []
    # html
    if f.startswith("./content/"):
        rel = f.replace("./content/", "")
        return [
            os.path.join(root, "public/content", rel),
            os.path.join(root, "src/content", rel),
        ]
    return [os.path.join(root, "public/references", f)]

G = "\033[0;32m"
R = "\033[0;31m"
C = "\033[0;36m"
X = "\033[0m"

ok = missing = 0

def check(f, ftype):
    global ok, missing
    paths = resolve(f, ftype)
    if not paths:
        return
    found = any(os.path.exists(p) for p in paths)
    if found:
        print(f"  {G}+{X}  {f}")
        ok += 1
    else:
        print(f"  {R}x{X}  {f}")
        for p in paths:
            print(f"       -> {os.path.relpath(p, root)}")
        missing += 1

uh = sorted(set(html_files))
up = sorted(set(pdf_files))
uc = sorted(set(code_files))

print(f"{C}── HTML files ({len(uh)} registered) ─────────────────────{X}")
for f in uh: check(f, "html")

print(f"\n{C}── PDF files ({len(up)} registered) ───────────────────────{X}")
for f in up: check(f, "pdf")

print(f"\n{C}── Code files ({len(uc)} registered) ──────────────────────{X}")
for f in uc: check(f, "code")

print(f"""
{C}── SUMMARY ─────────────────────────────────────{X}
  {G}+  Found:   {ok}{X}
  {R}x  Missing: {missing}{X}
""")

if missing > 0:
    print(f"""{R}Action needed for missing files:{X}
  HTML (./content/...) -> add to public/content/ matching the registered path
  HTML (no prefix)     -> add to public/references/ matching the registered path
  PDF                  -> drop into public/pdfs/
  Re-run this script after adding files to verify.
""")
PYEOF

echo -e "${GREEN}Done.${RESET}"
echo ""
