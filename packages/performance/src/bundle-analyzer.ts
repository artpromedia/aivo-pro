/**
 * Bundle size analyzer and monitoring
 */

export interface BundleStats {
  totalSize: number;
  gzipSize: number;
  files: Array<{
    name: string;
    size: number;
    type: 'js' | 'css' | 'asset';
  }>;
}

export interface BundleThresholds {
  maxTotalSize?: number; // bytes
  maxJsSize?: number;
  maxCssSize?: number;
}

class BundleAnalyzer {
  private stats: BundleStats | null = null;
  private thresholds: BundleThresholds = {
    maxTotalSize: 500 * 1024, // 500KB
    maxJsSize: 300 * 1024, // 300KB
    maxCssSize: 100 * 1024, // 100KB
  };

  /**
   * Analyze current bundle using Performance API
   */
  async analyze(): Promise<BundleStats> {
    if (typeof window === 'undefined' || !window.performance) {
      throw new Error('Performance API not available');
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const files: BundleStats['files'] = [];
    let totalSize = 0;

    for (const resource of resources) {
      const size = resource.transferSize || 0;
      const name = this.getResourceName(resource.name);
      const type = this.getResourceType(resource.name);

      if (type) {
        files.push({ name, size, type });
        totalSize += size;
      }
    }

    // Estimate gzip size (typically 70% compression)
    const gzipSize = Math.round(totalSize * 0.3);

    this.stats = {
      totalSize,
      gzipSize,
      files: files.sort((a, b) => b.size - a.size),
    };

    return this.stats;
  }

  /**
   * Get resource name from URL
   */
  private getResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || pathname;
    } catch {
      return url;
    }
  }

  /**
   * Determine resource type from URL
   */
  private getResourceType(url: string): 'js' | 'css' | 'asset' | null {
    if (url.endsWith('.js') || url.includes('.js?')) return 'js';
    if (url.endsWith('.css') || url.includes('.css?')) return 'css';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)/)) return 'asset';
    return null;
  }

  /**
   * Check if bundle exceeds thresholds
   */
  checkThresholds(customThresholds?: BundleThresholds): {
    passed: boolean;
    violations: string[];
  } {
    if (!this.stats) {
      throw new Error('Must call analyze() first');
    }

    const thresholds = { ...this.thresholds, ...customThresholds };
    const violations: string[] = [];

    // Check total size
    if (thresholds.maxTotalSize && this.stats.totalSize > thresholds.maxTotalSize) {
      violations.push(
        `Total bundle size (${this.formatBytes(this.stats.totalSize)}) exceeds threshold (${this.formatBytes(thresholds.maxTotalSize)})`
      );
    }

    // Check JS size
    if (thresholds.maxJsSize) {
      const jsSize = this.stats.files
        .filter((f) => f.type === 'js')
        .reduce((sum, f) => sum + f.size, 0);

      if (jsSize > thresholds.maxJsSize) {
        violations.push(
          `JavaScript size (${this.formatBytes(jsSize)}) exceeds threshold (${this.formatBytes(thresholds.maxJsSize)})`
        );
      }
    }

    // Check CSS size
    if (thresholds.maxCssSize) {
      const cssSize = this.stats.files
        .filter((f) => f.type === 'css')
        .reduce((sum, f) => sum + f.size, 0);

      if (cssSize > thresholds.maxCssSize) {
        violations.push(
          `CSS size (${this.formatBytes(cssSize)}) exceeds threshold (${this.formatBytes(thresholds.maxCssSize)})`
        );
      }
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Get current stats
   */
  getStats(): BundleStats | null {
    return this.stats;
  }

  /**
   * Generate bundle report
   */
  generateReport(): string {
    if (!this.stats) {
      return 'No bundle stats available. Call analyze() first.';
    }

    const lines = [
      '=== Bundle Analysis Report ===',
      `Total Size: ${this.formatBytes(this.stats.totalSize)}`,
      `Estimated Gzip: ${this.formatBytes(this.stats.gzipSize)}`,
      '',
      'Files by Size:',
    ];

    this.stats.files.slice(0, 10).forEach((file, i) => {
      lines.push(`${i + 1}. ${file.name} (${this.formatBytes(file.size)}) [${file.type}]`);
    });

    if (this.stats.files.length > 10) {
      lines.push(`... and ${this.stats.files.length - 10} more files`);
    }

    return lines.join('\n');
  }
}

// Singleton instance
export const bundleAnalyzer = new BundleAnalyzer();

/**
 * Analyze current bundle (convenience function)
 */
export async function analyzeBundle(): Promise<BundleStats> {
  return bundleAnalyzer.analyze();
}

/**
 * Check bundle thresholds
 */
export function checkBundleThresholds(thresholds?: BundleThresholds) {
  return bundleAnalyzer.checkThresholds(thresholds);
}
