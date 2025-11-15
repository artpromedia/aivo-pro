"""
Configuration for AIVO Main Brain Service
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""

    # Service configuration
    service_name: str = "aivo-brain-svc"
    port: int = 8001

    # Model configuration
    base_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    fallback_model: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    use_4bit_quantization: bool = True
    use_8bit_quantization: bool = False

    # Curriculum adapters
    curriculum_adapter_path: str = "models/curriculum_lora"
    curriculum_embeddings_path: str = "models/curriculum_embeddings"

    # Generation parameters
    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9
    repetition_penalty: float = 1.1

    # GPU configuration
    device: str = "cuda"  # or "cpu" for development
    gpu_memory_fraction: float = 0.85

    # Caching
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    cache_ttl: int = 3600

    # Storage
    model_storage_path: str = "/models"
    s3_bucket: Optional[str] = None
    minio_endpoint: Optional[str] = None
    minio_access_key: Optional[str] = None
    minio_secret_key: Optional[str] = None

    # Monitoring
    enable_metrics: bool = True
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
