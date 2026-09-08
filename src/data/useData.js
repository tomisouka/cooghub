// src/data/useData.js
// Split from DataContext.jsx so that file only exports the component
// (DataProvider), satisfying react-refresh/only-export-components.

import { useContext } from "react";
import { DataContext } from "./dataContextInstance";

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
