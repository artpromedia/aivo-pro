"""
Model Manager with Google-style model serving
Implements model versioning, A/B testing, and fallback strategies
"""

import asyncio
import hashlib
import time
from collections import OrderedDict
from typing import Dict, List, Optional

import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)


class ModelManager:
    """
    Production model management following Google's model serving patterns
    Handles model loading, versioning, and fallback strategies
    """
    
    def __init__(
        self,
        primary_model: str,
        fallback_models: List[str],
        device_map: str,
        optimization_level: str
    ):
        self.primary_model = primary_model
        self.fallback_models = fallback_models
        self.device_map = device_map
        self.optimization_level = optimization_level
        
        # Model registry (Google's model versioning pattern)
        self.model_registry: OrderedDict[str, Dict] = OrderedDict()
        self.active_model: Optional[str] = None
        
        # Model performance tracking
        self.model_metrics: Dict[str, Dict] = {}
        
        # Device tracking
        self.device = self._get_device()
        
    def _get_device(self) -> torch.device:
        """Determine available device"""
        if torch.cuda.is_available():
            return torch.device("cuda")
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return torch.device("mps")
        return torch.device("cpu")
        
    async def load_models(self):
        """Load models with fallback strategy"""
        print(f"🔄 Loading models on device: {self.device}")
        
        # Try loading primary model
        try:
            await self._load_model(self.primary_model, is_primary=True)
            self.active_model = self.primary_model
            print(f"✅ Primary model loaded: {self.primary_model}")
        except Exception as e:
            print(f"❌ Failed to load primary model: {e}")
            
            # Try fallback models
            for fallback in self.fallback_models:
                try:
                    await self._load_model(fallback, is_primary=False)
                    self.active_model = fallback
                    print(f"✅ Fallback model loaded: {fallback}")
                    break
                except Exception as fe:
                    print(f"❌ Failed to load fallback {fallback}: {fe}")
            
            if not self.active_model:
                raise RuntimeError("No models could be loaded")
    
    async def _load_model(self, model_name: str, is_primary: bool):
        """Load individual model with optimization"""
        model_hash = hashlib.sha256(model_name.encode()).hexdigest()[:8]
        
        print(f"  Loading {model_name}...")
        start_time = time.time()
        
        # Load with optimization based on level
        if self.optimization_level == "high" and torch.cuda.is_available():
            # Quantization for production
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                quantization_config=quantization_config,
                device_map=self.device_map,
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
        elif self.optimization_level == "medium":
            # Float16 for balanced performance
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                device_map=self.device_map,
                torch_dtype=torch.float16,
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
        else:
            # Standard loading for CPU or low optimization
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
            if self.device.type != "cpu":
                model = model.to(self.device)
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=True
        )
        
        # Ensure tokenizer has pad token
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        load_time = time.time() - start_time
        
        self.model_registry[model_hash] = {
            "model": model,
            "tokenizer": tokenizer,
            "name": model_name,
            "is_primary": is_primary,
            "load_time": load_time,
            "loaded_at": time.time()
        }
        
        # Initialize metrics
        self.model_metrics[model_hash] = {
            "requests": 0,
            "errors": 0,
            "total_latency": 0.0,
            "total_tokens": 0
        }
        
        print(f"  ✅ Loaded in {load_time:.2f}s")
    
    def get_active_model(self) -> tuple:
        """Get active model and tokenizer"""
        if not self.active_model:
            raise RuntimeError("No active model available")
        
        model_hash = hashlib.sha256(
            self.active_model.encode()
        ).hexdigest()[:8]
        
        model_data = self.model_registry.get(model_hash)
        if not model_data:
            raise RuntimeError(f"Model {self.active_model} not in registry")
        
        return model_data["model"], model_data["tokenizer"]
    
    def get_active_model_name(self) -> str:
        """Get active model name"""
        return self.active_model or "unknown"
    
    def record_request(
        self,
        model_name: str,
        latency: float,
        tokens: int,
        error: bool = False
    ):
        """Record model performance metrics"""
        model_hash = hashlib.sha256(model_name.encode()).hexdigest()[:8]
        
        if model_hash in self.model_metrics:
            metrics = self.model_metrics[model_hash]
            metrics["requests"] += 1
            metrics["total_latency"] += latency
            metrics["total_tokens"] += tokens
            if error:
                metrics["errors"] += 1
    
    def get_metrics(self) -> Dict:
        """Get performance metrics for all models"""
        metrics_summary = {}
        
        for model_hash, data in self.model_registry.items():
            metrics = self.model_metrics.get(model_hash, {})
            requests = metrics.get("requests", 0)
            
            avg_latency = (
                metrics.get("total_latency", 0) / requests
                if requests > 0 else 0
            )
            
            error_rate = (
                metrics.get("errors", 0) / requests
                if requests > 0 else 0
            )
            
            metrics_summary[data["name"]] = {
                "requests": requests,
                "avg_latency_ms": avg_latency * 1000,
                "error_rate": error_rate,
                "total_tokens": metrics.get("total_tokens", 0),
                "is_active": data["name"] == self.active_model
            }
        
        return metrics_summary
    
    async def health_check(self) -> bool:
        """Check if model is healthy and ready"""
        try:
            if not self.active_model:
                return False
            
            # Try to get model
            model, tokenizer = self.get_active_model()
            
            # Simple inference test
            test_input = "Hello"
            inputs = tokenizer(
                test_input,
                return_tensors="pt"
            )
            
            if self.device.type != "cpu":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                _ = model.generate(
                    **inputs,
                    max_new_tokens=5,
                    do_sample=False
                )
            
            return True
            
        except Exception as e:
            print(f"Model health check failed: {e}")
            return False
    
    async def cleanup(self):
        """Cleanup models and free memory"""
        for model_hash, data in self.model_registry.items():
            try:
                del data["model"]
                del data["tokenizer"]
            except Exception as e:
                print(f"Error cleaning up model: {e}")
        
        self.model_registry.clear()
        
        # Clear CUDA cache if available
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
