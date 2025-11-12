"""Toxicity detection using transformer models"""

from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict
import asyncio


class ToxicityDetector:
    """Detect toxic content using BERT-based models"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.pipeline = None
        self.labels = [
            "toxicity",
            "severe_toxicity",
            "obscene",
            "threat",
            "insult",
            "identity_attack"
        ]
    
    async def load_model(self):
        """Load toxicity detection model"""
        model_name = "unitary/toxic-bert"
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name
        )
        
        device = 0 if torch.cuda.is_available() else -1
        self.pipeline = pipeline(
            "text-classification",
            model=self.model,
            tokenizer=self.tokenizer,
            device=device,
            top_k=None
        )
        
        print("✅ Toxicity detector loaded")
    
    async def predict(self, content: str) -> Dict[str, float]:
        """Predict toxicity scores"""
        if len(content) > 512:
            content = content[:512]
        
        results = await asyncio.to_thread(
            self.pipeline,
            content
        )
        
        scores = {}
        if results and len(results) > 0:
            for item in results[0]:
                label = item["label"].lower()
                scores[label] = item["score"]
        
        # Ensure all expected labels present
        for label in self.labels:
            if label not in scores:
                scores[label] = 0.0
        
        return scores
