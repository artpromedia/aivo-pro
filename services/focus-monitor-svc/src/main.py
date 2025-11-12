"""
Focus Monitor & Game Generation Service
Real-time attention tracking with educational game interventions
Author: Principal Engineer (ex-Microsoft Gaming/Education)
"""

import json
import random
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict

import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
from prometheus_client import Counter, Histogram

# Metrics
focus_events_total = Counter('focus_events_total', 'Total focus events', ['event_type'])
distraction_detected = Counter('distraction_detected_total', 'Distractions detected')
games_generated = Counter('games_generated_total', 'Games generated', ['game_type'])
reengagement_success = Histogram('reengagement_success_rate', 'Re-engagement success')

# Pydantic models
class TrackFocusRequest(BaseModel):
    session_id: str
    child_id: str
    event_type: str
    event_data: Dict
    grade_band: str = Field(default="3-5")


class CompleteGameRequest(BaseModel):
    score: int = Field(ge=0, le=100)
    time_taken: float = Field(ge=0)
    completed: bool


# Application
app = FastAPI(
    title="Focus Monitor & Game Service",
    version="1.0.0",
    description="Attention tracking with educational games"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

redis_client: Optional[redis.Redis] = None


class AttentionMonitor:
    """Real-time attention monitoring"""
    
    def __init__(self):
        self.thresholds = {
            "idle_threshold_ms": 30000,
            "rapid_clicking_threshold": 10,
            "tab_switch_threshold": 3,
            "scroll_velocity_threshold": 500,
            "focus_score_threshold": 0.4
        }
    
    async def track_event(
        self,
        session_id: str,
        event_type: str,
        event_data: Dict,
        timestamp: datetime
    ) -> Dict:
        """Track focus event and detect distractions"""
        focus_events_total.labels(event_type=event_type).inc()
        
        # Get session state
        session_key = f"focus_session:{session_id}"
        session_data = await redis_client.get(session_key)
        
        if not session_data:
            session_data = {
                "session_id": session_id,
                "events": [],
                "focus_score": 1.0,
                "last_activity": timestamp.isoformat(),
                "distraction_count": 0
            }
        else:
            session_data = json.loads(session_data)
        
        # Add event
        session_data["events"].append({
            "type": event_type,
            "data": event_data,
            "timestamp": timestamp.isoformat()
        })
        
        # Keep last 100 events
        if len(session_data["events"]) > 100:
            session_data["events"] = session_data["events"][-100:]
        
        # Analyze attention
        analysis = self._analyze_attention(
            session_data["events"],
            event_type,
            event_data
        )
        
        session_data["focus_score"] = analysis["focus_score"]
        session_data["last_activity"] = timestamp.isoformat()
        
        result = {"distraction_detected": False, "focus_score": analysis["focus_score"]}
        
        # Check for distraction
        if analysis["distracted"]:
            session_data["distraction_count"] += 1
            distraction_detected.inc()
            
            intervention = self._determine_intervention(
                session_data,
                analysis["distraction_type"],
                analysis["severity"]
            )
            
            if intervention:
                result = {
                    "distraction_detected": True,
                    "focus_score": analysis["focus_score"],
                    "intervention": intervention
                }
        
        # Store session
        await redis_client.setex(session_key, 3600, json.dumps(session_data, default=str))
        
        return result
    
    def _analyze_attention(
        self,
        events: List[Dict],
        current_event: str,
        event_data: Dict
    ) -> Dict:
        """Analyze attention patterns"""
        if not events:
            return {"focus_score": 1.0, "distracted": False}
        
        features = self._extract_features(events)
        focus_score = self._calculate_focus_score(features)
        
        distraction_type = None
        severity = "low"
        
        # Check idle
        if current_event == "idle":
            idle_duration = event_data.get("duration_ms", 0)
            if idle_duration > self.thresholds["idle_threshold_ms"]:
                distraction_type = "idle_too_long"
                severity = "high" if idle_duration > 60000 else "medium"
        
        # Check rapid clicking
        elif current_event == "click":
            recent_clicks = [e for e in events[-10:] if e["type"] == "click"]
            if len(recent_clicks) >= self.thresholds["rapid_clicking_threshold"]:
                distraction_type = "rapid_clicking"
                severity = "medium"
        
        # Check tab switching
        elif current_event == "visibility_change":
            recent_switches = [e for e in events[-20:] if e["type"] == "visibility_change"]
            if len(recent_switches) >= self.thresholds["tab_switch_threshold"]:
                distraction_type = "tab_switching"
                severity = "high"
        
        # Low engagement
        if focus_score < self.thresholds["focus_score_threshold"]:
            if not distraction_type:
                distraction_type = "low_engagement"
            severity = "high" if focus_score < 0.2 else "medium"
        
        return {
            "focus_score": focus_score,
            "distracted": distraction_type is not None,
            "distraction_type": distraction_type,
            "severity": severity
        }
    
    def _extract_features(self, events: List[Dict]) -> np.ndarray:
        """Extract attention features"""
        features = []
        
        # Time-based features
        if len(events) > 1:
            time_diffs = []
            for i in range(1, len(events)):
                t1 = datetime.fromisoformat(events[i-1]["timestamp"])
                t2 = datetime.fromisoformat(events[i]["timestamp"])
                time_diffs.append((t2 - t1).total_seconds())
            
            features.extend([
                np.mean(time_diffs) if time_diffs else 0,
                np.std(time_diffs) if time_diffs else 0,
                max(time_diffs) if time_diffs else 0
            ])
        else:
            features.extend([0, 0, 0])
        
        # Event type distribution
        event_counts = defaultdict(int)
        for event in events:
            event_counts[event["type"]] += 1
        
        for event_type in ["click", "scroll", "keypress", "idle", "visibility_change"]:
            features.append(event_counts[event_type] / max(len(events), 1))
        
        # Idle streak
        idle_streak = 0
        for event in reversed(events):
            if event["type"] == "idle":
                idle_streak += 1
            else:
                break
        features.append(idle_streak)
        
        return np.array(features)
    
    def _calculate_focus_score(self, features: np.ndarray) -> float:
        """Calculate focus score from features (simplified ML model)"""
        # Simplified scoring
        avg_time_between = features[0]
        idle_fraction = features[7] if len(features) > 7 else 0
        
        score = 1.0
        
        # Penalize long gaps
        if avg_time_between > 30:
            score -= 0.3
        
        # Penalize high idle
        if idle_fraction > 0.5:
            score -= 0.4
        
        return max(0.0, min(1.0, score))
    
    def _determine_intervention(
        self,
        session_data: Dict,
        distraction_type: str,
        severity: str
    ) -> Optional[Dict]:
        """Determine intervention"""
        # Don't intervene too frequently
        last_intervention = session_data.get("last_intervention_time")
        if last_intervention:
            last_time = datetime.fromisoformat(last_intervention)
            if (datetime.utcnow() - last_time).total_seconds() < 180:
                return None
        
        intervention_map = {
            "idle_too_long": {"high": "game_break", "medium": "gentle_reminder", "low": "subtle_prompt"},
            "rapid_clicking": {"high": "calming_activity", "medium": "help_offer", "low": None},
            "tab_switching": {"high": "refocus_activity", "medium": "gentle_reminder", "low": None},
            "low_engagement": {"high": "game_break", "medium": "change_activity", "low": "encouragement"}
        }
        
        intervention_type = intervention_map.get(distraction_type, {}).get(severity)
        
        if not intervention_type:
            return None
        
        messages = {
            "game_break": "Time for a quick brain break! 🎮",
            "gentle_reminder": "Let's get back to learning! 📚",
            "subtle_prompt": "Need help with something?",
            "calming_activity": "Let's take a deep breath and try again 🌟",
            "help_offer": "Stuck? I'm here to help! 🤝",
            "refocus_activity": "Let's refocus with a quick activity!",
            "change_activity": "How about trying something different?",
            "encouragement": "You're doing great! Keep going! 💪"
        }
        
        return {
            "type": intervention_type,
            "reason": distraction_type,
            "severity": severity,
            "message": messages.get(intervention_type, "Let's continue!")
        }


class GameEngine:
    """Educational game generation"""
    
    def __init__(self):
        self.game_configs = {
            "K-2": {"duration": 60, "difficulty": "easy", "themes": ["animals", "colors"]},
            "3-5": {"duration": 90, "difficulty": "medium", "themes": ["adventure", "space"]},
            "6-8": {"duration": 120, "difficulty": "medium-hard", "themes": ["mystery", "science"]},
            "9-12": {"duration": 180, "difficulty": "hard", "themes": ["strategy", "code"]}
        }
    
    async def generate_game(
        self,
        child_id: str,
        grade_band: str,
        subject: str,
        skill: Optional[str],
        purpose: str
    ) -> Dict:
        """Generate educational game"""
        game_id = str(uuid.uuid4())
        config = self.game_configs.get(grade_band, self.game_configs["3-5"])
        
        # Select game type
        if purpose == "refocus":
            game_type = random.choice(["matching", "sorting", "puzzle"])
        else:
            game_type = "matching"
        
        # Generate content
        game_content = await self._generate_game_content(
            game_type, subject, skill, config["difficulty"], config["themes"][0]
        )
        
        games_generated.labels(game_type=game_type).inc()
        
        return {
            "game_id": game_id,
            "type": game_type,
            "content": game_content,
            "duration": config["duration"],
            "instructions": self._get_instructions(game_type)
        }
    
    async def _generate_game_content(
        self,
        game_type: str,
        subject: str,
        skill: Optional[str],
        difficulty: str,
        theme: str
    ) -> Dict:
        """Generate game content"""
        if game_type == "matching":
            return await self._generate_matching_game(subject, skill, difficulty)
        return {}
    
    async def _generate_matching_game(
        self,
        subject: str,
        skill: Optional[str],
        difficulty: str
    ) -> Dict:
        """Generate matching game"""
        pairs_count = {"easy": 4, "medium": 6, "hard": 8}.get(difficulty, 6)
        
        pairs = []
        if subject == "math":
            for i in range(pairs_count):
                a, b = random.randint(1, 10), random.randint(1, 10)
                pairs.append({"card1": f"{a} + {b}", "card2": str(a + b)})
        else:
            word_pairs = [
                {"card1": "happy", "card2": "joyful"},
                {"card1": "big", "card2": "large"},
                {"card1": "fast", "card2": "quick"}
            ]
            pairs = random.sample(word_pairs, min(pairs_count, len(word_pairs)))
        
        # Shuffle cards
        all_cards = []
        for i, pair in enumerate(pairs):
            all_cards.append({"id": f"a{i}", "content": pair["card1"], "pair_id": i})
            all_cards.append({"id": f"b{i}", "content": pair["card2"], "pair_id": i})
        
        random.shuffle(all_cards)
        
        return {"cards": all_cards, "time_limit": 60}
    
    def _get_instructions(self, game_type: str) -> str:
        """Get game instructions"""
        instructions = {
            "matching": "Match the pairs by clicking on cards!",
            "sorting": "Sort items into the correct categories!",
            "puzzle": "Complete the puzzle by dragging pieces!"
        }
        return instructions.get(game_type, "Complete the game!")
    
    async def complete_game(
        self,
        game_id: str,
        score: int,
        time_taken: float,
        completed: bool,
        expected_duration: int = 60
    ) -> Dict:
        """Process game completion"""
        reengagement_score = self._calculate_reengagement(
            score, time_taken, completed, expected_duration
        )
        
        reengagement_success.observe(reengagement_score)
        
        reward = None
        if completed and reengagement_score > 0.7:
            reward = {
                "type": "achievement",
                "message": "Great job refocusing! 🌟",
                "points": int(score * 10)
            }
        
        return {
            "game_id": game_id,
            "completed": completed,
            "score": score,
            "reengagement_success": reengagement_score > 0.5,
            "reward": reward
        }
    
    def _calculate_reengagement(
        self,
        score: int,
        time_taken: float,
        completed: bool,
        expected_duration: int
    ) -> float:
        """Calculate reengagement success"""
        if not completed:
            return 0.0
        
        score_component = min(score / 100, 1.0) * 0.5
        
        if time_taken < expected_duration * 0.5:
            time_component = 0.1
        elif time_taken < expected_duration * 1.5:
            time_component = 0.3
        else:
            time_component = 0.2
        
        return score_component + time_component + 0.2


# Global instances
attention_monitor = AttentionMonitor()
game_engine = GameEngine()


@app.on_event("startup")
async def startup():
    """Initialize service"""
    global redis_client
    redis_client = await redis.from_url("redis://localhost:6379/3", max_connections=50)
    print("✅ Focus Monitor Service started")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup"""
    if redis_client:
        await redis_client.close()


@app.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "service": "focus-monitor", "version": "1.0.0"}


@app.post("/v1/focus/track")
async def track_focus(request: TrackFocusRequest):
    """Track focus events"""
    result = await attention_monitor.track_event(
        session_id=request.session_id,
        event_type=request.event_type,
        event_data=request.event_data,
        timestamp=datetime.utcnow()
    )
    
    # Handle intervention
    if result.get("distraction_detected") and result.get("intervention"):
        intervention_type = result["intervention"]["type"]
        
        if intervention_type == "game_break":
            game = await game_engine.generate_game(
                child_id=request.child_id,
                grade_band=request.grade_band,
                subject="general",
                skill=None,
                purpose="refocus"
            )
            result["intervention_action"] = {"intervention": "game", "game": game}
        elif intervention_type == "gentle_reminder":
            result["intervention_action"] = {
                "intervention": "reminder",
                "message": "Let's get back to learning!",
                "animation": "gentle_pulse"
            }
        else:
            result["intervention_action"] = {
                "intervention": "continue",
                "message": "Keep going!"
            }
    
    return result


@app.post("/v1/focus/game/{game_id}/complete")
async def complete_game(game_id: str, request: CompleteGameRequest):
    """Complete game"""
    return await game_engine.complete_game(
        game_id=game_id,
        score=request.score,
        time_taken=request.time_taken,
        completed=request.completed
    )


@app.websocket("/v1/focus/ws/{session_id}")
async def websocket_focus(websocket: WebSocket, session_id: str):
    """WebSocket for real-time focus"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            
            result = await attention_monitor.track_event(
                session_id=session_id,
                event_type=data["type"],
                event_data=data["data"],
                timestamp=datetime.fromisoformat(data["timestamp"])
            )
            
            await websocket.send_json(result)
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {session_id}")
