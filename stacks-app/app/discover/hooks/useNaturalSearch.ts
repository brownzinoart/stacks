import { useState, useCallback } from 'react';
import type { NaturalLanguageSearchResult } from '@/lib/mockData';

interface SearchState {
  query: string;
  results: NaturalLanguageSearchResult[];
  loading: boolean;
  error: string | null;
}

export function useNaturalSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, query }));

    try {
      const response = await fetch('/api/search/natural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId: 'user-1' // TODO: Get from auth context
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        results: data.results || [],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
        loading: false,
        results: []
      }));
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ query: '', results: [], loading: false, error: null });
  }, []);

  return {
    ...state,
    search,
    clearResults
  };
}
