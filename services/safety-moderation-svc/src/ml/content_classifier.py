"""Content classifier using ML models"""

from transformers import pipeline
import torch
from typing import Dict, List
import asyncio


class ContentClassifier:
    """Classify content into categories"""

    def __init__(self):
        self.classifier = None
        self.categories = [
            "educational",
            "inappropriate",
            "violent",
            "adult_content",
            "spam",
            "harmful"
        ]

    async def load_models(self):
        """Load ML models"""
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=0 if torch.cuda.is_available() else -1
        )
        print("✅ Content classifier loaded")

    async def classify(self, content: str) -> Dict:
        """Classify content"""
        result = await asyncio.to_thread(
            self.classifier,
            content,
            self.categories,
            multi_label=True
        )

        classifications = {}
        for label, score in zip(result["labels"], result["scores"]):
            classifications[label] = float(score)

        return {
            "classifications": classifications,
            "primary_category": result["labels"][0],
            "confidence": float(result["scores"][0])
        }
