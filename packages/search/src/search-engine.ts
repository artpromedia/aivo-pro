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
  value: any;
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

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
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
    const start = typeof range.start === 'string' ? parseISO(range.start) : range.start;
    const end = typeof range.end === 'string' ? parseISO(range.end) : range.end;

    return data.filter(item => {
      const dateValue = this.getNestedValue(item, dateField as string);
      
      if (!dateValue) return false;

      const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
      
      return isWithinInterval(date, {
        start: startOfDay(start),
        end: endOfDay(end),
      });
    });
  }

  /**
   * Get facets for filtering
   */
  getFacets(field: keyof T | string): Map<any, number> {
    const facets = new Map<any, number>();

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
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Apply filter operator
   */
  private applyOperator(value: any, operator: string, filterValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === filterValue;
      
      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      
      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
      
      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
      
      case 'gt':
        return value > filterValue;
      
      case 'lt':
        return value < filterValue;
      
      case 'gte':
        return value >= filterValue;
      
      case 'lte':
        return value <= filterValue;
      
      case 'in':
        return Array.isArray(filterValue) && filterValue.includes(value);
      
      case 'between':
        return Array.isArray(filterValue) && 
               value >= filterValue[0] && 
               value <= filterValue[1];
      
      default:
        return true;
    }
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
      const value = String((item as any)[field]);
      return value;
    })
    .filter((value, index, self) => self.indexOf(value) === index);
}
