# Focus Monitor Service Dockerfile
# Production container for attention tracking and game generation

FROM python:3.11-slim

LABEL maintainer="AIVO Learning Platform"
LABEL service="focus-monitor"
LABEL version="1.0.0"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 focussvc && \
    chown -R focussvc:focussvc /app

USER focussvc

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8005/health || exit 1

# Expose port
EXPOSE 8005

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
