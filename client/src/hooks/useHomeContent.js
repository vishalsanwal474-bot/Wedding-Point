import { useCallback, useEffect, useState } from 'react';
import {
  fetchGallery,
  fetchPackages,
  fetchServices,
  fetchTestimonials,
} from '../services/publicApi';

const initialState = {
  services: [],
  packages: [],
  gallery: [],
  testimonials: [],
};

function useHomeContent() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [services, packages, gallery, testimonials] = await Promise.all([
        fetchServices(),
        fetchPackages(),
        fetchGallery(),
        fetchTestimonials(),
      ]);

      setData({
        services: services || [],
        packages: packages || [],
        gallery: gallery || [],
        testimonials: testimonials || [],
      });
    } catch (err) {
      setError(err.message || 'Unable to load content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, reload: load };
}

export default useHomeContent;
