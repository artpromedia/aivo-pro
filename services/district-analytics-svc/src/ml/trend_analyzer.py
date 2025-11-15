"""Trend analyzer using statistical methods"""

from typing import Dict, List
from datetime import datetime


class TrendAnalyzer:
    """Analyze trends in time series data"""

    def __init__(self):
        self.model = None

    async def load_models(self):
        """Load analysis models"""
        print("✅ Trend analyzer initialized")

    async def analyze_trend(
        self,
        data_points: List[Dict]
    ) -> Dict:
        """Analyze trend direction and strength"""
        if len(data_points) < 2:
            return {"trend": "insufficient_data"}

        # Simple trend analysis
        values = [p["value"] for p in data_points]

        # Calculate simple moving direction
        first_half = sum(values[:len(values)//2]) / (len(values)//2)
        second_half = sum(values[len(values)//2:]) / (len(values) - len(values)//2)

        if second_half > first_half * 1.1:
            direction = "increasing"
        elif second_half < first_half * 0.9:
            direction = "decreasing"
        else:
            direction = "stable"

        return {
            "direction": direction,
            "strength": abs(second_half - first_half) / first_half if first_half > 0 else 0,
            "dates": [p["date"] for p in data_points],
            "values": values
        }
