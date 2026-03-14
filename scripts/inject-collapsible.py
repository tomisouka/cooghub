#!/usr/bin/env python3
"""
inject-collapsible.py
Injects mobile-collapsible sidebar into all reference HTML files.
Minimal approach: just hide sidebar on mobile, slide in on toggle.
Run from project root: python3 scripts/inject-collapsible.py
"""

import os
import re

FILES = [
    "public/references/algorithms_reference.html",
    "public/references/llms/introllms.html",
    "public/references/llms/agents.html",
    "public/references/databases_reference.html",
    "public/references/comporg_reference.html",
    "public/references/python_reference.html",
    "public/references/cpp_reference.html",
    "public/references/automata_reference.html",
    "public/references/opsystems_reference.html",
    "public/references/linux_reference.html",
    "public/references/ds_reference.html",
]

MOBILE_CSS = """
/* ── Mobile collapsible sidebar ───────────────────────────────────────────── */
#sidebar-toggle {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 300;
  background: var(--surface, #161920);
  color: var(--text, #d4d8e0);
  border: 1px solid var(--border, #2a2e38);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
}

.sidebar-overlay.open {
  display: block;
}

@media (max-width: 768px) {
  #sidebar-toggle {
    display: block;
  }

  /* Hide sidebar off-screen by default */
  .sidebar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    z-index: 250 !important;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    width: 85vw !important;
    max-width: 300px !important;
    min-width: unset !important;
  }

  .sidebar.open {
    transform: translateX(0);
    box-shadow: 4px 0 32px rgba(0,0,0,0.6);
  }

  /* Main content fills full width since sidebar is out of flow */
  .main {
    width: 100% !important;
    min-width: 0 !important;
  }

  /* Give topbar left padding so toggle button doesn't overlap text */
  .topbar {
    padding-left: 48px !important;
    flex-wrap: wrap !important;
  }
}
"""

TOGGLE_HTML = '<button id="sidebar-toggle">\u2630 Timeline</button>\n<div class="sidebar-overlay" id="sidebar-overlay"></div>\n'

TOGGLE_JS = """
<script>
(function() {
  var btn     = document.getElementById('sidebar-toggle');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (!btn || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    btn.textContent = '\u2715 Close';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    btn.textContent = '\u2630 Timeline';
  }

  btn.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('.tl-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
})();
</script>
"""

MARKER = "/* ── Mobile collapsible sidebar"

def strip_old(content):
    content = re.sub(
        r'/\* ── Mobile collapsible sidebar.*?(?=</style>)',
        '', content, flags=re.DOTALL
    )
    content = re.sub(
        r'<button id="sidebar-toggle">.*?</div>\n',
        '', content, flags=re.DOTALL
    )
    content = re.sub(
        r'\n<script>\n\(function\(\).*?\}\)\(\);\n</script>\n',
        '', content, flags=re.DOTALL
    )
    return content

def inject(filepath):
    if not os.path.exists(filepath):
        print(f"  \u26a0 skipped (not found): {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if MARKER in content:
        content = strip_old(content)

    content = content.replace("</style>", MOBILE_CSS + "</style>", 1)
    content = re.sub(r"(<body[^>]*>)", r"\1\n" + TOGGLE_HTML, content, count=1)
    content = content.replace("</body>", TOGGLE_JS + "</body>", 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  \u2713 injected: {filepath}")

print("\U0001f527 Injecting collapsible sidebar into reference files...")
for f in FILES:
    inject(f)
print("\u2705 Done!")
