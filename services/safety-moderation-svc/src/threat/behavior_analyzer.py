"""Behavior analyzer for threat detection"""

from typing import Dict, List
from datetime import datetime, timedelta
import numpy as np


class BehaviorAnalyzer:
    """Analyze user behavior patterns for threats"""
    
    def __init__(self):
        self.risk_indicators = {
            "rapid_friend_requests": 0.3,
            "excessive_messaging": 0.4,
            "contact_outside_platform": 0.7,
            "gift_mentions": 0.5,
            "secret_keeping": 0.8,
            "personal_info_requests": 0.9
        }
    
    async def analyze_interaction(self, interaction_data: Dict) -> Dict:
        """Analyze interaction for suspicious patterns"""
        risk_score = 0.0
        flags = []
        
        # Check message frequency
        if interaction_data.get("messages_sent_today", 0) > 50:
            risk_score += 0.3
            flags.append("high_message_volume")
        
        # Check time patterns (messaging at unusual hours)
        if self._is_unusual_time(interaction_data.get("timestamp")):
            risk_score += 0.2
            flags.append("unusual_hours")
        
        # Check for escalating requests
        if interaction_data.get("personal_info_attempts", 0) > 0:
            risk_score += 0.5
            flags.append("personal_info_requests")
        
        # Check content patterns
        content = interaction_data.get("content", "")
        content_risk = await self._analyze_content_patterns(content)
        risk_score += content_risk["score"]
        flags.extend(content_risk["flags"])
        
        return {
            "risk_score": min(risk_score, 1.0),
            "flags": flags,
            "requires_review": risk_score > 0.5,
            "timestamp": datetime.utcnow()
        }
    
    def _is_unusual_time(self, timestamp: str) -> bool:
        """Check if timestamp is during unusual hours"""
        if not timestamp:
            return False
        
        dt = datetime.fromisoformat(timestamp)
        hour = dt.hour
        
        # Flag if between 10 PM and 6 AM (school night concern)
        return hour >= 22 or hour < 6
    
    async def _analyze_content_patterns(self, content: str) -> Dict:
        """Analyze content for concerning patterns"""
        risk_score = 0.0
        flags = []
        
        content_lower = content.lower()
        
        # Check for grooming indicators
        grooming_phrases = [
            "keep secret",
            "don't tell",
            "special friend",
            "meet privately",
            "send picture"
        ]
        
        for phrase in grooming_phrases:
            if phrase in content_lower:
                risk_score += 0.3
                flags.append(f"grooming_indicator:{phrase}")
        
        # Check for personal info requests
        info_requests = [
            "where do you live",
            "what school",
            "phone number",
            "address",
            "parent's name"
        ]
        
        for request in info_requests:
            if request in content_lower:
                risk_score += 0.4
                flags.append("personal_info_request")
        
        return {
            "score": min(risk_score, 1.0),
            "flags": flags
        }
    
    async def detect_bullying_patterns(
        self,
        user_id: str,
        recent_interactions: List[Dict]
    ) -> Dict:
        """Detect bullying behavior patterns"""
        if not recent_interactions:
            return {"detected": False}
        
        # Analyze for bullying indicators
        negative_count = 0
        target_count = {}
        
        for interaction in recent_interactions:
            # Check sentiment
            if interaction.get("sentiment") == "negative":
                negative_count += 1
            
            # Check if repeatedly targeting same user
            target_id = interaction.get("recipient_id")
            if target_id:
                target_count[target_id] = target_count.get(target_id, 0) + 1
        
        # Check for repeated targeting
        max_target_count = max(target_count.values()) if target_count else 0
        
        if negative_count > 5 and max_target_count > 3:
            return {
                "detected": True,
                "severity": "high",
                "patterns": {
                    "negative_interactions": negative_count,
                    "repeated_targeting": max_target_count
                },
                "recommendation": "immediate_review"
            }
        elif negative_count > 3:
            return {
                "detected": True,
                "severity": "medium",
                "patterns": {"negative_interactions": negative_count},
                "recommendation": "monitor"
            }
        
        return {"detected": False}
