# Learning Session Service Dockerfile
# Production-grade containerization for adaptive learning service

FROM python:3.11-slim

LABEL maintainer="AIVO Learning Platform"
LABEL service="learning-session"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 learningsvc && \
    chown -R learningsvc:learningsvc /app

USER learningsvc

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8004/health || exit 1

# Expose port
EXPOSE 8004

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8004"]
