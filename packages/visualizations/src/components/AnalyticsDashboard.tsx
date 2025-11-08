import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useChartDimensions, useColorScale, useD3Transition, useTooltip } from '../hooks';
import type { AnalyticsData, AnalyticsDashboardProps } from '../types';

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  viewMode = 'student',
  timeRange = '30d',
  filters = {},
  onFilterChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tooltipRef, showTooltip, hideTooltip } = useTooltip();

  const colorScale = useColorScale('analytics');

  return (
    <motion.div
      ref={containerRef}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {/* Overview Metrics */}
      <motion.div
        className="col-span-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard
            title="Total Students"
            value={data.overview.totalStudents}
            icon="👥"
            trend="up"
            trendValue={5.2}
          />
          <MetricCard
            title="Lessons"
            value={data.overview.totalLessons}
            icon="📚"
            trend="stable"
          />
          <MetricCard
            title="Avg Progress"
            value={`${data.overview.averageProgress}%`}
            icon="📈"
            trend="up"
            trendValue={8.3}
          />
          <MetricCard
            title="Completion Rate"
            value={`${data.overview.completionRate}%`}
            icon="✅"
            trend="up"
            trendValue={3.1}
          />
          <MetricCard
            title="Active Users"
            value={data.overview.activeUsers}
            icon="🟢"
            trend="up"
            trendValue={12.5}
          />
          <MetricCard
            title="Retention"
            value={`${data.overview.retentionRate}%`}
            icon="🔄"
            trend="down"
            trendValue={-2.1}
          />
          <MetricCard
            title="Satisfaction"
            value={`${data.overview.satisfactionScore}/5`}
            icon="⭐"
            trend="up"
            trendValue={0.3}
          />
        </div>
      </motion.div>

      {/* Engagement Chart */}
      <motion.div
        className="col-span-full md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EngagementChart
          data={data.engagement.dailyActiveUsers}
          title="Daily Active Users"
          colorScale={colorScale}
        />
      </motion.div>

      {/* Performance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PerformanceRadar
          data={data.performance.averageScores}
          title="Subject Performance"
          colorScale={colorScale}
        />
      </motion.div>

      {/* Time Analysis */}
      <motion.div
        className="col-span-full md:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TimeHeatmap
          data={data.timeAnalysis.peakUsageHours}
          title="Peak Usage Hours"
          colorScale={colorScale}
        />
      </motion.div>

      {/* Subject Breakdown */}
      <motion.div
        className="col-span-full md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SubjectBreakdown
          data={data.subjectBreakdown}
          title="Subject Performance Breakdown"
          colorScale={colorScale}
        />
      </motion.div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg"
        style={{ display: 'none' }}
      />
    </motion.div>
  );
};

// Individual chart components
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}> = ({ title, value, icon, trend, trendValue }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const EngagementChart: React.FC<{
  data: any[];
  title: string;
  colorScale: any;
}> = ({ data, title, colorScale }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    const line = d3.line<any>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3.area<any>()
      .x(d => xScale(new Date(d.date)))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'engagement-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(0))
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(0))
      .attr('stop-opacity', 0.8);

    // Add area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#engagement-gradient)')
      .attr('d', area);

    // Add line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorScale(0))
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((domainValue) => d3.timeFormat('%m/%d')(domainValue as Date)) as any);

    g.append('g')
      .call(d3.axisLeft(yScale) as any);

  }, [data, colorScale]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <svg ref={svgRef} width={600} height={200} className="w-full" />
    </div>
  );
};

const PerformanceRadar: React.FC<{
  data: any[];
  title: string;
  colorScale: any;
}> = ({ data, title, colorScale }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    const center = { x: width / 2, y: height / 2 };

    const g = svg.append('g')
      .attr('transform', `translate(${center.x},${center.y})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const maxValue = 100;

    // Create radial scale
    const radialScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
      g.append('circle')
        .attr('r', radius * i / 5)
        .attr('fill', 'none')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);
    }

    // Draw axis lines
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1);

      // Add labels
      g.append('text')
        .attr('x', x * 1.1)
        .attr('y', y * 1.1)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text(d.subject);
    });

    // Draw data polygon
    const lineGenerator = d3.line<any>()
      .x((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return Math.cos(angle) * radialScale(d.score);
      })
      .y((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return Math.sin(angle) * radialScale(d.score);
      })
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', lineGenerator)
      .attr('fill', colorScale(0))
      .attr('fill-opacity', 0.3)
      .attr('stroke', colorScale(0))
      .attr('stroke-width', 3);

    // Add data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radialScale(d.score);
      const y = Math.sin(angle) * radialScale(d.score);

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', colorScale(0))
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    });

  }, [data, colorScale]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <svg ref={svgRef} width={300} height={300} className="w-full" />
    </div>
  );
};

const TimeHeatmap: React.FC<{
  data: any[];
  title: string;
  colorScale: any;
}> = ({ data, title, colorScale }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    const cellSize = width / 24;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxUsage = d3.max(data, d => d.usage) || 1;
    const colorScaleLocal = d3.scaleSequential()
      .domain([0, maxUsage])
      .interpolator(d3.interpolateBlues);

    // Draw heatmap cells
    g.selectAll('.hour-cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'hour-cell')
      .attr('x', d => d.hour * cellSize)
      .attr('y', 20)
      .attr('width', cellSize - 1)
      .attr('height', 40)
      .attr('fill', d => colorScaleLocal(d.usage))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    // Add hour labels
    g.selectAll('.hour-label')
      .data([0, 6, 12, 18])
      .enter()
      .append('text')
      .attr('class', 'hour-label')
      .attr('x', d => d * cellSize + cellSize / 2)
      .attr('y', 80)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6b7280')
      .text(d => `${d}:00`);

  }, [data]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <svg ref={svgRef} width={300} height={200} className="w-full" />
    </div>
  );
};

const SubjectBreakdown: React.FC<{
  data: any[];
  title: string;
  colorScale: any;
}> = ({ data, title, colorScale }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 80, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.subject))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Draw bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.subject) || 0)
      .attr('y', d => yScale(d.averageScore))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.averageScore))
      .attr('fill', (d, i) => colorScale(i))
      .attr('rx', 4);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale) as any)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g')
      .call(d3.axisLeft(yScale) as any);

    // Add value labels on bars
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (xScale(d.subject) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.averageScore) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text(d => `${d.averageScore}%`);

  }, [data, colorScale]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <svg ref={svgRef} width={600} height={300} className="w-full" />
    </div>
  );
};