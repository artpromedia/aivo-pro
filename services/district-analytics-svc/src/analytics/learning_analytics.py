"""Learning analytics engine"""

from typing import Dict, List
from datetime import datetime
import statistics


class LearningAnalyticsEngine:
    """Analyze learning performance data"""
    
    def __init__(self):
        pass
    
    async def analyze_learning_data(
        self,
        sessions: List[Dict],
        time_range: Dict
    ) -> Dict:
        """Analyze learning sessions"""
        if not sessions:
            return {}
        
        metrics = {
            "total_sessions": len(sessions),
            "total_time_minutes": sum(s.get("duration_minutes", 0) for s in sessions),
            "average_score": statistics.mean(
                s.get("score", 0) for s in sessions if s.get("score")
            ) if any(s.get("score") for s in sessions) else 0,
            "completion_rate": sum(
                1 for s in sessions if s.get("completed", False)
            ) / len(sessions) if sessions else 0
        }
        
        return metrics
