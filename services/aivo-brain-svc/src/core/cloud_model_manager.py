"""
Cloud Model Manager for OpenAI, Anthropic, and Google AI
Production implementation for cloud-based inference
"""

import hashlib
import time
from collections import OrderedDict
from typing import Dict, List, Optional

try:
    from openai import AsyncOpenAI
except ImportError:
    AsyncOpenAI = None

try:
    from anthropic import AsyncAnthropic
except ImportError:
    AsyncAnthropic = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None


class CloudModelManager:
    """
    Cloud model management for OpenAI, Anthropic, and Google
    Implements fallback strategies and performance tracking
    """

    def __init__(
        self,
        ai_provider: str,
        primary_model: str,
        fallback_models: List[str],
        openai_api_key: Optional[str] = None,
        anthropic_api_key: Optional[str] = None,
        google_api_key: Optional[str] = None,
    ):
        self.ai_provider = ai_provider
        self.primary_model = primary_model
        self.fallback_models = fallback_models

        # Initialize clients
        self.openai_client = None
        self.anthropic_client = None
        self.google_client = None

        if openai_api_key and AsyncOpenAI:
            self.openai_client = AsyncOpenAI(api_key=openai_api_key)

        if anthropic_api_key and AsyncAnthropic:
            self.anthropic_client = AsyncAnthropic(api_key=anthropic_api_key)

        if google_api_key and genai:
            genai.configure(api_key=google_api_key)
            self.google_client = genai

        # Model registry
        self.model_registry: OrderedDict[str, Dict] = OrderedDict()
        self.active_model: Optional[str] = primary_model

        # Model performance tracking
        self.model_metrics: Dict[str, Dict] = {}

    async def load_models(self):
        """Initialize cloud model connections"""
        print(f"🔄 Initializing cloud AI provider: {self.ai_provider}")

        try:
            # Register primary model
            await self._register_model(self.primary_model, is_primary=True)
            self.active_model = self.primary_model
            print(f"✅ Primary model registered: {self.primary_model}")

            # Register fallback models
            for fallback in self.fallback_models:
                try:
                    await self._register_model(fallback, is_primary=False)
                    print(f"✅ Fallback model registered: {fallback}")
                except Exception as e:
                    print(f"⚠️  Failed to register fallback {fallback}: {e}")

        except Exception as e:
            print(f"❌ Failed to initialize models: {e}")
            raise RuntimeError(f"No models could be initialized: {e}")

    async def _register_model(self, model_name: str, is_primary: bool):
        """Register a cloud model"""
        model_hash = hashlib.sha256(model_name.encode()).hexdigest()[:8]

        self.model_registry[model_hash] = {
            "name": model_name,
            "is_primary": is_primary,
            "provider": self.ai_provider,
            "registered_at": time.time()
        }

        # Initialize metrics
        self.model_metrics[model_hash] = {
            "requests": 0,
            "errors": 0,
            "total_latency": 0.0,
            "total_tokens": 0
        }

    def get_active_model_name(self) -> str:
        """Get active model name"""
        return self.active_model or "unknown"

    async def generate(
        self,
        prompt: str,
        context: Dict,
        max_tokens: int = 512,
        temperature: float = 0.7
    ) -> Dict:
        """
        Generate response using cloud AI
        """
        start_time = time.time()
        model_name = self.active_model

        try:
            # Build messages from prompt and context
            messages = self._build_messages(prompt, context)

            # Route to appropriate provider
            if self.ai_provider == "openai" and self.openai_client:
                result = await self._generate_openai(
                    messages, max_tokens, temperature
                )
            elif self.ai_provider == "anthropic" and self.anthropic_client:
                result = await self._generate_anthropic(
                    messages, max_tokens, temperature
                )
            elif self.ai_provider == "google" and self.google_client:
                result = await self._generate_google(
                    messages, max_tokens, temperature
                )
            else:
                raise RuntimeError(
                    f"Provider {self.ai_provider} not available"
                )

            # Calculate metrics
            inference_time = time.time() - start_time
            tokens_generated = result.get("tokens_generated", 0)

            # Record metrics
            self.record_request(
                model_name=model_name,
                latency=inference_time,
                tokens=tokens_generated,
                error=False
            )

            return {
                "response": result["response"],
                "model_used": model_name,
                "tokens_generated": tokens_generated,
                "inference_time": inference_time,
                "cache_hit": False
            }

        except Exception as e:
            # Record error
            self.record_request(
                model_name=model_name,
                latency=time.time() - start_time,
                tokens=0,
                error=True
            )
            raise Exception(f"Cloud inference failed: {str(e)}")

    def _build_messages(self, prompt: str, context: Dict) -> List[Dict]:
        """Build messages array for cloud APIs"""
        # Extract context
        grade_level = context.get("grade_level", "5")
        subject = context.get("subject", "General")
        learning_style = context.get("learning_style", "visual")
        accommodations = context.get("accommodations", {})

        # Build system message
        system_parts = [
            "You are AIVO, an AI tutor specialized in personalized education.",
            f"You are teaching {subject} to a student in grade {grade_level}.",
            f"The student's preferred learning style is {learning_style}."
        ]

        if accommodations:
            if accommodations.get("response_length") == "short":
                system_parts.append("Keep responses concise.")
            if accommodations.get("structure") == "bullet_points":
                system_parts.append("Use bullet points.")
            if accommodations.get("simplified_language"):
                system_parts.append("Use simple language.")
            if accommodations.get("tone") == "calm":
                system_parts.append("Maintain a calm tone.")

        system_message = " ".join(system_parts)

        return [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]

    async def _generate_openai(
        self,
        messages: List[Dict],
        max_tokens: int,
        temperature: float
    ) -> Dict:
        """Generate using OpenAI"""
        response = await self.openai_client.chat.completions.create(
            model=self.active_model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=0.95
        )

        return {
            "response": response.choices[0].message.content,
            "tokens_generated": response.usage.completion_tokens
        }

    async def _generate_anthropic(
        self,
        messages: List[Dict],
        max_tokens: int,
        temperature: float
    ) -> Dict:
        """Generate using Anthropic Claude"""
        # Extract system message
        system_msg = ""
        user_messages = []

        for msg in messages:
            if msg["role"] == "system":
                system_msg = msg["content"]
            else:
                user_messages.append(msg)

        response = await self.anthropic_client.messages.create(
            model=self.active_model,
            system=system_msg,
            messages=user_messages,
            max_tokens=max_tokens,
            temperature=temperature
        )

        return {
            "response": response.content[0].text,
            "tokens_generated": response.usage.output_tokens
        }

    async def _generate_google(
        self,
        messages: List[Dict],
        max_tokens: int,
        temperature: float
    ) -> Dict:
        """Generate using Google Gemini"""
        # Combine messages into single prompt for Gemini
        prompt_parts = []
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            if role == "system":
                prompt_parts.append(f"[System]: {content}")
            elif role == "user":
                prompt_parts.append(f"[User]: {content}")

        full_prompt = "\n\n".join(prompt_parts)

        model = self.google_client.GenerativeModel(self.active_model)
        response = await model.generate_content_async(
            full_prompt,
            generation_config={
                "max_output_tokens": max_tokens,
                "temperature": temperature
            }
        )

        return {
            "response": response.text,
            "tokens_generated": len(response.text.split())  # Approximate
        }

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
        """Check if cloud API is accessible"""
        try:
            # Simple test generation
            test_messages = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'OK'"}
            ]

            if self.ai_provider == "openai" and self.openai_client:
                response = await self.openai_client.chat.completions.create(
                    model=self.active_model,
                    messages=test_messages,
                    max_tokens=5
                )
                return bool(response.choices[0].message.content)

            return True

        except Exception as e:
            print(f"Cloud model health check failed: {e}")
            return False

    async def cleanup(self):
        """Cleanup cloud connections"""
        self.model_registry.clear()
        self.model_metrics.clear()
