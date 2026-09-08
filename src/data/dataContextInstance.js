// src/data/dataContextInstance.js
// The raw context object lives here (not in DataContext.jsx) so that file
// can export only the DataProvider component, satisfying
// react-refresh/only-export-components.

import { createContext } from "react";

export const DataContext = createContext(null);
