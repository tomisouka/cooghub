// src/data/DataContext.jsx
// Loads all app data from disk on startup (Tauri) or via API (browser).
// All pages read from this context instead of static imports.

import { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

// Static fallbacks — used on first render before disk load completes
import { DEPARTMENTS, ALL_COURSES, LANG_REFS, MATH_SHARED_REFS } from "./subjects";
import { TABS } from "./tabs";
import { NAV } from "./nav";
import { BUCKET_ICONS, FONT, MONO, TICKET_FIELD_CONFIG, TICKET_STATUS_MAP } from "./uiConfig";
import { FLASHCARD_SETS } from "./flashcards";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

async function loadFile(filename) {
  try {
    if (IS_TAURI) {
      return await invoke("load_data_file", { filename });
    } else {
      const res = await fetch(`/api/load-data-file?filename=${filename}`);
      const data = await res.json();
      return data.content;
    }
  } catch (e) {
    console.error(`[DataContext] failed to load ${filename}:`, e);
    return null;
  }
}

function parseJSON(raw, fallback) {
  if (!raw) return fallback;
  try { return JSON.parse(raw); }
  catch (e) { console.error("[DataContext] parse error:", e); return fallback; }
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    DEPARTMENTS,
    ALL_COURSES,
    LANG_REFS,
    MATH_SHARED_REFS,
    TABS,
    NAV,
    BUCKET_ICONS,
    FONT,
    MONO,
    TICKET_FIELD_CONFIG,
    TICKET_STATUS_MAP,
    FLASHCARD_SETS,
    loaded: false,
  });

  // Extracted so it can be called on demand (e.g. after an upload patches subjects.json)
  function reloadData() {
    return Promise.all([
      loadFile("subjects.json"),
      loadFile("tabs.json"),
      loadFile("nav.json"),
      loadFile("uiConfig.json"),
      loadFile("flashcards.json"),
    ]).then(([subjects, tabs, nav, uiConfig, flashcards]) => {
      const s = parseJSON(subjects, {});
      const t = parseJSON(tabs, {});
      const n = parseJSON(nav, {});
      const u = parseJSON(uiConfig, {});
      const f = parseJSON(flashcards, {});

      setData(prev => ({
        ...prev,
        DEPARTMENTS:       s.DEPARTMENTS       ?? prev.DEPARTMENTS,
        ALL_COURSES:       s.ALL_COURSES        ?? prev.ALL_COURSES,
        LANG_REFS:         s.LANG_REFS          ?? prev.LANG_REFS,
        MATH_SHARED_REFS:  s.MATH_SHARED_REFS   ?? prev.MATH_SHARED_REFS,
        TABS:              t.TABS               ?? prev.TABS,
        NAV:               n.NAV                ?? prev.NAV,
        BUCKET_ICONS:      u.BUCKET_ICONS       ?? prev.BUCKET_ICONS,
        FONT:              u.FONT               ?? prev.FONT,
        MONO:              u.MONO               ?? prev.MONO,
        TICKET_FIELD_CONFIG: u.TICKET_FIELD_CONFIG ?? prev.TICKET_FIELD_CONFIG,
        TICKET_STATUS_MAP: u.TICKET_STATUS_MAP  ?? prev.TICKET_STATUS_MAP,
        FLASHCARD_SETS:    f.FLASHCARD_SETS     ?? prev.FLASHCARD_SETS,
        loaded: true,
      }));
    });
  }

  useEffect(() => { reloadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper functions derived from live data
  const getCourse = (courseId) => data.ALL_COURSES.find(c => c.id === courseId) || null;
  const getDept   = (deptId)   => data.DEPARTMENTS.find(d => d.id === deptId)   || null;
  const courseContentCount = (course) => {
    if (course.isHub) return 0;
    return (course.notes?.length       ?? 0) +
           (course.references?.length  ?? 0) +
           (course.assignments?.length ?? 0) +
           (course.code?.length        ?? 0) +
           (course.pdfs?.length        ?? 0) +
           (course.flashcards ? 1 : 0) +
           (course.langRefs   ? 1 : 0);
  };

  return (
    <DataContext.Provider value={{ ...data, getCourse, getDept, courseContentCount, reloadData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
