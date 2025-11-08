# @aivo/visualizations

Advanced D3.js-powered data visualization components for the AIVO Learning Platform. Built with React, TypeScript, and modern animation libraries.

## Features

- 📊 **Interactive Charts**: Progress charts, skill trees, analytics dashboards
- 🎯 **Learning-Focused**: Specialized visualizations for educational data
- 🏗️ **TypeScript First**: Complete type safety and IDE support
- 🎨 **Customizable**: Flexible theming and configuration options
- 📱 **Responsive**: Mobile-friendly and adaptive layouts
- ⚡ **Performant**: Optimized D3.js integration with React hooks
- 🎭 **Animated**: Smooth transitions with Framer Motion

## Components

### ProgressChart

Interactive line chart for tracking learning progress over time.

```tsx
import { ProgressChart } from '@aivo/visualizations';

<ProgressChart
  data={progressData}
  timeRange="30d"
  showTrendLine={true}
  compareSubjects={true}
  onDataPointClick={(point) => console.log(point)}
/>
```

**Features:**
- Multiple subject comparison
- Trend line analysis
- Interactive data points
- Customizable time ranges
- Responsive design

### SkillTree

Hierarchical visualization for skill progression and prerequisites.

```tsx
import { SkillTree } from '@aivo/visualizations';

<SkillTree
  data={skillTreeData}
  layout="tree" // or "force"
  showProgress={true}
  interactive={true}
  onSkillClick={(skill) => console.log(skill)}
/>
```

**Features:**
- Tree and force-directed layouts
- Progress indicators
- Interactive nodes
- Skill dependencies
- Drag and drop support

### AnalyticsDashboard

Comprehensive dashboard with multiple chart types for analytics.

```tsx
import { AnalyticsDashboard } from '@aivo/visualizations';

<AnalyticsDashboard
  data={analyticsData}
  viewMode="teacher"
  timeRange="30d"
  onFilterChange={(filters) => setFilters(filters)}
/>
```

**Features:**
- Multiple chart types
- Real-time metrics
- Interactive filters
- Responsive grid layout
- Export capabilities

## Hooks

### useChartDimensions

Responsive chart sizing and margin management.

```tsx
import { useChartDimensions } from '@aivo/visualizations';

const { dimensions, innerWidth, innerHeight } = useChartDimensions(
  containerRef,
  { width: 800, height: 400 }
);
```

### useColorScale

Consistent color schemes across visualizations.

```tsx
import { useColorScale } from '@aivo/visualizations';

const colorScale = useColorScale('aivo', subjects);
```

### useD3Transition

Smooth D3.js animations with React lifecycle.

```tsx
import { useD3Transition } from '@aivo/visualizations';

const transition = useD3Transition(500, 'easeInOut');
```

### useTooltip

Interactive tooltip management.

```tsx
import { useTooltip } from '@aivo/visualizations';

const { tooltipRef, showTooltip, hideTooltip } = useTooltip();
```

## Data Formats

### Learning Progress Data

```typescript
interface LearningProgressData {
  subject: string;
  level: number;
  xp: number;
  timeSpent: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  streakDays: number;
  lastActivity: string;
  weeklyProgress: ProgressPoint[];
  skillsProgress: SkillProgress[];
}
```

### Skill Tree Data

```typescript
interface SkillTreeData {
  id: string;
  name: string;
  description?: string;
  level: number;
  progress: number; // 0-100
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  prerequisites: string[];
  subject: string;
  children?: SkillTreeData[];
}
```

### Analytics Data

```typescript
interface AnalyticsData {
  overview: OverviewMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  timeAnalysis: TimeAnalysisData;
  subjectBreakdown: SubjectMetrics[];
  comparativeData: ComparativeMetrics;
}
```

## Configuration

### Chart Configuration

```typescript
interface VisualizationConfig {
  responsive?: boolean;
  animated?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  colorScheme?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}
```

### Theme Customization

```tsx
// Custom color schemes
const customColors = ['#FF7B5C', '#FF636F', '#9B59B6', '#3498DB'];

<ProgressChart
  data={data}
  config={{
    theme: 'light',
    colorScheme: customColors,
    animated: true,
    interactive: true
  }}
/>
```

## Examples

### Basic Progress Chart

```tsx
import React from 'react';
import { ProgressChart } from '@aivo/visualizations';

const ExampleChart = () => {
  const data = [
    {
      subject: 'Mathematics',
      level: 5,
      xp: 2840,
      weeklyProgress: [
        { date: '2024-01-01', value: 75, type: 'xp' },
        { date: '2024-01-02', value: 82, type: 'xp' },
        // ... more points
      ]
    }
  ];

  return (
    <div className="w-full h-96">
      <ProgressChart
        data={data}
        timeRange="7d"
        showTrendLine={true}
        onDataPointClick={(point) => {
          console.log('Clicked:', point);
        }}
      />
    </div>
  );
};
```

### Interactive Skill Tree

```tsx
import React, { useState } from 'react';
import { SkillTree } from '@aivo/visualizations';

const SkillTreeExample = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skillData = {
    id: 'root',
    name: 'Mathematics',
    level: 1,
    progress: 100,
    status: 'completed',
    children: [
      {
        id: 'algebra',
        name: 'Algebra',
        level: 2,
        progress: 75,
        status: 'in-progress',
        children: [
          // ... nested skills
        ]
      }
    ]
  };

  return (
    <SkillTree
      data={skillData}
      layout="tree"
      showProgress={true}
      onSkillClick={setSelectedSkill}
    />
  );
};
```

## Performance Tips

1. **Memoize Data**: Use `useMemo` for expensive data transformations
2. **Limit Updates**: Debounce rapid data changes
3. **Virtual Rendering**: Use windowing for large datasets
4. **Optimize D3**: Minimize DOM manipulations in render loops

```tsx
import React, { useMemo } from 'react';

const OptimizedChart = ({ rawData }) => {
  const processedData = useMemo(() => {
    return processLearningData(rawData);
  }, [rawData]);

  return <ProgressChart data={processedData} />;
};
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies

- React 18.3+
- D3.js 7.9.0
- Framer Motion 11.18+
- TypeScript 5.6+

## Contributing

1. Follow the existing component patterns
2. Add TypeScript interfaces for all props
3. Include animation support where appropriate
4. Test across different screen sizes
5. Document new features in README

## License

MIT License - see LICENSE file for details.