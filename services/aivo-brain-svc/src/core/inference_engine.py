"""
Inference Engine with batching and caching
Following Google's TPU serving patterns
"""

import asyncio
import time
from typing import Any, Dict, List, Optional


class InferenceEngine:
    """
    Production inference engine supporting both local and cloud models
    Implements Google's serving optimization patterns
    """
    
    def __init__(
        self,
        model_manager,  # Can be ModelManager or CloudModelManager
        batch_size: int = 8,
        max_batch_delay_ms: int = 50
    ):
        self.model_manager = model_manager
        self.batch_size = batch_size
        self.max_batch_delay_ms = max_batch_delay_ms
        
        # Batch queue
        self.pending_requests: List[Dict] = []
        self.batch_lock = asyncio.Lock()
        
        # Check if using cloud models
        self.is_cloud = hasattr(model_manager, 'ai_provider')
        
    async def generate(
        self,
        prompt: str,
        context: Dict,
        max_tokens: int = 512,
        temperature: float = 0.7,
        streaming: bool = False
    ) -> Dict:
        """
        Generate response with support for both local and cloud models
        """
        start_time = time.time()
        
        try:
            # If using cloud models, delegate to cloud model manager
            if self.is_cloud:
                return await self.model_manager.generate(
                    prompt=prompt,
                    context=context,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
            
            # Otherwise use local HuggingFace model
            return await self._generate_local(
                prompt=prompt,
                context=context,
                max_tokens=max_tokens,
                temperature=temperature
            )
            
        except Exception as e:
            raise Exception(f"Inference failed: {str(e)}")
    
    async def _generate_local(
        self,
        prompt: str,
        context: Dict,
        max_tokens: int,
        temperature: float
    ) -> Dict:
        """Generate using local HuggingFace models"""
        import torch
        
        start_time = time.time()
        
        try:
            # Get active model and tokenizer
            model, tokenizer = self.model_manager.get_active_model()
            model_name = self.model_manager.get_active_model_name()
            
            # Build complete prompt with context
            full_prompt = self._build_prompt(prompt, context)
            
            # Tokenize input
            inputs = tokenizer(
                full_prompt,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=2048
            )
            
            # Move to device
            device = next(model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    temperature=temperature,
                    do_sample=temperature > 0,
                    top_p=0.95,
                    top_k=50,
                    repetition_penalty=1.1,
                    pad_token_id=tokenizer.pad_token_id,
                    eos_token_id=tokenizer.eos_token_id
                )
            
            # Decode response
            generated_text = tokenizer.decode(
                outputs[0],
                skip_special_tokens=True
            )
            
            # Extract only the generated part
            response_text = generated_text[len(full_prompt):].strip()
            
            # Calculate metrics
            inference_time = time.time() - start_time
            tokens_generated = len(outputs[0]) - len(inputs["input_ids"][0])
            
            # Record metrics
            self.model_manager.record_request(
                model_name=model_name,
                latency=inference_time,
                tokens=tokens_generated,
                error=False
            )
            
            return {
                "response": response_text,
                "model_used": model_name,
                "tokens_generated": int(tokens_generated),
                "inference_time": inference_time,
                "cache_hit": False
            }
            
        except Exception as e:
            # Record error
            self.model_manager.record_request(
                model_name=self.model_manager.get_active_model_name(),
                latency=time.time() - start_time,
                tokens=0,
                error=True
            )
            raise Exception(f"Local inference failed: {str(e)}")
    
    def _build_prompt(self, prompt: str, context: Dict) -> str:
        """
        Build comprehensive prompt with context
        Following prompt engineering best practices
        """
        # Extract context information
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
        
        # Add accommodations
        if accommodations:
            if accommodations.get("response_length") == "short":
                system_parts.append(
                    "Keep responses concise and to the point."
                )
            if accommodations.get("structure") == "bullet_points":
                system_parts.append(
                    "Use bullet points and clear structure."
                )
            if accommodations.get("simplified_language"):
                system_parts.append(
                    "Use simple, clear language."
                )
            if accommodations.get("tone") == "calm":
                system_parts.append(
                    "Maintain a calm, reassuring tone."
                )
        
        # Add curriculum context if available
        curriculum_context = context.get("curriculum_context")
        if curriculum_context:
            system_parts.append(
                f"Focus on these learning objectives: "
                f"{curriculum_context.get('objectives', '')}"
            )
        
        system_message = " ".join(system_parts)
        
        # Build final prompt
        full_prompt = f"{system_message}\n\nStudent Question: {prompt}\n\nAIVO Response:"
        
        return full_prompt
    
    async def health_check(self) -> bool:
        """Check if inference engine is healthy"""
        try:
            # Try a simple generation
            test_result = await self.generate(
                prompt="Hello",
                context={
                    "grade_level": "5",
                    "subject": "General",
                    "learning_style": "visual"
                },
                max_tokens=10,
                temperature=0.5
            )
            
            return bool(test_result.get("response"))
            
        except Exception as e:
            print(f"Inference engine health check failed: {e}")
            return False
