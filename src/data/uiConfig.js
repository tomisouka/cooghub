// src/data/uiConfig.js
// Shared UI display constants used across pages/components.

export const FONT = "'Inter', 'Segoe UI', sans-serif";
export const MONO = "'Courier New', monospace";

export const BUCKET_ICONS = {
  notes: "≡", references: "⊞", assignments: "✎", code: "⌥", pdfs: "⎘", flashcards: "⟁",
};

export const TICKET_STATUS_MAP = {
  "IN PROGRESS": { label: "IN PROGRESS", color: "#f0c040", bg: "#f0c04022" },
  "OPEN":        { label: "OPEN",        color: "#ff6060", bg: "#ff606022" },
  "DONE":        { label: "DONE",        color: "#4ddd99", bg: "#4ddd9922" },
};

export const TICKET_FIELD_CONFIG = [
  { key: "function", label: "Function", color: "#b8a0ff", icon: "⚙" },
  { key: "error",    label: "Error",    color: "#ff6060", icon: "✕" },
  { key: "solution", label: "Solution", color: "#4ddd99", icon: "✓" },
];