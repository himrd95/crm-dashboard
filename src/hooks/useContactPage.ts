import { useCallback, useEffect, useState } from 'react';
import { fetchContactPage, resetContactCache } from '../api/contactApi';
import type { ContactPageData } from '../types';

interface UseContactPageResult {
  data: ContactPageData | null;
  loading: boolean;
  error: string | null;
  layoutVariant: 'default' | 'alt';
  switchLayout: () => void;
  refetch: () => void;
}

export function useContactPage(): UseContactPageResult {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutVariant, setLayoutVariant] = useState<'default' | 'alt'>('default');

  const load = useCallback(async (variant: 'default' | 'alt') => {
    setLoading(true);
    setError(null);
    try {
      resetContactCache();
      const layoutFile = variant === 'alt' ? 'layout-alt.json' : 'layout.json';
      const pageData = await fetchContactPage(layoutFile);
      setData(pageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contact data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(layoutVariant);
  }, [layoutVariant, load]);

  const switchLayout = useCallback(() => {
    setLayoutVariant((v) => (v === 'default' ? 'alt' : 'default'));
  }, []);

  const refetch = useCallback(() => {
    load(layoutVariant);
  }, [layoutVariant, load]);

  return { data, loading, error, layoutVariant, switchLayout, refetch };
}
