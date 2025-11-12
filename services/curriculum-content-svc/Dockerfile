# Curriculum Content Service Dockerfile
# Comprehensive K-12 curriculum across US, Europe, Middle East, China, Africa

FROM python:3.11-slim

LABEL maintainer="AIVO Learning Platform"
LABEL service="curriculum-content"
LABEL version="1.0.0"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 curriculumsvc && \
    chown -R curriculumsvc:curriculumsvc /app

USER curriculumsvc

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8006/health || exit 1

# Expose port
EXPOSE 8006

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8006"]
