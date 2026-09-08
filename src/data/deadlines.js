// src/data/deadlines.js
// Single source of truth for deadlines, skill levels, and course tiers.
// Auto-saved by Coogs Hub. Do not edit manually while app is open.
// Last updated: 2026-01-01T00:00:00.000Z

export const DEADLINES = [
  {
    "title": "Assignment 1",
    "course": "CS 101",
    "date": "2026-01-15",
    "time": "23:59",
    "notes": "",
    "type": "school",
    "priority": "normal",
    "id": "1000000000001",
    "done": true
  },
  {
    "title": "Assignment 2",
    "course": "CS 101",
    "date": "2026-01-22",
    "time": "23:59",
    "notes": "",
    "type": "school",
    "priority": "normal",
    "id": "1000000000002",
    "done": false
  }
];

export const SKILL_LEVELS = {};

export const COURSE_TIERS = {
  "algos": "current",
  "automata": "current",
  "opsystems": "current",
  "databases": "current",
  "linear": "current",
  "datastruct": "research",
  "discrete": "research",
  "comporg": "research",
  "cpp": "ambition",
  "python": "ambition"
};
