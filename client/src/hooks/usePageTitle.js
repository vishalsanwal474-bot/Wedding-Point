import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { applyPageSeo, getPageDescription } from '../utils/seo';

function usePageTitle(pageName, description) {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    applyPageSeo({
      pageName,
      businessName: settings.businessName || 'Wedding Point',
      description: description || getPageDescription(pageName),
      path: location.pathname + location.search,
    });
  }, [pageName, description, settings.businessName, location.pathname, location.search]);
}

export default usePageTitle;
