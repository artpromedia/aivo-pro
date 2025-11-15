/**
 * Real-time performance monitoring
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  memory: MemoryInfo | null;
  fps: number;
  metrics: PerformanceMetric[];
}

export interface PerformanceMonitorConfig {
  /** Sampling interval in ms */
  interval?: number;
  /** Enable FPS monitoring */
  trackFPS?: boolean;
  /** Enable memory monitoring */
  trackMemory?: boolean;
  /** Enable console logging */
  debug?: boolean;
  /** Callback for performance snapshots */
  onSnapshot?: (snapshot: PerformanceSnapshot) => void;
}

type PerformanceWithMemory = Performance & {
  memory: MemoryInfo;
};

function hasMemory(perf: Performance): perf is PerformanceWithMemory {
  return 'memory' in perf && perf.memory != null;
}

class PerformanceMonitor {
  private config: PerformanceMonitorConfig = {
    interval: 5000, // 5 seconds
    trackFPS: true,
    trackMemory: true,
    debug: false,
  };

  private intervalId: number | null = null;
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private currentFPS = 0;
  private rafId: number | null = null;
  private snapshots: PerformanceSnapshot[] = [];

  /**
   * Start monitoring
   */
  start(config?: PerformanceMonitorConfig): void {
    if (this.intervalId !== null) {
      console.warn('[PerformanceMonitor] Already running');
      return;
    }

    this.config = { ...this.config, ...config };

    // Start FPS tracking
    if (this.config.trackFPS) {
      this.startFPSTracking();
    }

    // Start periodic snapshots
    this.intervalId = window.setInterval(() => {
      this.takeSnapshot();
    }, this.config.interval);

    if (this.config.debug) {
      console.log('[PerformanceMonitor] Started monitoring');
    }
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.config.debug) {
      console.log('[PerformanceMonitor] Stopped monitoring');
    }
  }

  /**
   * Start FPS tracking using requestAnimationFrame
   */
  private startFPSTracking(): void {
    const measureFPS = (currentTime: number) => {
      this.frameCount++;

      const elapsed = currentTime - this.lastFrameTime;
      if (elapsed >= 1000) {
        // Calculate FPS over the last second
        this.currentFPS = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }

      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);
  }

  /**
   * Take a performance snapshot
   */
  private takeSnapshot(): void {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      memory: this.getMemoryInfo(),
      fps: this.currentFPS,
      metrics: this.collectMetrics(),
    };

    this.snapshots.push(snapshot);

    // Keep only last 100 snapshots
    if (this.snapshots.length > 100) {
      this.snapshots.shift();
    }

    if (this.config.debug) {
      console.log('[PerformanceMonitor] Snapshot:', snapshot);
    }

    if (this.config.onSnapshot) {
      this.config.onSnapshot(snapshot);
    }
  }

  /**
   * Get memory information
   */
  private getMemoryInfo(): MemoryInfo | null {
    if (!this.config.trackMemory) return null;

    // Check if memory API is available (Chrome only)
    if (hasMemory(performance)) {
      const memory = performance.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }

    return null;
  }

  /**
   * Collect performance metrics
   */
  private collectMetrics(): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];
    const now = Date.now();

    // Navigation timing
    if (performance.timing) {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;

      metrics.push({
        name: 'domContentLoaded',
        value: timing.domContentLoadedEventEnd - navigationStart,
        unit: 'ms',
        timestamp: now,
      });

      metrics.push({
        name: 'domComplete',
        value: timing.domComplete - navigationStart,
        unit: 'ms',
        timestamp: now,
      });

      metrics.push({
        name: 'loadComplete',
        value: timing.loadEventEnd - navigationStart,
        unit: 'ms',
        timestamp: now,
      });
    }

    return metrics;
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get latest snapshot
   */
  getLatestSnapshot(): PerformanceSnapshot | null {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  /**
   * Clear snapshots
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Get average FPS
   */
  getAverageFPS(): number {
    if (this.snapshots.length === 0) return 0;
    const sum = this.snapshots.reduce((acc, s) => acc + s.fps, 0);
    return Math.round(sum / this.snapshots.length);
  }

  /**
   * Check if running
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Start performance monitoring (convenience function)
 */
export function startPerformanceMonitoring(config?: PerformanceMonitorConfig): void {
  performanceMonitor.start(config);
}

/**
 * Stop performance monitoring
 */
export function stopPerformanceMonitoring(): void {
  performanceMonitor.stop();
}

/**
 * Get performance snapshots
 */
export function getPerformanceSnapshots(): PerformanceSnapshot[] {
  return performanceMonitor.getSnapshots();
}
