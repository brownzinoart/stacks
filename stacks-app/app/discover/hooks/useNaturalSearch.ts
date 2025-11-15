import { useState, useCallback } from 'react';
import type { NaturalLanguageSearchResult } from '@/lib/mockData';

export type SearchProgress = 
  | 'idle'
  | 'analyzing'
  | 'finding'
  | 'ranking'
  | 'complete';

interface SearchState {
  query: string;
  results: NaturalLanguageSearchResult[];
  loading: boolean;
  progress: SearchProgress;
  error: string | null;
  enrichedContext?: {
    movieReferences?: string[];
    excludedReadBooks?: number;
    fallback?: boolean;
  };
}

export function useNaturalSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    progress: 'idle',
    error: null
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], error: null, progress: 'idle' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      query,
      progress: 'analyzing',
      results: [] // Clear previous results
    }));

    try {
      // Simulate progress updates
      setTimeout(() => {
        setState(prev => prev.loading ? { ...prev, progress: 'finding' } : prev);
      }, 500);

      const response = await fetch('/api/search/natural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId: 'user-1' // TODO: Get from auth context
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed (${response.status})`);
      }

      const data = await response.json();

      // Update progress to ranking
      setState(prev => ({ ...prev, progress: 'ranking' }));

      // Small delay to show ranking state
      await new Promise(resolve => setTimeout(resolve, 300));

      setState(prev => ({
        ...prev,
        results: data.results || [],
        loading: false,
        progress: 'complete',
        enrichedContext: {
          excludedReadBooks: data.enrichedContext?.excludedReadBooks,
          fallback: data.fallback,
          movieReferences: data.enrichedContext?.movieReferences
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
        loading: false,
        progress: 'idle',
        results: []
      }));
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ 
      query: '', 
      results: [], 
      loading: false, 
      error: null,
      progress: 'idle'
    });
  }, []);

  return {
    ...state,
    search,
    clearResults
  };
}
