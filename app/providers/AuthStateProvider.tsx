"use client";

import { auth } from "@/firebase/config";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthStateContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthStateContext = createContext<AuthStateContextType>(
  {} as AuthStateContextType,
);

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  return useContext(AuthStateContext);
}
