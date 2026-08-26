import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { buildLocalBusinessJsonLd } from '../utils/seo';

const SCRIPT_ID = 'wedding-point-localbusiness-jsonld';

function SeoStructuredData() {
  const { settings } = useSettings();

  useEffect(() => {
    const payload = buildLocalBusinessJsonLd(settings);
    let script = document.getElementById(SCRIPT_ID);

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(payload);
  }, [settings]);

  return null;
}

export default SeoStructuredData;
