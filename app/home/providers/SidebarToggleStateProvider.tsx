"use client";

import { useState, useContext, createContext, ReactNode } from "react";

type SidebarToggleStateContextType = {
  showSidebar: boolean;
  toggleSidebar: () => void;
};

const SidebarToggleStateContext = createContext<SidebarToggleStateContextType>({
  showSidebar: true,
  toggleSidebar: () => {},
});

function SidebarToggleStateProvider({ children }: { children: ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <SidebarToggleStateContext.Provider
      value={{ showSidebar: showSidebar, toggleSidebar: toggleSidebar }}
    >
      {children}
    </SidebarToggleStateContext.Provider>
  );
}

function useSidebarToggleState() {
  return useContext(SidebarToggleStateContext);
}

export { SidebarToggleStateProvider as default, useSidebarToggleState };
