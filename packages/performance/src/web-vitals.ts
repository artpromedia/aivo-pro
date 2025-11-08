/**
 * Core Web Vitals metrics tracking
 * Monitors LCP, FID, CLS, TTFB, and FCP
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, Metric } from 'web-vitals';

export interface WebVitalsMetrics {
  CLS: number | null;
  FCP: number | null;
  FID: number | null;
  LCP: number | null;
  TTFB: number | null;
}

export interface VitalsReportCallback {
  (metrics: Partial<WebVitalsMetrics>): void;
}

export interface WebVitalsConfig {
  /** Enable console logging */
  debug?: boolean;
  /** Custom report callback */
  onReport?: VitalsReportCallback;
  /** Report to analytics endpoint */
  reportEndpoint?: string;
}

class WebVitalsTracker {
  private metrics: WebVitalsMetrics = {
    CLS: null,
    FCP: null,
    FID: null,
    LCP: null,
    TTFB: null,
  };

  private config: WebVitalsConfig = {
    debug: false,
  };

  private initialized = false;

  /**
   * Initialize Web Vitals tracking
   */
  init(config?: WebVitalsConfig): void {
    if (this.initialized) {
      console.warn('WebVitalsTracker already initialized');
      return;
    }

    this.config = { ...this.config, ...config };
    this.initialized = true;

    // Track Cumulative Layout Shift
    onCLS(this.handleMetric('CLS'));

    // Track First Contentful Paint
    onFCP(this.handleMetric('FCP'));

    // Track First Input Delay
    onFID(this.handleMetric('FID'));

    // Track Largest Contentful Paint
    onLCP(this.handleMetric('LCP'));

    // Track Time to First Byte
    onTTFB(this.handleMetric('TTFB'));

    if (this.config.debug) {
      console.log('[WebVitals] Tracking initialized');
    }
  }

  /**
   * Handle individual metric updates
   */
  private handleMetric(name: keyof WebVitalsMetrics) {
    return (metric: Metric) => {
      const value = metric.value;
      this.metrics[name] = value;

      if (this.config.debug) {
        const rating = metric.rating;
        console.log(`[WebVitals] ${name}:`, {
          value: `${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}`,
          rating,
          delta: metric.delta,
        });
      }

      // Report to callback
      if (this.config.onReport) {
        this.config.onReport({ [name]: value });
      }

      // Report to analytics endpoint
      if (this.config.reportEndpoint) {
        this.reportToEndpoint(name, metric);
      }
    };
  }

  /**
   * Report metric to analytics endpoint
   */
  private async reportToEndpoint(name: string, metric: Metric): Promise<void> {
    if (!this.config.reportEndpoint) return;

    try {
      const body = JSON.stringify({
        name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      // Use sendBeacon if available (better for page unload)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.reportEndpoint, body);
      } else {
        await fetch(this.config.reportEndpoint, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WebVitals] Failed to report metric:', error);
      }
    }
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance score (0-100)
   */
  getScore(): number {
    const scores: number[] = [];

    // LCP: Good < 2500ms, Needs improvement < 4000ms, Poor >= 4000ms
    if (this.metrics.LCP !== null) {
      if (this.metrics.LCP < 2500) scores.push(100);
      else if (this.metrics.LCP < 4000) scores.push(50);
      else scores.push(0);
    }

    // FID: Good < 100ms, Needs improvement < 300ms, Poor >= 300ms
    if (this.metrics.FID !== null) {
      if (this.metrics.FID < 100) scores.push(100);
      else if (this.metrics.FID < 300) scores.push(50);
      else scores.push(0);
    }

    // CLS: Good < 0.1, Needs improvement < 0.25, Poor >= 0.25
    if (this.metrics.CLS !== null) {
      if (this.metrics.CLS < 0.1) scores.push(100);
      else if (this.metrics.CLS < 0.25) scores.push(50);
      else scores.push(0);
    }

    // FCP: Good < 1800ms, Needs improvement < 3000ms, Poor >= 3000ms
    if (this.metrics.FCP !== null) {
      if (this.metrics.FCP < 1800) scores.push(100);
      else if (this.metrics.FCP < 3000) scores.push(50);
      else scores.push(0);
    }

    // TTFB: Good < 800ms, Needs improvement < 1800ms, Poor >= 1800ms
    if (this.metrics.TTFB !== null) {
      if (this.metrics.TTFB < 800) scores.push(100);
      else if (this.metrics.TTFB < 1800) scores.push(50);
      else scores.push(0);
    }

    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  /**
   * Reset tracker
   */
  reset(): void {
    this.metrics = {
      CLS: null,
      FCP: null,
      FID: null,
      LCP: null,
      TTFB: null,
    };
    this.initialized = false;
  }
}

// Singleton instance
export const webVitals = new WebVitalsTracker();

/**
 * Initialize Web Vitals tracking (convenience function)
 */
export function initWebVitals(config?: WebVitalsConfig): void {
  webVitals.init(config);
}

/**
 * Get current Web Vitals metrics
 */
export function getWebVitals(): WebVitalsMetrics {
  return webVitals.getMetrics();
}

/**
 * Get performance score
 */
export function getPerformanceScore(): number {
  return webVitals.getScore();
}
