#!/bin/bash
# User data script for GPU instances
# Initializes NVIDIA Docker and deploys AIVO services

set -e

# Install Docker and NVIDIA Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
    tee /etc/apt/sources.list.d/nvidia-docker.list

apt-get update
apt-get install -y nvidia-docker2

# Restart Docker
systemctl restart docker

# Test NVIDIA GPU
nvidia-smi

# Pull Docker images
docker pull ${aivo_brain_image}
docker pull ${model_cloning_image}

# Run AIVO Brain
docker run -d \
  --name aivo-brain \
  --gpus all \
  --restart unless-stopped \
  -p 8001:8001 \
  -e REDIS_HOST=${redis_host} \
  -e S3_BUCKET=${s3_bucket} \
  ${aivo_brain_image}

# Run Model Cloning Service
docker run -d \
  --name model-cloning \
  --gpus all \
  --restart unless-stopped \
  -p 8014:8014 \
  -e AIVO_BRAIN_URL=http://localhost:8001 \
  -e REDIS_HOST=${redis_host} \
  -e S3_BUCKET=${s3_bucket} \
  ${model_cloning_image}

# Install CloudWatch agent for monitoring
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb

echo "GPU instance initialization complete!"
