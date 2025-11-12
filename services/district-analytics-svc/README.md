# District Detection & Analytics Service

Production-grade geographic district detection and comprehensive learning analytics service.

## Features

### District Detection Engine
- **Zipcode-Based Detection**: Detect school districts from zipcodes
- **Geographic Boundaries**: NCES district boundary mapping
- **Coordinate Lookup**: Geocoding integration
- **Nearby Districts**: Find districts within radius
- **District Information**: Comprehensive district data

### Analytics Engine
- **Learning Analytics**: Performance metrics and trends
- **Engagement Tracking**: Activity and participation analysis
- **Outcome Prediction**: ML-based outcome forecasting
- **Progress Monitoring**: Goal tracking and achievement
- **Trend Analysis**: Statistical trend detection

### Reporting & Insights
- **Comprehensive Reports**: Multi-dimensional analytics reports
- **Actionable Insights**: AI-generated recommendations
- **Visualizations**: Interactive charts with Plotly
- **Benchmarking**: National, state, and district comparisons
- **Data Export**: CSV, Excel, JSON formats

## Architecture

```
District Detection & Analytics Service
├── District Detection Engine
│   ├── Boundary Loader (GeoJSON)
│   ├── District Mapper (spatial queries)
│   ├── Zipcode Geocoder
│   └── NCES Integration
├── Analytics Engine
│   ├── Learning Analytics
│   ├── Engagement Tracker
│   ├── Outcome Predictor (ML)
│   ├── Trend Analyzer
│   └── Report Generator
└── Benchmarking System
    ├── National Benchmarks
    ├── State Comparisons
    └── District Rankings
```

## API Endpoints

### District Detection
- `POST /v1/district/detect` - Detect district by zipcode
- `GET /v1/district/{district_id}` - Get district information

### Analytics
- `POST /v1/analytics/generate` - Generate analytics report
- `GET /v1/analytics/dashboard/{entity_type}/{entity_id}` - Get dashboard data
- `POST /v1/analytics/export` - Export analytics data
- `GET /v1/analytics/benchmarks/{entity_type}` - Get benchmark data

## Setup

### Local Development
```bash
cd services/district-analytics-svc

# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn src.main:app --reload --port 8017
```

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f district-analytics-svc
```

## Configuration

Environment variables:
```env
DATABASE_URL=postgresql+asyncpg://aivo:aivopass@localhost:5432/aivo_analytics
REDIS_URL=redis://localhost:6379/8
NCES_API_KEY=your_key_here
DEFAULT_DATE_RANGE_DAYS=30
CACHE_TTL_SECONDS=300
```

## Data Sources

### District Data
- **NCES (National Center for Education Statistics)**: Official district data
- **Cartographic Boundaries**: District geographic boundaries
- **Zipcode Database**: US postal code to coordinates mapping

### Analytics Data
- Learning session data
- Engagement events
- Assessment results
- User activity logs

## Analytics Metrics

### Learning Metrics
- Total sessions
- Completion rate
- Average score
- Skills practiced
- Mastery gains
- Learning velocity

### Engagement Metrics
- Active days
- Session duration
- Activities per day
- Engagement score

### Progress Metrics
- Progress rate
- Goals met vs. total
- Milestone tracking

## District Detection Example

```bash
# Detect district by zipcode
curl -X POST http://localhost:8017/v1/district/detect \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "94102"}'

# Response:
{
  "detected": true,
  "zipcode": "94102",
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "districts": [{
    "district_id": "sample_district",
    "name": "San Francisco Unified School District",
    "state": "CA",
    "nces_id": "0621690",
    "confidence": 0.95
  }],
  "primary_district": {...}
}
```

## Analytics Generation Example

```bash
# Generate comprehensive analytics
curl -X POST http://localhost:8017/v1/analytics/generate \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "student",
    "entity_id": "student123",
    "date_range": {
      "start": "2025-10-01",
      "end": "2025-11-01"
    },
    "metrics": ["learning", "engagement", "progress"]
  }'

# Response includes:
# - Detailed metrics
# - AI-generated insights
# - Actionable recommendations
# - Trend analysis
# - Benchmark comparisons
```

## Visualizations

The service generates interactive visualizations:
- Learning progress charts (time series)
- Skills mastery radar charts
- Engagement heatmaps
- Trend analysis graphs

All visualizations use Plotly for interactivity.

## Benchmarking

Compare performance against:
- **National Benchmarks**: US averages
- **State Benchmarks**: State-level comparisons
- **District Benchmarks**: Within-district comparisons

Percentile rankings included (25th, 50th, 75th).

## Monitoring

Prometheus metrics at `/metrics`:
- `districts_detected_total` - District detections counter
- `analytics_reports_generated` - Reports generated counter
- `data_points_processed` - Data processing counter
- `analytics_latency_seconds` - Analytics generation latency

## Caching Strategy

- District detection: 24 hours
- Dashboard data: 5 minutes
- Analytics reports: 1 hour (for same parameters)
- Benchmark data: 24 hours

## Performance

- District detection: < 100ms (cached)
- Analytics generation: 1-3 seconds
- Dashboard queries: < 50ms (cached)
- Export jobs: 2-5 minutes (async)

## Testing

```bash
# Test district detection
curl http://localhost:8017/v1/district/detect \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "90210"}'

# Test analytics
curl http://localhost:8017/v1/analytics/dashboard/student/student123

# Check health
curl http://localhost:8017/health
```

## Future Enhancements

- [ ] Real-time analytics streaming
- [ ] Custom report templates
- [ ] ML-powered anomaly detection
- [ ] Predictive intervention recommendations
- [ ] Multi-district comparative analysis

## License

Proprietary - AIVO Learning Platform
