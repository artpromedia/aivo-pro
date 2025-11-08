import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useChartDimensions, useColorScale, useD3Transition, useTooltip } from '../hooks';
import type { SkillTreeData, SkillTreeProps } from '../types';

export const SkillTree: React.FC<SkillTreeProps> = ({
  data,
  dimensions,
  config = {},
  layout = 'tree',
  showProgress = true,
  interactive = true,
  onSkillClick,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { tooltipRef, showTooltip, hideTooltip } = useTooltip();

  const chartConfig = {
    responsive: true,
    animated: true,
    nodeSize: 40,
    linkStrength: 0.8,
    theme: 'light',
    ...config
  };

  const { dimensions: chartDimensions, innerWidth, innerHeight } = useChartDimensions(
    containerRef,
    dimensions
  );

  const colorScale = useColorScale('skill-progress');
  const transition = useD3Transition(800, 'easeInOut');

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${chartDimensions.margin.left},${chartDimensions.margin.top})`);

    if (layout === 'tree') {
      renderTreeLayout(g, data);
    } else {
      renderForceLayout(g, data);
    }

  }, [data, innerWidth, innerHeight, layout, chartConfig]);

  const renderTreeLayout = (g: d3.Selection<SVGGElement, unknown, null, undefined>, skillData: SkillTreeData) => {
    // Create hierarchy from data
    const root = d3.hierarchy(skillData);
    const treeLayout = d3.tree<SkillTreeData>()
      .size([innerWidth, innerHeight - 100]);

    treeLayout(root);

    // Draw links
    const links = g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    if (chartConfig.animated) {
      links
        .attr('d', d => {
          const o = { x: d.source.x || 0, y: d.source.y || 0 };
          return diagonal(o, o);
        })
        .transition(transition)
        .attr('d', d => diagonal(d.source, d.target));
    } else {
      links.attr('d', d => diagonal(d.source, d.target));
    }

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', interactive ? 'pointer' : 'default');

    if (chartConfig.animated) {
      nodes
        .attr('transform', d => `translate(${d.parent?.x || innerWidth / 2},${d.parent?.y || 0})`)
        .transition(transition)
        .delay((d, i) => i * 100)
        .attr('transform', d => `translate(${d.x},${d.y})`);
    } else {
      nodes.attr('transform', d => `translate(${d.x},${d.y})`);
    }

    // Add node circles
    const circles = nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => getSkillColor(d.data))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('class', 'skill-node');

    if (chartConfig.animated) {
      circles
        .transition(transition)
        .delay((d, i) => i * 100)
        .attr('r', chartConfig.nodeSize / 2);
    } else {
      circles.attr('r', chartConfig.nodeSize / 2);
    }

    // Add progress rings for completed skills
    if (showProgress) {
      nodes
        .filter(d => d.data.progress > 0)
        .append('circle')
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', d => {
          const circumference = 2 * Math.PI * (chartConfig.nodeSize / 2 + 5);
          const progress = d.data.progress / 100;
          return `${circumference * progress} ${circumference}`;
        })
        .attr('stroke-linecap', 'round')
        .style('transform', 'rotate(-90deg)')
        .style('transform-origin', 'center');

      if (chartConfig.animated) {
        nodes.selectAll('circle:last-child')
          .transition(transition)
          .delay((d, i) => i * 100 + 200)
          .attr('r', chartConfig.nodeSize / 2 + 5);
      } else {
        nodes.selectAll('circle:last-child')
          .attr('r', chartConfig.nodeSize / 2 + 5);
      }
    }

    // Add skill icons
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '16px')
      .style('fill', '#fff')
      .style('font-weight', 'bold')
      .text(d => d.data.icon || d.data.name.charAt(0).toUpperCase());

    // Add skill labels
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', chartConfig.nodeSize + 15)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text(d => d.data.name);

    // Add interactivity
    if (interactive) {
      nodes
        .on('mouseover', function(event, d) {
          d3.select(this).select('circle.skill-node')
            .transition()
            .duration(200)
            .attr('r', chartConfig.nodeSize / 2 + 5);

          showTooltip(
            `<strong>${d.data.name}</strong><br/>
             Status: ${d.data.status}<br/>
             Progress: ${d.data.progress}%<br/>
             ${d.data.description ? `Description: ${d.data.description}` : ''}`,
            event.pageX,
            event.pageY
          );
        })
        .on('mouseout', function() {
          d3.select(this).select('circle.skill-node')
            .transition()
            .duration(200)
            .attr('r', chartConfig.nodeSize / 2);

          hideTooltip();
        })
        .on('click', (event, d) => {
          onSkillClick?.(d.data);
        });
    }
  };

  const renderForceLayout = (g: d3.Selection<SVGGElement, unknown, null, undefined>, skillData: SkillTreeData) => {
    // Flatten tree structure for force simulation
    const nodes = flattenSkillTree(skillData).map(node => ({
      ...node,
      x: innerWidth / 2,
      y: innerHeight / 2
    }));
    const links = createSkillLinks(skillData);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).strength(chartConfig.linkStrength))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius(chartConfig.nodeSize));

    // Draw links
    const linkElements = g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const nodeElements = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', interactive ? 'pointer' : 'default');

    // Add node circles
    nodeElements.append('circle')
      .attr('r', chartConfig.nodeSize / 2)
      .attr('fill', d => getSkillColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('class', 'skill-node');

    // Add progress rings
    if (showProgress) {
      nodeElements
        .filter(d => d.progress > 0)
        .append('circle')
        .attr('r', chartConfig.nodeSize / 2 + 5)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', d => {
          const circumference = 2 * Math.PI * (chartConfig.nodeSize / 2 + 5);
          const progress = d.progress / 100;
          return `${circumference * progress} ${circumference}`;
        })
        .attr('stroke-linecap', 'round')
        .style('transform', 'rotate(-90deg)')
        .style('transform-origin', 'center');
    }

    // Add skill icons
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '16px')
      .style('fill', '#fff')
      .style('font-weight', 'bold')
      .text(d => d.icon || d.name.charAt(0).toUpperCase());

    // Add skill labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', chartConfig.nodeSize + 15)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text(d => d.name);

    // Add interactivity
    if (interactive) {
      nodeElements
        .on('mouseover', function(event, d) {
          d3.select(this).select('circle.skill-node')
            .transition()
            .duration(200)
            .attr('r', chartConfig.nodeSize / 2 + 5);

          showTooltip(
            `<strong>${d.name}</strong><br/>
             Status: ${d.status}<br/>
             Progress: ${d.progress}%<br/>
             ${d.description ? `Description: ${d.description}` : ''}`,
            event.pageX,
            event.pageY
          );
        })
        .on('mouseout', function() {
          d3.select(this).select('circle.skill-node')
            .transition()
            .duration(200)
            .attr('r', chartConfig.nodeSize / 2);

          hideTooltip();
        })
        .on('click', (event, d) => {
          onSkillClick?.(d);
        });

      // Add drag behavior
      nodeElements.call(
        d3.drag<SVGGElement, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );
    }

    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeElements
        .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  };

  const getSkillColor = (skill: SkillTreeData) => {
    if (skill.status === 'completed') return '#10b981';
    if (skill.status === 'in-progress') return '#f59e0b';
    if (skill.status === 'available') return '#3b82f6';
    return '#9ca3af';
  };

  const diagonal = (source: any, target: any) => {
    return `M${source.x},${source.y}
            C${source.x},${(source.y + target.y) / 2}
             ${target.x},${(source.y + target.y) / 2}
             ${target.x},${target.y}`;
  };

  const flattenSkillTree = (node: SkillTreeData, result: SkillTreeData[] = []): SkillTreeData[] => {
    result.push({ ...node, x: 0, y: 0 });
    if (node.children) {
      node.children.forEach(child => flattenSkillTree(child, result));
    }
    return result;
  };

  const createSkillLinks = (node: SkillTreeData, links: any[] = []): any[] => {
    if (node.children) {
      node.children.forEach(child => {
        links.push({ source: node.id, target: child.id });
        createSkillLinks(child, links);
      });
    }
    return links;
  };

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
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-sm font-medium text-gray-700">Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm font-medium text-gray-700">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-700">Completed</span>
        </div>
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg"
        style={{ display: 'none' }}
      />
    </motion.div>
  );
};