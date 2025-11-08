import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useChartDimensions, useColorScale, useD3Transition, useTooltip } from '../hooks';
import type { LearningProgressData, ProgressChartProps } from '../types';

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  dimensions,
  config = {},
  timeRange = '30d',
  showTrendLine = true,
  compareSubjects = false,
  onDataPointClick,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { tooltipRef, showTooltip, hideTooltip } = useTooltip();
  
  const chartConfig = {
    responsive: true,
    animated: true,
    interactive: true,
    theme: 'light',
    showGrid: true,
    showTooltip: true,
    ...config
  };

  const { dimensions: chartDimensions, innerWidth, innerHeight } = useChartDimensions(
    containerRef,
    dimensions
  );

  const colorScale = useColorScale('aivo', data.map(d => d.subject));
  const transition = useD3Transition(500, 'easeInOut');

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group with margins
    const g = svg
      .append('g')
      .attr('transform', `translate(${chartDimensions.margin.left},${chartDimensions.margin.top})`);

    // Prepare data for line chart
    const processedData = data.flatMap(subject => 
      subject.weeklyProgress.map(point => ({
        ...point,
        subject: subject.subject,
        date: new Date(point.date),
        color: colorScale(subject.subject)
      }))
    );

    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value) || 100])
      .range([innerHeight, 0])
      .nice();

    // Add grid lines
    if (chartConfig.showGrid) {
      // Horizontal grid lines
      g.selectAll('.grid-line-horizontal')
        .data(yScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'grid-line-horizontal')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .style('stroke', '#e2e8f0')
        .style('stroke-width', 1)
        .style('opacity', 0.5);

      // Vertical grid lines
      g.selectAll('.grid-line-vertical')
        .data(xScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'grid-line-vertical')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('stroke', '#e2e8f0')
        .style('stroke-width', 1)
        .style('opacity', 0.5);
    }

    // Create line generator
    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Group data by subject
    const subjectData = d3.groups(processedData, d => d.subject);

    // Draw lines for each subject
    subjectData.forEach(([subject, points]) => {
      const path = g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', colorScale(subject))
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .style('opacity', 0.8);

      if (chartConfig.animated) {
        const totalLength = (path.node() as SVGPathElement).getTotalLength();
        path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition(transition)
          .attr('stroke-dashoffset', 0);
      }

      path.attr('d', line(points));

      // Add data points
      if (chartConfig.interactive) {
        g.selectAll(`.point-${subject.replace(/\s+/g, '-')}`)
          .data(points)
          .enter()
          .append('circle')
          .attr('class', `point-${subject.replace(/\s+/g, '-')}`)
          .attr('cx', d => xScale(d.date))
          .attr('cy', d => yScale(d.value))
          .attr('r', 0)
          .attr('fill', colorScale(subject))
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            d3.select(this).attr('r', 8);
            if (chartConfig.showTooltip) {
              showTooltip(
                `<strong>${subject}</strong><br/>
                 Date: ${d.date.toLocaleDateString()}<br/>
                 Value: ${d.value}<br/>
                 Type: ${d.type}`,
                event.pageX,
                event.pageY
              );
            }
          })
          .on('mouseout', function() {
            d3.select(this).attr('r', 5);
            hideTooltip();
          })
          .on('click', (event, d) => {
            onDataPointClick?.(d);
          });

        if (chartConfig.animated) {
          g.selectAll(`.point-${subject.replace(/\s+/g, '-')}`)
            .transition(transition)
            .delay((d, i) => i * 50)
            .attr('r', 5);
        } else {
          g.selectAll(`.point-${subject.replace(/\s+/g, '-')}`)
            .attr('r', 5);
        }
      }
    });

    // Add trend lines
    if (showTrendLine) {
      subjectData.forEach(([subject, points]) => {
        const regression = calculateLinearRegression(points);
        if (regression) {
          const trendLine = d3.line<any>()
            .x(d => xScale(d.date))
            .y(d => yScale(regression.slope * d.date.getTime() + regression.intercept));

          g.append('path')
            .datum(points)
            .attr('d', trendLine)
            .attr('stroke', colorScale(subject))
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('fill', 'none')
            .style('opacity', 0.6);
        }
      });
    }

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((domainValue) => d3.timeFormat('%m/%d')(domainValue as Date))
      .ticks(5);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis as any)
      .style('font-size', '12px')
      .style('color', '#64748b');

    g.append('g')
      .call(yAxis as any)
      .style('font-size', '12px')
      .style('color', '#64748b');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - chartDimensions.margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text('Progress Value');

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + chartDimensions.margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text('Date');

  }, [data, innerWidth, innerHeight, colorScale, transition, chartConfig, showTrendLine]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg
        ref={svgRef}
        width={chartDimensions.width}
        height={chartDimensions.height}
        className="overflow-visible"
      />
      
      {/* Legend */}
      {config.showLegend !== false && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map(subject => (
            <div key={subject.subject} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colorScale(subject.subject) }}
              />
              <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg"
        style={{ display: 'none' }}
      />
    </motion.div>
  );
};

// Utility function for linear regression
function calculateLinearRegression(points: any[]) {
  if (points.length < 2) return null;

  const n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  points.forEach(point => {
    const x = point.date.getTime();
    const y = point.value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}