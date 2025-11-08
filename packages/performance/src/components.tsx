/**
 * React components for performance monitoring
 */

import React, { useEffect } from 'react';
import { useWebVitals, usePerformanceMonitor } from './hooks';

export interface PerformanceProviderProps {
  children: React.ReactNode;
  /** Enable Web Vitals tracking */
  enableWebVitals?: boolean;
  /** Enable real-time monitoring */
  enableMonitoring?: boolean;
  /** Web Vitals endpoint */
  vitalsEndpoint?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Performance monitoring provider component
 * Wraps app and initializes performance tracking
 */
export function PerformanceProvider({
  children,
  enableWebVitals = true,
  enableMonitoring = false,
  vitalsEndpoint,
  debug = false,
}: PerformanceProviderProps) {
  // Initialize Web Vitals
  useWebVitals(
    enableWebVitals
      ? {
          debug,
          reportEndpoint: vitalsEndpoint,
        }
      : undefined
  );

  // Initialize real-time monitoring
  const { start, stop } = usePerformanceMonitor({ debug, interval: 5000 });

  useEffect(() => {
    if (enableMonitoring) {
      start();
    }

    return () => {
      if (enableMonitoring) {
        stop();
      }
    };
  }, [enableMonitoring, start, stop]);

  return <>{children}</>;
}

export interface PerformanceBadgeProps {
  /** Position on screen */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Show detailed metrics */
  showDetails?: boolean;
}

/**
 * Performance badge component
 * Shows real-time performance score in corner of screen
 */
export function PerformanceBadge({
  position = 'bottom-right',
  showDetails = false,
}: PerformanceBadgeProps) {
  const { metrics, score } = useWebVitals();
  const { snapshot, averageFPS } = usePerformanceMonitor({ interval: 2000 });

  const positionStyles = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#10b981'; // green
    if (s >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: showDetails ? '12px' : '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: showDetails ? '200px' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: showDetails ? '8px' : 0,
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: getScoreColor(score),
          }}
        />
        <span style={{ fontWeight: 'bold' }}>Score: {score.toFixed(0)}</span>
      </div>

      {showDetails && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          {metrics.LCP && <div>LCP: {metrics.LCP.toFixed(0)}ms</div>}
          {metrics.FID && <div>FID: {metrics.FID.toFixed(0)}ms</div>}
          {metrics.CLS && <div>CLS: {metrics.CLS.toFixed(3)}</div>}
          {snapshot && <div>FPS: {snapshot.fps}</div>}
          {averageFPS > 0 && <div>Avg FPS: {averageFPS}</div>}
        </div>
      )}
    </div>
  );
}
