import { useState, useEffect, useCallback, useRef } from 'react';

export interface FocusMetrics {
  isActive: boolean;
  focusScore: number; // 0-100 scale
  timeSpentFocused: number; // in seconds
  totalTimeSpent: number; // in seconds
  distractionCount: number;
  lastActivity: number; // timestamp
  needsBreak: boolean;
}

export interface FocusTrackingOptions {
  inactivityThreshold: number; // ms before considering user inactive
  lowFocusThreshold: number; // focus score below which triggers break
  breakInterval: number; // ms between mandatory breaks
  trackMouseMovement: boolean;
  trackKeystrokes: boolean;
  trackScrolling: boolean;
}

const DEFAULT_OPTIONS: FocusTrackingOptions = {
  inactivityThreshold: 30000, // 30 seconds
  lowFocusThreshold: 40, // 40% focus score
  breakInterval: 1200000, // 20 minutes
  trackMouseMovement: true,
  trackKeystrokes: true,
  trackScrolling: true,
};

export const useFocusTracking = (options: Partial<FocusTrackingOptions> = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [metrics, setMetrics] = useState<FocusMetrics>({
    isActive: true,
    focusScore: 100,
    timeSpentFocused: 0,
    totalTimeSpent: 0,
    distractionCount: 0,
    lastActivity: Date.now(),
    needsBreak: false,
  });

  const activityRef = useRef({
    mouseMovements: 0,
    keystrokes: 0,
    scrolls: 0,
    clicks: 0,
    windowFocus: true,
  });

  const timersRef = useRef({
    activityTimer: null as NodeJS.Timeout | null,
    focusTimer: null as NodeJS.Timeout | null,
    breakTimer: null as NodeJS.Timeout | null,
  });

  const sessionStartRef = useRef(Date.now());

  // Reset activity counters
  const resetActivityCounters = useCallback(() => {
    activityRef.current = {
      mouseMovements: 0,
      keystrokes: 0,
      scrolls: 0,
      clicks: 0,
      windowFocus: document.hasFocus(),
    };
  }, []);

  // Calculate focus score based on activity patterns
  const calculateFocusScore = useCallback(() => {
    const activity = activityRef.current;
    const timeSinceLastActivity = Date.now() - metrics.lastActivity;
    
    let score = 100;

    // Reduce score based on inactivity
    if (timeSinceLastActivity > config.inactivityThreshold) {
      score -= Math.min(50, (timeSinceLastActivity - config.inactivityThreshold) / 1000);
    }

    // Reduce score if window is not focused
    if (!activity.windowFocus) {
      score -= 30;
    }

    // Boost score for consistent activity
    const totalActivity = activity.mouseMovements + activity.keystrokes + activity.scrolls + activity.clicks;
    if (totalActivity > 10 && totalActivity < 100) { // Goldilocks zone
      score += 10;
    } else if (totalActivity > 200) { // Too much activity might indicate distraction
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }, [config.inactivityThreshold, metrics.lastActivity]);

  // Update focus metrics
  const updateMetrics = useCallback(() => {
    const now = Date.now();
    const focusScore = calculateFocusScore();
    const totalTime = Math.floor((now - sessionStartRef.current) / 1000);
    const isActive = focusScore > config.lowFocusThreshold;

    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        isActive,
        focusScore,
        totalTimeSpent: totalTime,
        lastActivity: isActive ? now : prev.lastActivity,
        needsBreak: totalTime > 0 && totalTime % (config.breakInterval / 1000) < 5, // Need break every interval
      };

      // Update focused time
      if (isActive && prev.isActive) {
        newMetrics.timeSpentFocused = prev.timeSpentFocused + 1;
      }

      // Count distractions
      if (!isActive && prev.isActive) {
        newMetrics.distractionCount = prev.distractionCount + 1;
      }

      return newMetrics;
    });

    resetActivityCounters();
  }, [calculateFocusScore, config.lowFocusThreshold, config.breakInterval, resetActivityCounters]);

  // Activity event handlers
  const handleMouseMove = useCallback(() => {
    if (config.trackMouseMovement) {
      activityRef.current.mouseMovements++;
      setMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
    }
  }, [config.trackMouseMovement]);

  const handleKeyDown = useCallback(() => {
    if (config.trackKeystrokes) {
      activityRef.current.keystrokes++;
      setMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
    }
  }, [config.trackKeystrokes]);

  const handleScroll = useCallback(() => {
    if (config.trackScrolling) {
      activityRef.current.scrolls++;
      setMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
    }
  }, [config.trackScrolling]);

  const handleClick = useCallback(() => {
    activityRef.current.clicks++;
    setMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
  }, []);

  const handleWindowFocus = useCallback(() => {
    activityRef.current.windowFocus = true;
    setMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
  }, []);

  const handleWindowBlur = useCallback(() => {
    activityRef.current.windowFocus = false;
  }, []);

  // Start focus tracking
  const startTracking = useCallback(() => {
    sessionStartRef.current = Date.now();
    
    // Set up event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    // Set up timers
    timersRef.current.focusTimer = setInterval(updateMetrics, 1000); // Update every second
  }, [handleMouseMove, handleKeyDown, handleScroll, handleClick, handleWindowFocus, handleWindowBlur, updateMetrics]);

  // Stop focus tracking
  const stopTracking = useCallback(() => {
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClick);
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener('blur', handleWindowBlur);

    // Clear timers
    if (timersRef.current.focusTimer) {
      clearInterval(timersRef.current.focusTimer);
      timersRef.current.focusTimer = null;
    }
  }, [handleMouseMove, handleKeyDown, handleScroll, handleClick, handleWindowFocus, handleWindowBlur]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    sessionStartRef.current = Date.now();
    setMetrics({
      isActive: true,
      focusScore: 100,
      timeSpentFocused: 0,
      totalTimeSpent: 0,
      distractionCount: 0,
      lastActivity: Date.now(),
      needsBreak: false,
    });
    resetActivityCounters();
  }, [resetActivityCounters]);

  // Acknowledge break (reset break timer)
  const acknowledgeBreak = useCallback(() => {
    setMetrics(prev => ({ ...prev, needsBreak: false }));
    sessionStartRef.current = Date.now(); // Reset session for break interval calculation
  }, []);

  // Auto-start tracking on mount
  useEffect(() => {
    startTracking();
    return stopTracking;
  }, [startTracking, stopTracking]);

  return {
    metrics,
    startTracking,
    stopTracking,
    resetMetrics,
    acknowledgeBreak,
    config,
  };
};