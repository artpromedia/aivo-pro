/**
 * Performance Monitoring Demo Page
 * Demonstrates Web Vitals tracking, bundle analysis, and real-time performance monitoring
 */

import React, { useState } from 'react';
import {
  useWebVitals,
  usePerformanceMonitor,
  useBundleAnalyzer,
  useRenderTime,
  useLongTaskDetector,
  PerformanceBadge,
} from '@aivo/performance';
import { Activity, Gauge, FileText, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export default function PerformanceDemo() {
  const [showBadge, setShowBadge] = useState(true);
  const [badgeDetails, setBadgeDetails] = useState(false);

  // Web Vitals tracking
  const { metrics, score } = useWebVitals({ debug: true });

  // Real-time performance monitoring
  const { snapshot, averageFPS, isMonitoring, start, stop } = usePerformanceMonitor({
    interval: 2000,
    trackFPS: true,
    trackMemory: true,
    debug: true,
  });

  // Bundle analysis
  const { stats, loading: bundleLoading, analyze } = useBundleAnalyzer();

  // Long task detection
  const longTasks = useLongTaskDetector(50);

  // Render time tracking
  useRenderTime('PerformanceDemo', true);

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (s: number) => {
    if (s >= 90) return 'bg-green-100';
    if (s >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Badge */}
      {showBadge && (
        <PerformanceBadge position="bottom-right" showDetails={badgeDetails} />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Performance Monitoring</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Track Web Vitals, bundle sizes, FPS, memory usage, and more
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Controls
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={isMonitoring ? stop : start}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
            <button
              onClick={analyze}
              disabled={bundleLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {bundleLoading ? 'Analyzing...' : 'Analyze Bundle'}
            </button>
            <button
              onClick={() => setShowBadge(!showBadge)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              {showBadge ? 'Hide Badge' : 'Show Badge'}
            </button>
            <button
              onClick={() => setBadgeDetails(!badgeDetails)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              disabled={!showBadge}
            >
              {badgeDetails ? 'Simple Badge' : 'Detailed Badge'}
            </button>
          </div>
        </div>

        {/* Web Vitals Score */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-600" />
            Performance Score
          </h2>
          <div className="flex items-center gap-4">
            <div
              className={`text-6xl font-bold ${getScoreColor(score)} ${getScoreBg(score)} rounded-full w-32 h-32 flex items-center justify-center`}
            >
              {score.toFixed(0)}
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-2">
                Overall performance score based on Web Vitals metrics
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    score >= 90 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Web Vitals Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Core Web Vitals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              title="LCP"
              subtitle="Largest Contentful Paint"
              value={metrics.LCP}
              unit="ms"
              threshold={[2500, 4000]}
            />
            <MetricCard
              title="FID"
              subtitle="First Input Delay"
              value={metrics.FID}
              unit="ms"
              threshold={[100, 300]}
            />
            <MetricCard
              title="CLS"
              subtitle="Cumulative Layout Shift"
              value={metrics.CLS}
              unit=""
              threshold={[0.1, 0.25]}
              decimals={3}
            />
            <MetricCard
              title="FCP"
              subtitle="First Contentful Paint"
              value={metrics.FCP}
              unit="ms"
              threshold={[1800, 3000]}
            />
            <MetricCard
              title="TTFB"
              subtitle="Time to First Byte"
              value={metrics.TTFB}
              unit="ms"
              threshold={[800, 1800]}
            />
          </div>
        </div>

        {/* Real-time Monitoring */}
        {isMonitoring && snapshot && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Real-time Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Current FPS</div>
                <div className="text-3xl font-bold text-blue-600">{snapshot.fps}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Average FPS</div>
                <div className="text-3xl font-bold text-green-600">{averageFPS}</div>
              </div>
              {snapshot.memory && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">JS Heap Used</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatMemory(snapshot.memory.usedJSHeapSize)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Heap Limit</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatMemory(snapshot.memory.jsHeapSizeLimit)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bundle Analysis */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Bundle Analysis
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Size</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {formatBytes(stats.totalSize)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Estimated Gzip</div>
                  <div className="text-3xl font-bold text-cyan-600">
                    {formatBytes(stats.gzipSize)}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Largest Files</h3>
                <div className="space-y-2">
                  {stats.files.slice(0, 10).map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-500">{i + 1}</span>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            file.type === 'js'
                              ? 'bg-yellow-100 text-yellow-800'
                              : file.type === 'css'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {file.type}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-gray-700">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Long Tasks */}
        {longTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Long Tasks ({">"} 50ms)
            </h2>
            <div className="space-y-2">
              {longTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-yellow-50 rounded px-3 py-2"
                >
                  <span className="text-sm font-medium text-gray-900">{task.name}</span>
                  <span className="text-sm font-mono text-yellow-700">
                    {task.duration.toFixed(2)}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for metric cards
interface MetricCardProps {
  title: string;
  subtitle: string;
  value: number | null;
  unit: string;
  threshold: [number, number]; // [good, needsImprovement]
  decimals?: number;
}

function MetricCard({
  title,
  subtitle,
  value,
  unit,
  threshold,
  decimals = 0,
}: MetricCardProps) {
  const getRating = () => {
    if (value === null) return 'pending';
    if (value < threshold[0]) return 'good';
    if (value < threshold[1]) return 'needs-improvement';
    return 'poor';
  };

  const rating = getRating();

  const colorClasses = {
    good: 'from-green-50 to-green-100 text-green-700',
    'needs-improvement': 'from-yellow-50 to-yellow-100 text-yellow-700',
    poor: 'from-red-50 to-red-100 text-red-700',
    pending: 'from-gray-50 to-gray-100 text-gray-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[rating]} rounded-lg p-4`}>
      <div className="text-xs font-medium opacity-80 mb-1">{subtitle}</div>
      <div className="text-2xl font-bold mb-1">
        {value !== null ? value.toFixed(decimals) + unit : '—'}
      </div>
      <div className="text-lg font-semibold">{title}</div>
    </div>
  );
}
