import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import type { ChartDimensions, VisualizationConfig } from './types';

// Hook for setting up D3 chart dimensions and scales
export function useChartDimensions(
  containerRef: React.RefObject<HTMLDivElement>,
  defaultDimensions: Partial<ChartDimensions> = {}
) {
  const dimensions = useMemo<ChartDimensions>(() => ({
    width: defaultDimensions.width || 800,
    height: defaultDimensions.height || 400,
    margin: {
      top: 20,
      right: 30,
      bottom: 40,
      left: 50,
      ...defaultDimensions.margin
    }
  }), [defaultDimensions]);

  const innerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const innerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  return {
    dimensions,
    innerWidth,
    innerHeight
  };
}

// Hook for responsive D3 charts
export function useResponsiveChart(containerRef: React.RefObject<HTMLDivElement>) {
  const dimensions = useRef({ width: 800, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        dimensions.current = {
          width: rect.width || 800,
          height: rect.height || 400
        };
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return dimensions.current;
}

// Hook for D3 color schemes
export function useColorScale(scheme: string = 'category10', domain?: string[]) {
  return useMemo(() => {
    const colorSchemes: Record<string, readonly string[]> = {
      category10: d3.schemeCategory10,
      set3: d3.schemeSet3,
      pastel1: d3.schemePastel1,
      dark2: d3.schemeDark2,
      aivo: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#84CC16', '#6366F1']
    };

    const colors = colorSchemes[scheme] || colorSchemes.category10;
    
    if (domain) {
      return d3.scaleOrdinal<string, string>()
        .domain(domain)
        .range(colors);
    }

    return d3.scaleOrdinal(colors);
  }, [scheme, domain]);
}

// Hook for animated D3 transitions
export function useD3Transition(duration: number = 300, ease: string = 'easeInOut') {
  return useMemo(() => {
    const easeFunction = (d3 as any)[`ease${ease}`] || d3.easeLinear;
    return d3.transition().duration(duration).ease(easeFunction);
  }, [duration, ease]);
}

// Hook for D3 scales
export function useScales<T>(
  data: T[],
  xAccessor: (d: T) => any,
  yAccessor: (d: T) => number,
  innerWidth: number,
  innerHeight: number
) {
  return useMemo(() => {
    const xExtent = d3.extent(data, xAccessor);
    const yExtent = d3.extent(data, yAccessor);

    const xScale = d3.scaleTime()
      .domain(xExtent as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] || 0])
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale };
  }, [data, xAccessor, yAccessor, innerWidth, innerHeight]);
}

// Hook for tooltip management
export function useTooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = (content: string, x: number, y: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = content;
      tooltipRef.current.style.display = 'block';
      tooltipRef.current.style.left = `${x + 10}px`;
      tooltipRef.current.style.top = `${y - 10}px`;
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  };

  return { tooltipRef, showTooltip, hideTooltip };
}

// Hook for data processing and transformation
export function useDataProcessor<T>(
  data: T[],
  processor: (data: T[]) => any[],
  dependencies: any[] = []
) {
  return useMemo(() => {
    return processor(data);
  }, [data, processor, ...dependencies]);
}

// Hook for chart configuration
export function useChartConfig(config: Partial<VisualizationConfig> = {}) {
  return useMemo<VisualizationConfig>(() => ({
    responsive: true,
    animated: true,
    interactive: true,
    theme: 'light',
    colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    ...config
  }), [config]);
}