/**
 * React Hooks for Search
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { SearchEngine, FilterConfig, SearchOptions } from './search-engine';

export interface UseSearchOptions<T> extends SearchOptions<T> {
  debounce?: number;
}

/**
 * Hook for search functionality
 */
export function useSearch<T>(
  data: T[],
  options?: UseSearchOptions<T>
) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterConfig<T>[]>([]);
  const [sortField, setSortField] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const searchEngine = useMemo(
    () => new SearchEngine(data, options),
    [data, options]
  );

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, options?.debounce || 300);

    return () => clearTimeout(timer);
  }, [query, options?.debounce]);

  // Search and filter results
  const results = useMemo(() => {
    let filtered = searchEngine.searchAndFilter(debouncedQuery, filters);

    if (sortField) {
      filtered = searchEngine.sort(filtered, sortField, sortDirection);
    }

    return filtered;
  }, [searchEngine, debouncedQuery, filters, sortField, sortDirection]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    return searchEngine.paginate(results, page, pageSize);
  }, [searchEngine, results, page, pageSize]);

  const addFilter = useCallback((filter: FilterConfig<T>) => {
    setFilters(prev => [...prev, filter]);
    setPage(1); // Reset to first page
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setPage(1);
  }, []);

  const updateSort = useCallback((field: keyof T | string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  }, [sortField]);

  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection('asc');
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setFilters([]);
    setSortField(null);
    setSortDirection('asc');
    setPage(1);
  }, []);

  return {
    // State
    query,
    filters,
    sortField,
    sortDirection,
    page,
    pageSize,

    // Results
    results: paginatedResults.data,
    totalResults: results.length,
    totalPages: paginatedResults.totalPages,
    hasResults: results.length > 0,

    // Actions
    setQuery,
    setPage,
    setPageSize,
    addFilter,
    removeFilter,
    clearFilters,
    updateSort,
    clearSort,
    reset,
  };
}

/**
 * Hook for faceted search
 */
export function useFacets<T>(
  data: T[],
  fields: Array<keyof T | string>
) {
  const searchEngine = useMemo(
    () => new SearchEngine(data),
    [data]
  );

  const facets = useMemo(() => {
    const result: Record<string, Map<unknown, number>> = {};
    
    fields.forEach(field => {
      result[field as string] = searchEngine.getFacets(field);
    });

    return result;
  }, [searchEngine, fields]);

  return facets;
}

/**
 * Hook for search suggestions
 */
export function useSearchSuggestions<T>(
  data: T[],
  field: keyof T | string,
  query: string,
  limit = 5
) {
  const searchEngine = useMemo(
    () => new SearchEngine(data, { keys: [field as string] }),
    [data, field]
  );

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];

    const results = searchEngine.search(query);
    return results
      .slice(0, limit)
      .map(item => {
        const value = (item as Record<string, unknown>)[field as string];
        return String(value ?? '');
      })
    .filter((value, index, self) => value.trim().length > 0 && self.indexOf(value) === index);
  }, [searchEngine, query, field, limit]);

  return suggestions;
}

/**
 * Hook for search history
 */
export function useSearchHistory(maxHistory = 10) {
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setHistory(prev => {
      const updated = [query, ...prev.filter(q => q !== query)];
      return updated.slice(0, maxHistory);
    });
  }, [maxHistory]);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => prev.filter(q => q !== query));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
