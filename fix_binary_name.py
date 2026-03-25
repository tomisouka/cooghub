#!/usr/bin/env python3
"""
Renames the Tauri binary from 'app' to 'coogs-hub' in src-tauri/Cargo.toml.
Run from your project root: python3 fix_binary_name.py
"""
import re, shutil
from pathlib import Path

CARGO = Path("src-tauri/Cargo.toml")

if not CARGO.exists():
    print("✗ src-tauri/Cargo.toml not found — run from project root")
    exit(1)

# Backup
shutil.copy(CARGO, CARGO.with_suffix(".toml.bak"))
print(f"  backed up → {CARGO.with_suffix('.toml.bak')}")

text = CARGO.read_text()

# [package] name = "app"  →  name = "coogs-hub"
text, n1 = re.subn(r'(^\[package\].*?^name\s*=\s*)"app"', r'\1"coogs-hub"', text, count=1, flags=re.MULTILINE | re.DOTALL)

# [lib] name = "app_lib"  →  name = "coogs_hub_lib"  (lib names must use underscores)
text, n2 = re.subn(r'(^\[lib\].*?^name\s*=\s*)"app_lib"', r'\1"coogs_hub_lib"', text, count=1, flags=re.MULTILINE | re.DOTALL)

CARGO.write_text(text)

print(f"  ✓ [package] name → coogs-hub" if n1 else "  ~ [package] name unchanged (already set?)")
print(f"  ✓ [lib] name     → coogs_hub_lib" if n2 else "  ~ [lib] name unchanged (already set?)")
print()
print("Next: rebuild + reinstall")
print("  cd ~/rabbit/root/projects/onit/coogs-hub")
print("  CARGO_BUILD_JOBS=2 pnpm tauri build && sudo dpkg -i src-tauri/target/release/bundle/deb/Coogs\\ Hub_0.1.0_amd64.deb")
print("  coogs-hub")
