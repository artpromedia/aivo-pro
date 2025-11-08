# Terraform Configuration for GPU Infrastructure
# Provisions GPU instances for AIVO ML services

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "aivo-terraform-state"
    key    = "ml-infrastructure/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}

variable "gpu_instance_type" {
  description = "GPU instance type"
  default     = "g4dn.xlarge"  # 1 NVIDIA T4 GPU
}

variable "gpu_instance_count" {
  description = "Number of GPU instances"
  default     = 3
}

# VPC Configuration
resource "aws_vpc" "aivo_ml" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "aivo-ml-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "aivo_ml" {
  vpc_id = aws_vpc.aivo_ml.id
  
  tags = {
    Name = "aivo-ml-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.aivo_ml.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "aivo-ml-public-${count.index + 1}"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.aivo_ml.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.aivo_ml.id
  }
  
  tags = {
    Name = "aivo-ml-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security Group for GPU Instances
resource "aws_security_group" "gpu_instances" {
  name        = "aivo-brain-gpu-sg"
  description = "Security group for AIVO Brain GPU instances"
  vpc_id      = aws_vpc.aivo_ml.id
  
  # HTTP access
  ingress {
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "AIVO Brain API"
  }
  
  # Model Cloning access
  ingress {
    from_port   = 8014
    to_port     = 8014
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Model Cloning API"
  }
  
  # SSH access (restricted)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_IP/32"]  # Replace with your IP
    description = "SSH access"
  }
  
  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "aivo-brain-gpu-sg"
  }
}

# IAM Role for GPU Instances
resource "aws_iam_role" "gpu_instance" {
  name = "aivo-brain-gpu-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for S3 Access
resource "aws_iam_role_policy" "s3_access" {
  name = "aivo-brain-s3-access"
  role = aws_iam_role.gpu_instance.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.model_storage.arn}",
          "${aws_s3_bucket.model_storage.arn}/*"
        ]
      }
    ]
  })
}

# Instance Profile
resource "aws_iam_instance_profile" "gpu_instance" {
  name = "aivo-brain-gpu-profile"
  role = aws_iam_role.gpu_instance.name
}

# GPU Instances for AIVO Brain
resource "aws_instance" "aivo_brain_gpu" {
  count         = var.gpu_instance_count
  ami           = data.aws_ami.deep_learning.id
  instance_type = var.gpu_instance_type
  
  subnet_id                   = aws_subnet.public[count.index % 2].id
  vpc_security_group_ids      = [aws_security_group.gpu_instances.id]
  iam_instance_profile        = aws_iam_instance_profile.gpu_instance.name
  associate_public_ip_address = true
  
  root_block_device {
    volume_size = 200
    volume_type = "gp3"
    iops        = 3000
    throughput  = 125
    encrypted   = true
  }
  
  user_data = templatefile("${path.module}/user-data.sh", {
    aivo_brain_image = "aivo/brain-model:latest"
    model_cloning_image = "aivo/model-cloning:latest"
    redis_host = aws_elasticache_cluster.redis.cache_nodes[0].address
    s3_bucket = aws_s3_bucket.model_storage.id
  })
  
  tags = {
    Name        = "aivo-brain-gpu-${count.index + 1}"
    Type        = "ml-inference"
    Environment = var.environment
  }
}

# S3 Bucket for Model Storage
resource "aws_s3_bucket" "model_storage" {
  bucket = "aivo-model-storage-${var.environment}"
  
  tags = {
    Name        = "aivo-model-storage"
    Environment = var.environment
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "model_storage" {
  bucket = aws_s3_bucket.model_storage.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "model_storage" {
  bucket = aws_s3_bucket.model_storage.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Lifecycle Policy
resource "aws_s3_bucket_lifecycle_configuration" "model_storage" {
  bucket = aws_s3_bucket.model_storage.id
  
  rule {
    id     = "archive-old-models"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

# ElastiCache Redis Cluster
resource "aws_elasticache_subnet_group" "redis" {
  name       = "aivo-redis-subnet-group"
  subnet_ids = aws_subnet.public[*].id
}

resource "aws_security_group" "redis" {
  name        = "aivo-redis-sg"
  description = "Security group for Redis"
  vpc_id      = aws_vpc.aivo_ml.id
  
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.gpu_instances.id]
  }
  
  tags = {
    Name = "aivo-redis-sg"
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "aivo-redis-cluster"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]
  
  tags = {
    Name = "aivo-redis-cluster"
  }
}

# Application Load Balancer
resource "aws_lb" "aivo_brain" {
  name               = "aivo-brain-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.gpu_instances.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = true
  enable_http2              = true
  
  tags = {
    Name = "aivo-brain-lb"
  }
}

# Target Group for AIVO Brain
resource "aws_lb_target_group" "aivo_brain" {
  name     = "aivo-brain-tg"
  port     = 8001
  protocol = "HTTP"
  vpc_id   = aws_vpc.aivo_ml.id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 30
    matcher             = "200"
  }
  
  stickiness {
    type            = "lb_cookie"
    cookie_duration = 86400
    enabled         = true
  }
}

# Target Group Attachments
resource "aws_lb_target_group_attachment" "aivo_brain" {
  count            = var.gpu_instance_count
  target_group_arn = aws_lb_target_group.aivo_brain.arn
  target_id        = aws_instance.aivo_brain_gpu[count.index].id
  port             = 8001
}

# Listener
resource "aws_lb_listener" "aivo_brain" {
  load_balancer_arn = aws_lb.aivo_brain.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.aivo_brain.arn
  }
}

# Data Sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "deep_learning" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["Deep Learning AMI GPU PyTorch *"]
  }
  
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# Outputs
output "aivo_brain_lb_dns" {
  description = "DNS name of AIVO Brain load balancer"
  value       = aws_lb.aivo_brain.dns_name
}

output "gpu_instance_ids" {
  description = "GPU instance IDs"
  value       = aws_instance.aivo_brain_gpu[*].id
}

output "s3_bucket_name" {
  description = "S3 bucket for model storage"
  value       = aws_s3_bucket.model_storage.id
}

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}
