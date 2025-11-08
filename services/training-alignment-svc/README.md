# Training & Alignment Service

Responsible AI governance and continuous model improvement for the AIVO Learning Platform.

## Features

- **Responsible AI Governance**: Validate model outputs against ethical guidelines
- **Bias Detection & Mitigation**: Detect and mitigate gender, racial, disability, and socioeconomic bias
- **Model Drift Monitoring**: Track model performance degradation over time
- **Continuous Training Pipeline**: Automated retraining based on performance metrics
- **Compliance Reporting**: Generate comprehensive governance reports

## API Endpoints

### Alignment Validation
- `POST /v1/alignment/validate` - Validate model outputs for compliance
- `GET /v1/governance/report` - Generate governance report

### Bias Management
- `POST /v1/bias/check` - Check for bias in model outputs
- `POST /v1/bias/mitigate` - Apply bias mitigation strategies

### Model Training
- `POST /v1/training/schedule` - Schedule model retraining
- `POST /v1/training/auto-schedule` - Auto-schedule training for drifted models

### Drift Monitoring
- `POST /v1/drift/check` - Check for model performance drift
- `GET /v1/model/{model_id}/status` - Get comprehensive model status

## Configuration

See `.env.example` for configuration options.

Key settings:
- `BIAS_THRESHOLD`: Maximum acceptable bias score (default: 0.10)
- `DRIFT_THRESHOLD`: Performance degradation threshold (default: 0.15)
- `RETRAINING_INTERVAL_DAYS`: Days between scheduled retraining (default: 30)

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn src.main:app --reload --port 8009

# Run tests
pytest tests/
```

## Docker

```bash
# Build image
docker build -t aivo-training-alignment-svc .

# Run container
docker run -p 8009:8009 --env-file .env aivo-training-alignment-svc
```

## Governance Rules

1. **No Harmful Content**: Filters inappropriate or harmful content
2. **Age Appropriate**: Ensures content matches child's developmental level
3. **Bias Mitigation**: Detects and corrects biased outputs
4. **Privacy Preserving**: Protects student data and privacy
5. **Explainable Decisions**: Provides transparency in AI decisions
6. **Educational Alignment**: Validates curriculum alignment

## Bias Metrics

The service tracks four categories of bias:
- **Gender Bias**: Stereotypical gender representations
- **Racial Bias**: Racial stereotypes or discrimination
- **Disability Bias**: Ableist language or assumptions
- **Socioeconomic Bias**: Class-based assumptions

All metrics are normalized to 0-1 scale, with threshold of 0.10 (10%).

## Model Drift Detection

Drift detection compares current model performance against baseline:
- Tracks accuracy, precision, recall, and F1 score
- Triggers retraining when degradation exceeds 15%
- Supports configurable evaluation windows

## License

Proprietary - AIVO Learning Platform
