import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSettings } from '../data/demoData';
import { api } from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from DB on load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const dbSettings = await api.getSettings();
        if (dbSettings) {
          // Safety: Merge DB data with defaults so missing fields (like openingHours) don't crash the app
          setSettings({
            ...defaultSettings,
            ...dbSettings,
            openingHours: dbSettings.openingHours || defaultSettings.openingHours,
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings. Using defaults.', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    try {
      await api.updateSettings(patch);
    } catch (err) {
      console.error('Failed to update settings in DB:', err);
    }
  }, []);

  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    try {
      await api.updateSettings(defaultSettings);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    }
  }, []);

  const value = useMemo(
    () => ({ settings, isLoading, updateSettings, resetSettings }),
    [settings, isLoading, updateSettings, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}