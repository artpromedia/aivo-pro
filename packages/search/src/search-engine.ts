/**
 * Advanced Search Engine with Fuzzy Matching
 */

import Fuse, { IFuseOptions } from 'fuse.js';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export interface SearchOptions<T> {
  keys?: Array<keyof T | string>;
  threshold?: number;
  includeScore?: boolean;
  minMatchCharLength?: number;
  ignoreLocation?: boolean;
}

export interface FilterConfig<T> {
  field: keyof T | string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
  value: unknown;
}

export interface DateRangeFilter {
  start: Date | string;
  end: Date | string;
}

/**
 * Advanced search engine with fuzzy matching
 */
export class SearchEngine<T> {
  private fuse: Fuse<T> | null = null;
  private data: T[] = [];

  constructor(data: T[], options?: SearchOptions<T>) {
    this.data = data;
    
    const defaultOptions: IFuseOptions<T> = {
      keys: options?.keys as string[] || [],
      threshold: options?.threshold || 0.3,
      includeScore: options?.includeScore ?? true,
      minMatchCharLength: options?.minMatchCharLength || 2,
      ignoreLocation: options?.ignoreLocation ?? true,
    };

    this.fuse = new Fuse(data, defaultOptions);
  }

  /**
   * Perform fuzzy search
   */
  search(query: string): T[] {
    if (!this.fuse || !query) return this.data;

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  /**
   * Apply filters to data
   */
  filter(filters: FilterConfig<T>[]): T[] {
    let filtered = [...this.data];

    filters.forEach(filter => {
      filtered = filtered.filter(item => {
        const value = this.getNestedValue(item, filter.field as string);
        return this.applyOperator(value, filter.operator, filter.value);
      });
    });

    return filtered;
  }

  /**
   * Search and filter combined
   */
  searchAndFilter(query: string, filters: FilterConfig<T>[]): T[] {
    const searched = query ? this.search(query) : this.data;
    
    if (filters.length === 0) return searched;

    return searched.filter(item => {
      return filters.every(filter => {
        const value = this.getNestedValue(item, filter.field as string);
        return this.applyOperator(value, filter.operator, filter.value);
      });
    });
  }

  /**
   * Sort results
   */
  sort(
    data: T[],
    field: keyof T | string,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, field as string);
      const bValue = this.getNestedValue(b, field as string);
      const comparison = this.compareValues(aValue, bValue);

      if (comparison === null) return 0;
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Paginate results
   */
  paginate(data: T[], page: number, pageSize: number): {
    data: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  } {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: data.slice(start, end),
      page,
      pageSize,
      totalPages,
      totalItems,
    };
  }

  /**
   * Filter by date range
   */
  filterByDateRange(
    data: T[],
    dateField: keyof T | string,
    range: DateRangeFilter
  ): T[] {
  const startDate: Date = typeof range.start === 'string' ? parseISO(range.start) : range.start;
  const endDate: Date = typeof range.end === 'string' ? parseISO(range.end) : range.end;

    return data.filter(item => {
      const dateValue = this.getNestedValue(item, dateField as string);
      
      if (!dateValue) return false;

      const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
      if (!(date instanceof Date)) {
        return false;
      }
      
      return isWithinInterval(date, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
    });
  }

  /**
   * Get facets for filtering
   */
  getFacets(field: keyof T | string): Map<unknown, number> {
    const facets = new Map<unknown, number>();

    this.data.forEach(item => {
      const value = this.getNestedValue(item, field as string);
      if (value !== undefined && value !== null) {
        facets.set(value, (facets.get(value) || 0) + 1);
      }
    });

    return facets;
  }

  /**
   * Update data source
   */
  updateData(data: T[]): void {
    this.data = data;
    if (this.fuse) {
      this.fuse.setCollection(data);
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(source: unknown, path: string): unknown {
    if (!path) return source;

    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object') {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, source);
  }

  /**
   * Apply filter operator
   */
  private applyOperator(
    value: unknown,
    operator: FilterConfig<T>['operator'],
    filterValue: unknown
  ): boolean {
    switch (operator) {
      case 'equals':
        return value === filterValue;
      
      case 'contains':
        return this.matchesStringOperation(value, filterValue, 'includes');
      
      case 'startsWith':
        return this.matchesStringOperation(value, filterValue, 'startsWith');
      
      case 'endsWith':
        return this.matchesStringOperation(value, filterValue, 'endsWith');
      
      case 'gt':
        return this.compareWithFilter(value, filterValue, comparison => comparison > 0);
      
      case 'lt':
        return this.compareWithFilter(value, filterValue, comparison => comparison < 0);
      
      case 'gte':
        return this.compareWithFilter(value, filterValue, comparison => comparison >= 0);
      
      case 'lte':
        return this.compareWithFilter(value, filterValue, comparison => comparison <= 0);
      
      case 'in':
        return Array.isArray(filterValue) && filterValue.some(item => item === value);
      
      case 'between': {
        if (!Array.isArray(filterValue) || filterValue.length !== 2) {
          return false;
        }

        const [start, end] = filterValue;
        return (
          this.compareWithFilter(value, start, comparison => comparison >= 0) &&
          this.compareWithFilter(value, end, comparison => comparison <= 0)
        );
      }
      
      default:
        return true;
    }
  }

  private matchesStringOperation(
    value: unknown,
    filterValue: unknown,
    comparator: 'includes' | 'startsWith' | 'endsWith'
  ): boolean {
    const target = this.toLowerCaseString(value);
    const filter = this.toLowerCaseString(filterValue);

    if (target === null || filter === null) {
      return false;
    }

    switch (comparator) {
      case 'includes':
        return target.includes(filter);
      case 'startsWith':
        return target.startsWith(filter);
      case 'endsWith':
        return target.endsWith(filter);
      default:
        return false;
    }
  }

  private toLowerCaseString(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    return String(value).toLowerCase();
  }

  private compareWithFilter(
    value: unknown,
    filterValue: unknown,
    predicate: (comparison: number) => boolean
  ): boolean {
    const comparison = this.compareValues(value, filterValue);
    return comparison !== null && predicate(comparison);
  }

  private compareValues(a: unknown, b: unknown): number | null {
    const normalizedA = this.normalizeComparable(a);
    const normalizedB = this.normalizeComparable(b);

    if (normalizedA === null || normalizedB === null) {
      return null;
    }

    if (typeof normalizedA === 'string' && typeof normalizedB === 'string') {
      return normalizedA.localeCompare(normalizedB);
    }

    const numericA = normalizedA instanceof Date ? normalizedA.getTime() : normalizedA;
    const numericB = normalizedB instanceof Date ? normalizedB.getTime() : normalizedB;

    if (typeof numericA === 'number' && typeof numericB === 'number') {
      if (numericA === numericB) return 0;
      return numericA > numericB ? 1 : -1;
    }

    return null;
  }

  private normalizeComparable(value: unknown): string | number | Date | null {
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }

    if (value instanceof Date) {
      return value;
    }

    return null;
  }
}

/**
 * Create a search engine instance
 */
export function createSearchEngine<T>(
  data: T[],
  options?: SearchOptions<T>
): SearchEngine<T> {
  return new SearchEngine(data, options);
}

/**
 * Simple fuzzy search function
 */
export function fuzzySearch<T>(
  data: T[],
  query: string,
  keys: Array<keyof T | string>
): T[] {
  const engine = createSearchEngine(data, { keys });
  return engine.search(query);
}

/**
 * Highlight matches in text
 */
export function highlightMatches(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Get search suggestions
 */
export function getSearchSuggestions<T>(
  data: T[],
  field: keyof T | string,
  query: string,
  limit = 5
): string[] {
  const engine = createSearchEngine(data, { keys: [field as string] });
  const results = engine.search(query);
  
  return results
    .slice(0, limit)
    .map(item => {
      const value = (item as Record<string, unknown>)[field as string];
      return String(value ?? '');
    })
    .filter((value, index, self) => value.trim().length > 0 && self.indexOf(value) === index);
}
