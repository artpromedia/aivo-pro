"""Progress Analysis for IEP Goals"""

from typing import Dict, List
from datetime import datetime
import numpy as np
from scipy import stats


class ProgressAnalyzer:
    """Analyze student progress on IEP goals"""
    
    def analyze_progress(self, data_points: List[Dict]) -> Dict:
        """Analyze progress trend"""
        
        if len(data_points) < 2:
            return {
                "trend": "insufficient_data",
                "confidence": 0.0,
                "projected_outcome": "unknown"
            }
        
        # Extract values and dates
        values = [dp["value"] for dp in data_points]
        dates = [
            datetime.fromisoformat(dp["date"]) 
            if isinstance(dp["date"], str)
            else dp["date"]
            for dp in data_points
        ]
        
        # Convert to numeric
        x = np.array([(d - dates[0]).days for d in dates])
        y = np.array(values)
        
        # Linear regression
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        
        # Determine trend
        if slope > 0.5:
            trend = "accelerated"
        elif slope > 0.1:
            trend = "on_track"
        elif slope > -0.1:
            trend = "slow"
        else:
            trend = "declining"
        
        # Calculate confidence
        confidence = abs(r_value)
        
        return {
            "trend": trend,
            "slope": float(slope),
            "confidence": float(confidence),
            "r_squared": float(r_value ** 2),
            "p_value": float(p_value),
            "projected_outcome": self._project_outcome(slope, values[-1])
        }
    
    def _project_outcome(self, slope: float, current: float) -> str:
        """Project if goal will be met"""
        
        # Simplified projection
        if slope > 0.3 and current > 50:
            return "likely_to_meet"
        elif slope > 0:
            return "possible_to_meet"
        else:
            return "unlikely_to_meet"
    
    def calculate_mastery(self, data_points: List[Dict], target: float) -> float:
        """Calculate current mastery level"""
        
        if not data_points:
            return 0.0
        
        recent_values = [dp["value"] for dp in data_points[-3:]]
        avg = sum(recent_values) / len(recent_values)
        
        return min(avg / target, 1.0) if target > 0 else 0.0
    
    def generate_alerts(
        self,
        progress_data: Dict,
        threshold_regression: float = -0.15,
        threshold_at_risk: float = 0.4
    ) -> List[Dict]:
        """Generate alerts for concerning trends"""
        
        alerts = []
        
        # Check for regression
        if progress_data.get("slope", 0) < threshold_regression:
            alerts.append({
                "type": "regression",
                "severity": "high",
                "message": "Student showing regression in progress"
            })
        
        # Check if at risk
        trend = progress_data.get("trend", "")
        if trend == "declining":
            alerts.append({
                "type": "at_risk",
                "severity": "high",
                "message": "Student at risk of not meeting goal"
            })
        elif trend == "slow":
            alerts.append({
                "type": "at_risk",
                "severity": "medium",
                "message": "Progress slower than expected"
            })
        
        return alerts
