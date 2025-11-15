/**
 * React hooks for performance monitoring
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import type { DependencyList } from 'react';
import { webVitals, WebVitalsMetrics, WebVitalsConfig } from './web-vitals';
import {
  performanceMonitor,
  PerformanceSnapshot,
  PerformanceMonitorConfig,
} from './performance-monitor';
import { bundleAnalyzer, BundleStats } from './bundle-analyzer';

/**
 * Hook for tracking Web Vitals
 */
export function useWebVitals(config?: WebVitalsConfig) {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>(webVitals.getMetrics());
  const [score, setScore] = useState<number>(0);
  const configRef = useRef<WebVitalsConfig | undefined>(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const mergedConfig = configRef.current;
    // Initialize tracking with callback
    webVitals.init({
      ...mergedConfig,
      onReport: (updatedMetrics) => {
        setMetrics((prev: WebVitalsMetrics) => ({ ...prev, ...updatedMetrics }));
        setScore(webVitals.getScore());
        mergedConfig?.onReport?.(updatedMetrics);
      },
    });

    // Get initial state
    setMetrics(webVitals.getMetrics());
    setScore(webVitals.getScore());
  }, []);

  return { metrics, score };
}

/**
 * Hook for real-time performance monitoring
 */
export function usePerformanceMonitor(config?: PerformanceMonitorConfig) {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
  const [averageFPS, setAverageFPS] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const start = useCallback(() => {
    performanceMonitor.start({
      ...config,
      onSnapshot: (snap) => {
        setSnapshot(snap);
        setAverageFPS(performanceMonitor.getAverageFPS());
        config?.onSnapshot?.(snap);
      },
    });
    setIsMonitoring(true);
  }, [config]);

  const stop = useCallback(() => {
    performanceMonitor.stop();
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    return () => {
      if (performanceMonitor.isRunning()) {
        performanceMonitor.stop();
      }
    };
  }, []);

  return {
    snapshot,
    averageFPS,
    isMonitoring,
    start,
    stop,
  };
}

/**
 * Hook for bundle analysis
 */
export function useBundleAnalyzer() {
  const [stats, setStats] = useState<BundleStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await bundleAnalyzer.analyze();
      setStats(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    analyze,
  };
}

/**
 * Hook for measuring component render time
 */
export function useRenderTime(componentName: string, debug = false) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now() - startTime.current;

    if (debug) {
      console.log(`[RenderTime] ${componentName} - Render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    // Mark in Performance timeline
    performance.mark(`${componentName}-render-${renderCount.current}`);

    startTime.current = performance.now();
  });

  return renderCount.current;
}

/**
 * Hook for tracking long tasks (> 50ms)
 */
export function useLongTaskDetector(threshold = 50) {
  const [longTasks, setLongTasks] = useState<PerformanceEntry[]>([]);

  useEffect(() => {
    // Check if PerformanceObserver is available
    if (typeof PerformanceObserver === 'undefined') {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const filteredEntries = entries.filter((entry) => entry.duration > threshold);

      if (filteredEntries.length > 0) {
        setLongTasks((prev: PerformanceEntry[]) => [...prev, ...filteredEntries].slice(-20)); // Keep last 20
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // longtask not supported
      console.warn('Long task monitoring not supported', error);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return longTasks;
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(new Error('Failed to load image'));
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, isLoading, error };
}

/**
 * Hook for measuring fetch performance
 */
export function useFetchPerformance<T>(
  fetcher: () => Promise<T>,
  dependencies: DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const startTime = performance.now();

      try {
        const result = await fetcher();

        if (!cancelled) {
          const endTime = performance.now();
          setDuration(endTime - startTime);
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [fetcher, dependencies]);

  return { data, loading, error, duration };
}
