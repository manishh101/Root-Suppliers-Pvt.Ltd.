"use client";

import { createContext, useContext, ReactNode } from "react";
import { ISettings } from "@/lib/db/models/Settings";

// Define a safe context shape that doesn't rely on the Mongoose Document type directly
// because serialized props from Server Components might drop Mongoose methods.
type SafeSettings = Omit<ISettings, keyof Document> & {
  _id: string;
};

interface SettingsContextType {
  settings: SafeSettings | null;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
});

export function useSettings() {
  return useContext(SettingsContext);
}

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings: SafeSettings | null;
}

export function SettingsProvider({ children, initialSettings }: SettingsProviderProps) {
  return (
    <SettingsContext.Provider value={{ settings: initialSettings, isLoading: false }}>
      {children}
    </SettingsContext.Provider>
  );
}
