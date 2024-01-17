"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

enum THEMES {
  light = "light",
  dark = "dark",
}

type ThemeContextType = {
  theme: string | undefined;
  toggleTheme: () => void;
};

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.light,
  toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>();

  useEffect(() => {
    const persistedTheme = localStorage.getItem(STORAGE_KEY);
    if (persistedTheme) {
      setTheme(persistedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme(THEMES.dark);
    } else {
      setTheme(THEMES.light);
    }
  }, []);

  useEffect(() => {
    if (theme === THEMES.dark) {
      document.body.classList.add(THEMES.dark);
      localStorage.setItem(STORAGE_KEY, THEMES.dark);
    } else if (theme === THEMES.light) {
      document.body.classList.remove(THEMES.dark);
      localStorage.setItem(STORAGE_KEY, THEMES.light);
    } else {
      return;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === THEMES.light ? THEMES.dark : THEMES.light);
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

export { THEMES, ThemeProvider as default, useTheme };
