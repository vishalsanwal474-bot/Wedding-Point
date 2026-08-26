import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSettings } from '../services/publicApi';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { resolvePricingConfig } from '../utils/pricing';

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  error: null,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSettings();
      setSettings({
        ...DEFAULT_SETTINGS,
        ...data,
        pricing: resolvePricingConfig(data?.pricing),
      });
    } catch (err) {
      setError(err.message);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value = useMemo(
    () => ({
      settings,
      loading,
      error,
      refreshSettings: loadSettings,
    }),
    [settings, loading, error]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
