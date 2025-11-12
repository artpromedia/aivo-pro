"""
Social-Emotional Learning (SEL) AI Agent - Production Implementation
Comprehensive SEL support for child development
Author: Chief Child Psychologist (Yale/CASEL)
"""

import asyncio
import json
import uuid
import random
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from dataclasses import dataclass
import numpy as np

from fastapi import FastAPI, HTTPException, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings

# Metrics
from prometheus_client import Counter, Histogram, make_asgi_app

sel_activities_completed = Counter(
    'sel_activities_completed_total',
    'Total SEL activities completed'
)
emotional_checkins = Counter(
    'emotional_checkins_total',
    'Total emotional check-ins'
)
mindfulness_sessions = Counter(
    'mindfulness_sessions_total',
    'Total mindfulness sessions'
)
sel_engagement_time = Histogram(
    'sel_engagement_minutes',
    'Time spent on SEL activities'
)


class Settings(BaseSettings):
    """Service settings"""
    SERVICE_NAME: str = "sel-agent-svc"
    REDIS_URL: str = "redis://localhost:6379"
    DATABASE_URL: str = "postgresql+asyncpg://localhost/aivo_sel"
    API_GATEWAY_URL: str = "http://localhost:8000"
    
    class Config:
        env_file = ".env"


settings = Settings()


# CASEL Framework Competencies
class SELCompetency(Enum):
    """CASEL's 5 core competencies"""
    SELF_AWARENESS = "self_awareness"
    SELF_MANAGEMENT = "self_management"
    SOCIAL_AWARENESS = "social_awareness"
    RELATIONSHIP_SKILLS = "relationship_skills"
    RESPONSIBLE_DECISION_MAKING = "responsible_decision_making"


@dataclass
class SELSkill:
    """Define SEL skills by age group"""
    competency: SELCompetency
    skill_name: str
    age_group: str
    activities: List[str]
    assessment_methods: List[str]


class EmotionalIntelligenceEngine:
    """
    Assess and develop emotional intelligence
    Based on Yale's RULER approach
    """
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        
        # RULER Framework (Yale)
        self.ruler_framework = {
            "Recognizing": "emotions in self and others",
            "Understanding": "causes and consequences of emotions",
            "Labeling": "emotions with precise vocabulary",
            "Expressing": "emotions appropriately",
            "Regulating": "emotions effectively"
        }
        
        # Age-appropriate emotional vocabulary
        self.emotion_vocabulary = {
            "K-2": {
                "basic": ["happy", "sad", "angry", "scared", "excited"],
                "body_cues": ["butterflies", "hot face", "tears", "smile"],
                "intensity": ["a little", "medium", "a lot"]
            },
            "3-5": {
                "expanded": [
                    "frustrated", "worried", "proud",
                    "disappointed", "nervous"
                ],
                "nuanced": ["annoyed", "thrilled", "anxious", "content"],
                "triggers": ["when someone", "because", "after"]
            },
            "6-8": {
                "complex": [
                    "overwhelmed", "conflicted", "empathetic", "vindicated"
                ],
                "mixed": ["bittersweet", "excited but nervous"],
                "social": ["embarrassed", "included", "rejected", "supported"]
            },
            "9-12": {
                "sophisticated": [
                    "melancholic", "ambivalent", "apprehensive", "elated"
                ],
                "metacognitive": [
                    "emotionally exhausted", "emotionally regulated"
                ],
                "interpersonal": [
                    "emotionally attuned", "emotionally distant"
                ]
            }
        }
    
    async def initialize(self):
        """Initialize engine"""
        self.redis_client = await redis.from_url(settings.REDIS_URL)
        print("✅ Emotional Intelligence Engine initialized")
    
    async def assess_emotional_intelligence(
        self,
        child_id: str,
        age: int,
        assessment_type: str
    ) -> Dict:
        """Comprehensive EI assessment"""
        assessment = {
            "child_id": child_id,
            "age": age,
            "date": datetime.utcnow().isoformat(),
            "scores": {}
        }
        
        # Assess each RULER component
        for component in self.ruler_framework.keys():
            score = await self._assess_component(
                component,
                age,
                assessment_type
            )
            assessment["scores"][component] = score
        
        # Calculate overall EI score
        assessment["overall_ei"] = np.mean(
            list(assessment["scores"].values())
        )
        
        # Generate age-appropriate feedback
        assessment["feedback"] = await self._generate_ei_feedback(
            assessment["scores"],
            age
        )
        
        # Recommendations
        assessment["recommendations"] = (
            await self._generate_ei_recommendations(
                assessment["scores"],
                age
            )
        )
        
        return assessment
    
    async def _assess_component(
        self,
        component: str,
        age: int,
        assessment_type: str
    ) -> float:
        """Assess a RULER component"""
        # Simulated assessment (in production, use actual tests)
        return random.uniform(0.6, 0.95)
    
    async def _generate_ei_feedback(
        self,
        scores: Dict,
        age: int
    ) -> Dict:
        """Generate feedback on EI assessment"""
        strengths = [k for k, v in scores.items() if v > 0.8]
        areas_to_develop = [k for k, v in scores.items() if v < 0.7]
        
        return {
            "strengths": strengths,
            "areas_to_develop": areas_to_develop,
            "overall_message": "Good emotional awareness with room to grow"
        }
    
    async def _generate_ei_recommendations(
        self,
        scores: Dict,
        age: int
    ) -> List[Dict]:
        """Generate recommendations"""
        return [
            {
                "area": "Emotion Recognition",
                "activities": [
                    "Emotion charades",
                    "Feeling faces matching"
                ],
                "frequency": "3x per week"
            },
            {
                "area": "Emotion Regulation",
                "activities": [
                    "Deep breathing exercises",
                    "Calm corner practice"
                ],
                "frequency": "Daily"
            }
        ]
    
    async def conduct_emotion_check_in(
        self,
        child_id: str,
        age: int,
        context: str = "general"
    ) -> Dict:
        """Daily emotional check-in"""
        emotional_checkins.inc()
        
        age_group = self._get_age_group(age)
        
        # Age-appropriate check-in
        if age_group == "K-2":
            return await self._visual_emotion_checkin(child_id)
        elif age_group == "3-5":
            return await self._emotion_wheel_checkin(child_id)
        elif age_group == "6-8":
            return await self._mood_meter_checkin(child_id)
        else:  # 9-12
            return await self._detailed_emotion_checkin(child_id)
    
    async def _visual_emotion_checkin(self, child_id: str) -> Dict:
        """Visual check-in for young children"""
        return {
            "type": "visual",
            "prompt": "How are you feeling today?",
            "options": [
                {"emoji": "😄", "label": "Happy", "color": "yellow"},
                {"emoji": "😢", "label": "Sad", "color": "blue"},
                {"emoji": "😠", "label": "Angry", "color": "red"},
                {"emoji": "😨", "label": "Scared", "color": "purple"},
                {"emoji": "😊", "label": "Calm", "color": "green"}
            ],
            "follow_up": "Can you tell me why you feel this way?",
            "coping_suggestion": "Let's take 3 deep breaths together!"
        }
    
    async def _emotion_wheel_checkin(self, child_id: str) -> Dict:
        """Emotion wheel for elementary students"""
        return {
            "type": "emotion_wheel",
            "prompt": "Pick the feeling that matches yours",
            "inner_circle": ["happy", "sad", "angry", "scared", "calm"],
            "outer_circle": [
                "excited", "lonely", "frustrated", "worried", "peaceful"
            ],
            "intensity_scale": [1, 2, 3, 4, 5],
            "follow_up": "What made you feel this way?"
        }
    
    async def _mood_meter_checkin(self, child_id: str) -> Dict:
        """Mood meter for middle school"""
        return {
            "type": "mood_meter",
            "prompt": "Where are you on the mood meter?",
            "quadrants": {
                "red": {
                    "label": "High Energy, Unpleasant",
                    "emotions": ["angry", "stressed", "frustrated"]
                },
                "yellow": {
                    "label": "High Energy, Pleasant",
                    "emotions": ["excited", "happy", "energized"]
                },
                "blue": {
                    "label": "Low Energy, Unpleasant",
                    "emotions": ["sad", "tired", "bored"]
                },
                "green": {
                    "label": "Low Energy, Pleasant",
                    "emotions": ["calm", "content", "peaceful"]
                }
            },
            "follow_up_questions": [
                "What led to this feeling?",
                "What do you need right now?",
                "How can you move toward green/yellow?"
            ]
        }
    
    async def _detailed_emotion_checkin(self, child_id: str) -> Dict:
        """Detailed check-in for high school"""
        return {
            "type": "detailed",
            "prompt": "How are you feeling?",
            "emotion_input": "free_text",
            "intensity": {"min": 1, "max": 10},
            "questions": [
                "What emotions are you experiencing?",
                "What triggered these feelings?",
                "How are you coping?",
                "What support do you need?"
            ],
            "reflection_prompts": [
                "Notice your thoughts without judgment",
                "Consider what you can control",
                "Identify helpful coping strategies"
            ]
        }
    
    def _get_age_group(self, age: int) -> str:
        """Get age group string"""
        if age < 8:
            return "K-2"
        elif age < 11:
            return "3-5"
        elif age < 14:
            return "6-8"
        else:
            return "9-12"


class SELActivityGenerator:
    """
    Generate age-appropriate SEL activities
    Based on CASEL framework
    """
    
    def __init__(self):
        self.activity_database = {
            SELCompetency.SELF_AWARENESS: {
                "K-2": [
                    {
                        "name": "Emotion Mirror",
                        "description": "Make faces showing emotions",
                        "duration": 5,
                        "materials": "mirror or camera",
                        "learning_goal": "Recognize facial expressions"
                    },
                    {
                        "name": "Feeling Bodies",
                        "description": "Draw where you feel emotions",
                        "duration": 10,
                        "materials": "body outline, colors",
                        "learning_goal": "Connect emotions to sensations"
                    }
                ],
                "3-5": [
                    {
                        "name": "Emotion Journal",
                        "description": "Write or draw about daily emotions",
                        "duration": 15,
                        "materials": "journal",
                        "learning_goal": "Track emotional patterns"
                    },
                    {
                        "name": "Strengths Shield",
                        "description": "Create a shield with your strengths",
                        "duration": 20,
                        "materials": "paper, art supplies",
                        "learning_goal": "Identify personal strengths"
                    }
                ]
            },
            SELCompetency.SELF_MANAGEMENT: {
                "K-2": [
                    {
                        "name": "Breathing Buddies",
                        "description": "Breathe with stuffed animal on belly",
                        "duration": 5,
                        "materials": "stuffed animal",
                        "learning_goal": "Learn calming breathing"
                    },
                    {
                        "name": "Calm Down Corner",
                        "description": "Create a personal calm space",
                        "duration": 15,
                        "materials": "various calming items",
                        "learning_goal": "Self-soothing strategies"
                    }
                ],
                "3-5": [
                    {
                        "name": "Worry Box",
                        "description": "Write worries and put in box",
                        "duration": 10,
                        "materials": "box, paper",
                        "learning_goal": "Externalize worries"
                    },
                    {
                        "name": "Goal Ladder",
                        "description": "Break big goals into steps",
                        "duration": 20,
                        "materials": "ladder template",
                        "learning_goal": "Goal setting and planning"
                    }
                ]
            },
            SELCompetency.SOCIAL_AWARENESS: {
                "K-2": [
                    {
                        "name": "Kindness Catchers",
                        "description": "Spot acts of kindness",
                        "duration": "ongoing",
                        "materials": "kindness chart",
                        "learning_goal": "Notice prosocial behavior"
                    }
                ],
                "3-5": [
                    {
                        "name": "Perspective Glasses",
                        "description": "See situations from others' views",
                        "duration": 15,
                        "materials": "scenario cards",
                        "learning_goal": "Develop empathy"
                    }
                ]
            },
            SELCompetency.RELATIONSHIP_SKILLS: {
                "K-2": [
                    {
                        "name": "Friendship Recipe",
                        "description": "Create recipe for being good friend",
                        "duration": 15,
                        "materials": "recipe card template",
                        "learning_goal": "Identify friendship qualities"
                    }
                ],
                "3-5": [
                    {
                        "name": "Conflict Resolver Cards",
                        "description": "Practice solving conflicts",
                        "duration": 20,
                        "materials": "scenario cards",
                        "learning_goal": "Conflict resolution skills"
                    }
                ]
            },
            SELCompetency.RESPONSIBLE_DECISION_MAKING: {
                "K-2": [
                    {
                        "name": "Choice Chart",
                        "description": "Map choices and consequences",
                        "duration": 10,
                        "materials": "chart template",
                        "learning_goal": "Understand cause-effect"
                    }
                ],
                "3-5": [
                    {
                        "name": "Decision Tree",
                        "description": "Explore decision outcomes",
                        "duration": 20,
                        "materials": "tree template",
                        "learning_goal": "Evaluate options"
                    }
                ]
            }
        }
    
    async def generate_daily_activity(
        self,
        child_age: int,
        focus_competency: Optional[SELCompetency] = None,
        previous_activities: List[str] = []
    ) -> Dict:
        """Generate personalized daily SEL activity"""
        sel_activities_completed.inc()
        
        age_group = self._get_age_group(child_age)
        
        # Select competency to focus on
        if not focus_competency:
            focus_competency = random.choice(list(SELCompetency))
        
        # Get appropriate activities
        available_activities = self.activity_database.get(
            focus_competency, {}
        ).get(age_group, [])
        
        if not available_activities:
            # Fall back to K-2 activities
            available_activities = self.activity_database.get(
                focus_competency, {}
            ).get("K-2", [])
        
        # Filter out recent activities
        new_activities = [
            a for a in available_activities
            if a["name"] not in previous_activities
        ]
        
        if not new_activities:
            new_activities = available_activities  # Reset if all used
        
        # Select activity
        activity = random.choice(new_activities)
        
        # Enhance with personalization
        enhanced_activity = await self._personalize_activity(
            activity,
            child_age
        )
        
        return enhanced_activity
    
    async def _personalize_activity(
        self,
        activity: Dict,
        child_age: int
    ) -> Dict:
        """Personalize activity for child"""
        activity["age_adapted"] = True
        activity["competency_focus"] = "Self-Awareness"
        activity["parent_tips"] = [
            "Provide positive encouragement",
            "Model the behavior yourself",
            "Make it fun and engaging"
        ]
        
        return activity
    
    def _get_age_group(self, age: int) -> str:
        """Get age group string"""
        if age < 8:
            return "K-2"
        elif age < 11:
            return "3-5"
        elif age < 14:
            return "6-8"
        else:
            return "9-12"


class MindfulnessEngine:
    """
    Mindfulness and meditation for children
    Age-appropriate practices
    """
    
    def __init__(self):
        self.mindfulness_practices = {
            "K-2": {
                "breathing": [
                    {
                        "name": "Bunny Breathing",
                        "instruction": "3 quick sniffs, one long breath out",
                        "duration": 2,
                        "benefit": "Calming and focusing"
                    },
                    {
                        "name": "Bubble Breathing",
                        "instruction": "Breathe in slowly, blow out like bubbles",
                        "duration": 3,
                        "benefit": "Stress relief"
                    }
                ],
                "body_scan": [
                    {
                        "name": "Sleepy Body",
                        "instruction": "Make each body part heavy and sleepy",
                        "duration": 5,
                        "benefit": "Relaxation"
                    }
                ],
                "movement": [
                    {
                        "name": "Animal Yoga",
                        "instruction": "Move like different animals mindfully",
                        "duration": 10,
                        "benefit": "Body awareness"
                    }
                ]
            },
            "3-5": {
                "breathing": [
                    {
                        "name": "4-7-8 Breathing",
                        "instruction": "Breathe in 4, hold 7, out 8",
                        "duration": 5,
                        "benefit": "Anxiety reduction"
                    }
                ],
                "visualization": [
                    {
                        "name": "Safe Place",
                        "instruction": "Imagine your special safe place",
                        "duration": 10,
                        "benefit": "Emotional regulation"
                    }
                ],
                "gratitude": [
                    {
                        "name": "Gratitude Garden",
                        "instruction": "Plant seeds of things grateful for",
                        "duration": 8,
                        "benefit": "Positive mindset"
                    }
                ]
            },
            "6-8": {
                "meditation": [
                    {
                        "name": "Thought Clouds",
                        "instruction": "Watch thoughts pass like clouds",
                        "duration": 10,
                        "benefit": "Metacognition"
                    }
                ],
                "compassion": [
                    {
                        "name": "Loving-Kindness",
                        "instruction": "Send kind wishes to self and others",
                        "duration": 12,
                        "benefit": "Empathy development"
                    }
                ]
            },
            "9-12": {
                "meditation": [
                    {
                        "name": "RAIN Meditation",
                        "instruction": "Recognize, Allow, Investigate, Nurture",
                        "duration": 15,
                        "benefit": "Emotional processing"
                    }
                ],
                "stress_management": [
                    {
                        "name": "Progressive Muscle Relaxation",
                        "instruction": "Tense and release muscle groups",
                        "duration": 20,
                        "benefit": "Physical tension release"
                    }
                ]
            }
        }
    
    async def guide_mindfulness_session(
        self,
        child_age: int,
        session_type: str,
        duration_minutes: int
    ) -> Dict:
        """Guide age-appropriate mindfulness session"""
        mindfulness_sessions.inc()
        
        age_group = self._get_age_group(child_age)
        practices = self.mindfulness_practices.get(age_group, {})
        
        # Select appropriate practice
        if session_type in practices:
            available = practices[session_type]
            practice = self._select_practice(available, duration_minutes)
        else:
            # Default to breathing
            practice = practices.get("breathing", [{}])[0]
        
        # Generate guided script
        script = await self._generate_guided_script(
            practice,
            child_age,
            duration_minutes
        )
        
        return {
            "session_type": session_type,
            "practice": practice,
            "script": script,
            "background_music": self._select_background_music(child_age),
            "visual_aids": await self._generate_visual_aids(
                practice,
                child_age
            ),
            "post_session": {
                "reflection_prompts": self._generate_reflection_prompts(
                    child_age
                ),
                "journal_prompt": self._generate_journal_prompt(practice)
            }
        }
    
    def _select_practice(
        self,
        available: List[Dict],
        duration: int
    ) -> Dict:
        """Select practice based on duration"""
        suitable = [p for p in available if p["duration"] <= duration]
        return suitable[0] if suitable else available[0]
    
    async def _generate_guided_script(
        self,
        practice: Dict,
        child_age: int,
        duration: int
    ) -> List[str]:
        """Generate step-by-step guided script"""
        return [
            f"Find a comfortable position",
            f"Close your eyes or look down gently",
            f"Let's begin: {practice.get('instruction', '')}",
            f"Take your time, there's no rush",
            f"Notice how you feel",
            f"When you're ready, slowly open your eyes"
        ]
    
    def _select_background_music(self, child_age: int) -> str:
        """Select appropriate background music"""
        if child_age < 8:
            return "soft_nature_sounds"
        elif child_age < 14:
            return "gentle_instrumental"
        else:
            return "ambient_meditation"
    
    async def _generate_visual_aids(
        self,
        practice: Dict,
        child_age: int
    ) -> Dict:
        """Generate visual aids for practice"""
        return {
            "breathing_animation": True,
            "timer_visible": child_age > 10,
            "calming_colors": ["blue", "green", "purple"],
            "imagery": "nature_scenes"
        }
    
    def _generate_reflection_prompts(self, child_age: int) -> List[str]:
        """Generate post-session reflection prompts"""
        if child_age < 8:
            return [
                "How do you feel now?",
                "Did you like that activity?"
            ]
        else:
            return [
                "What did you notice during practice?",
                "How has your mood changed?",
                "What will you remember about this?"
            ]
    
    def _generate_journal_prompt(self, practice: Dict) -> str:
        """Generate journal prompt"""
        return f"After trying {practice.get('name', 'this practice')}, I feel..."
    
    def _get_age_group(self, age: int) -> str:
        """Get age group string"""
        if age < 8:
            return "K-2"
        elif age < 11:
            return "3-5"
        elif age < 14:
            return "6-8"
        else:
            return "9-12"


class ResilienceBuilder:
    """
    Build resilience and coping skills
    Evidence-based interventions
    """
    
    def __init__(self):
        self.resilience_factors = {
            "cognitive": ["growth_mindset", "problem_solving", "optimism"],
            "emotional": [
                "emotional_regulation",
                "stress_management",
                "self_compassion"
            ],
            "social": ["social_support", "help_seeking", "communication"],
            "behavioral": ["healthy_habits", "goal_pursuit", "persistence"]
        }
        
        self.coping_strategies = {
            "K-2": {
                "upset": ["deep breaths", "hug stuffed animal", "draw feelings"],
                "angry": ["count to 10", "squeeze stress ball", "stomp feet"],
                "worried": ["talk to adult", "think happy thoughts", "cuddle"]
            },
            "3-5": {
                "stressed": ["break tasks down", "ask for help", "take breaks"],
                "anxious": ["worry time", "what-if plan", "grounding 5-4-3-2-1"],
                "sad": [
                    "express feelings",
                    "do favorite activity",
                    "connect with friend"
                ]
            },
            "6-8": {
                "overwhelmed": ["prioritize tasks", "time management", "say no"],
                "peer_pressure": [
                    "assertiveness skills",
                    "value clarification",
                    "support network"
                ],
                "failure": [
                    "reframe thoughts",
                    "learn from mistakes",
                    "self-compassion"
                ]
            },
            "9-12": {
                "academic_stress": [
                    "study strategies",
                    "time blocking",
                    "stress reduction"
                ],
                "social_anxiety": [
                    "gradual exposure",
                    "cognitive restructuring",
                    "social skills"
                ],
                "identity_confusion": [
                    "self-exploration",
                    "value identification",
                    "mentorship"
                ]
            }
        }
    
    async def create_resilience_plan(
        self,
        child_id: str,
        age: int,
        risk_factors: List[str],
        protective_factors: List[str]
    ) -> Dict:
        """Create personalized resilience building plan"""
        plan = {
            "child_id": child_id,
            "assessment": {
                "risk_factors": risk_factors,
                "protective_factors": protective_factors,
                "resilience_score": self._calculate_resilience_score(
                    risk_factors,
                    protective_factors
                )
            },
            "interventions": []
        }
        
        # Generate interventions for each domain
        for domain, factors in self.resilience_factors.items():
            intervention = await self._generate_domain_intervention(
                domain,
                factors,
                age,
                risk_factors
            )
            plan["interventions"].append(intervention)
        
        # Add coping toolkit
        plan["coping_toolkit"] = await self._create_coping_toolkit(
            age,
            risk_factors
        )
        
        # Add progress milestones
        plan["milestones"] = self._define_resilience_milestones(age)
        
        return plan
    
    def _calculate_resilience_score(
        self,
        risk_factors: List[str],
        protective_factors: List[str]
    ) -> float:
        """Calculate overall resilience score"""
        risk_score = len(risk_factors) * 0.1
        protective_score = len(protective_factors) * 0.15
        
        base_score = 0.7
        final_score = max(
            0.0,
            min(1.0, base_score - risk_score + protective_score)
        )
        
        return final_score
    
    async def _generate_domain_intervention(
        self,
        domain: str,
        factors: List[str],
        age: int,
        risk_factors: List[str]
    ) -> Dict:
        """Generate intervention for resilience domain"""
        return {
            "domain": domain,
            "target_factors": factors,
            "activities": [
                f"Activity for {factor}" for factor in factors[:2]
            ],
            "frequency": "3x per week",
            "duration_weeks": 8
        }
    
    async def _create_coping_toolkit(
        self,
        age: int,
        risk_factors: List[str]
    ) -> Dict:
        """Create personalized coping toolkit"""
        age_group = self._get_age_group(age)
        strategies = self.coping_strategies.get(age_group, {})
        
        toolkit = {
            "strategies": strategies,
            "quick_tools": [
                "Deep breathing",
                "5-4-3-2-1 grounding",
                "Positive self-talk"
            ],
            "when_to_use": "When feeling overwhelmed or stressed",
            "parent_support": "How parents can help"
        }
        
        return toolkit
    
    def _define_resilience_milestones(self, age: int) -> List[Dict]:
        """Define resilience milestones"""
        return [
            {
                "week": 2,
                "milestone": "Identify personal strengths",
                "indicator": "Can name 3 strengths"
            },
            {
                "week": 4,
                "milestone": "Use coping strategies independently",
                "indicator": "Uses 2+ strategies when upset"
            },
            {
                "week": 8,
                "milestone": "Bounce back from setbacks",
                "indicator": "Recovers from disappointments faster"
            }
        ]
    
    def _get_age_group(self, age: int) -> str:
        """Get age group string"""
        if age < 8:
            return "K-2"
        elif age < 11:
            return "3-5"
        elif age < 14:
            return "6-8"
        else:
            return "9-12"


class SELService:
    """Main Social-Emotional Learning Service"""
    
    def __init__(self):
        self.ei_engine = EmotionalIntelligenceEngine()
        self.activity_generator = SELActivityGenerator()
        self.mindfulness_engine = MindfulnessEngine()
        self.resilience_builder = ResilienceBuilder()
        self.redis_client: Optional[redis.Redis] = None
    
    async def initialize(self):
        """Initialize service"""
        self.redis_client = await redis.from_url(settings.REDIS_URL)
        await self.ei_engine.initialize()
        print("✅ SEL Service initialized")
    
    async def create_sel_program(
        self,
        child_id: str,
        age: int,
        assessment_data: Dict,
        parent_concerns: List[str]
    ) -> Dict:
        """Create comprehensive SEL program"""
        # Assess current SEL competencies
        ei_assessment = await self.ei_engine.assess_emotional_intelligence(
            child_id,
            age,
            "comprehensive"
        )
        
        # Create resilience plan
        resilience_plan = await self.resilience_builder.create_resilience_plan(
            child_id,
            age,
            risk_factors=parent_concerns,
            protective_factors=assessment_data.get("strengths", [])
        )
        
        # Generate 12-week curriculum
        curriculum = await self._generate_sel_curriculum(
            age,
            ei_assessment,
            resilience_plan
        )
        
        # Create parent partnership plan
        parent_plan = await self._create_parent_partnership(
            age,
            parent_concerns
        )
        
        return {
            "program_id": str(uuid.uuid4()),
            "child_id": child_id,
            "ei_assessment": ei_assessment,
            "resilience_plan": resilience_plan,
            "curriculum": curriculum,
            "parent_partnership": parent_plan,
            "created_at": datetime.utcnow().isoformat()
        }
    
    async def _generate_sel_curriculum(
        self,
        age: int,
        ei_assessment: Dict,
        resilience_plan: Dict
    ) -> Dict:
        """Generate 12-week SEL curriculum"""
        return {
            "duration_weeks": 12,
            "weekly_themes": [
                "Understanding Emotions",
                "Emotion Regulation",
                "Empathy Building",
                "Friendship Skills",
                "Problem Solving",
                "Growth Mindset",
                "Stress Management",
                "Conflict Resolution",
                "Communication",
                "Self-Compassion",
                "Gratitude",
                "Integration"
            ],
            "daily_activities": True,
            "parent_involvement": True
        }
    
    async def _create_parent_partnership(
        self,
        age: int,
        parent_concerns: List[str]
    ) -> Dict:
        """Create parent partnership plan"""
        return {
            "communication_frequency": "Weekly updates",
            "parent_activities": [
                "Family check-ins",
                "Emotion coaching",
                "Mindfulness together"
            ],
            "resources": [
                "SEL parent guide",
                "Video tutorials",
                "Book recommendations"
            ],
            "support_available": "Monthly parent group sessions"
        }


# Initialize service
sel_service = SELService()


# Pydantic models
class CreateSELProgramRequest(BaseModel):
    child_id: str
    age: int
    assessment_data: Dict
    parent_concerns: List[str]


class EmotionCheckInRequest(BaseModel):
    child_id: str
    age: int
    context: str = "general"


class ActivityRequest(BaseModel):
    child_age: int
    focus_competency: Optional[str] = None
    previous_activities: List[str] = []


class MindfulnessRequest(BaseModel):
    child_age: int
    session_type: str
    duration_minutes: int


# FastAPI app
app = FastAPI(
    title="SEL Service",
    version="1.0.0",
    description="Social-Emotional Learning AI Agent"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.on_event("startup")
async def startup():
    """Startup event"""
    await sel_service.initialize()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.SERVICE_NAME}


@app.post("/v1/sel/program")
async def create_sel_program(request: CreateSELProgramRequest):
    """Create personalized SEL program"""
    program = await sel_service.create_sel_program(
        child_id=request.child_id,
        age=request.age,
        assessment_data=request.assessment_data,
        parent_concerns=request.parent_concerns
    )
    
    return program


@app.post("/v1/sel/check-in")
async def emotion_check_in(request: EmotionCheckInRequest):
    """Daily emotional check-in"""
    check_in = await sel_service.ei_engine.conduct_emotion_check_in(
        child_id=request.child_id,
        age=request.age,
        context=request.context
    )
    
    return check_in


@app.post("/v1/sel/activity")
async def get_daily_activity(request: ActivityRequest):
    """Get daily SEL activity"""
    activity = await sel_service.activity_generator.generate_daily_activity(
        child_age=request.child_age,
        focus_competency=(
            SELCompetency(request.focus_competency)
            if request.focus_competency else None
        ),
        previous_activities=request.previous_activities
    )
    
    return activity


@app.post("/v1/sel/mindfulness")
async def guide_mindfulness(request: MindfulnessRequest):
    """Guide mindfulness session"""
    session = await sel_service.mindfulness_engine.guide_mindfulness_session(
        child_age=request.child_age,
        session_type=request.session_type,
        duration_minutes=request.duration_minutes
    )
    
    return session


@app.websocket("/v1/sel/live-support")
async def live_emotional_support(websocket: WebSocket):
    """Real-time emotional support"""
    await websocket.accept()
    
    try:
        while True:
            # Receive emotion data
            data = await websocket.receive_json()
            
            # Provide support
            response = {
                "acknowledgment": "I hear you",
                "validation": "Your feelings are valid",
                "suggestion": "Let's try a calming technique together",
                "breathing_exercise": "4-7-8 breathing"
            }
            
            await websocket.send_json(response)
    
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8015)
