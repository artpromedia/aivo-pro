"""
Adaptive Learning Orchestrator
Intelligent system that analyzes learner performance and makes recommendations
for difficulty adjustments, content suggestions, and personalized learning paths.

This is the brain behind adaptive learning decisions.
"""
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class PerformanceLevel(Enum):
    """Learner performance classification"""
    STRUGGLING = "struggling"           # < 60% accuracy
    DEVELOPING = "developing"           # 60-74% accuracy
    PROFICIENT = "proficient"           # 75-89% accuracy
    MASTERED = "mastered"               # >= 90% accuracy
    ADVANCED = "advanced"               # 95%+ with speed


class RecommendationType(Enum):
    """Types of learning recommendations"""
    LEVEL_UP = "level_up"               # Advance to harder content
    LEVEL_DOWN = "level_down"           # Return to easier content
    MAINTAIN = "maintain"               # Continue current level
    REMEDIATION = "remediation"         # Review fundamentals
    ENRICHMENT = "enrichment"           # Additional challenges
    BREAK = "break"                     # Suggest break/rest
    CHANGE_APPROACH = "change_approach" # Different teaching method


@dataclass
class LearnerMetrics:
    """Real-time learner performance metrics"""
    student_id: str
    subject: str
    skill: str
    
    # Performance metrics
    recent_accuracy: float              # Last 10 attempts
    overall_accuracy: float             # All-time for this skill
    completion_rate: float              # % of assigned tasks done
    average_time_per_task: float        # Seconds
    
    # Engagement metrics
    focus_score: float                  # 0-1, from focus monitor
    session_duration: float             # Minutes in current session
    consecutive_sessions: int           # Days streak
    hint_usage_rate: float              # 0-1, frequency of hints used
    
    # Progress metrics
    current_level: int                  # 1-10 difficulty level
    attempts_at_current_level: int
    successful_at_current_level: int
    time_at_current_level: float        # Days
    
    # Historical data
    last_7_days_accuracy: List[float]
    last_7_days_time: List[float]


@dataclass
class LearningRecommendation:
    """Intelligent recommendation for learner progression"""
    student_id: str
    recommendation_type: RecommendationType
    current_level: int
    recommended_level: int
    confidence: float                   # 0-1, how confident we are
    
    # Explanation
    reasoning: str
    evidence: List[str]
    expected_impact: str
    
    # Action items
    suggested_actions: List[str]
    suggested_content: List[str]
    estimated_time_to_adjustment: str   # e.g., "2-3 sessions"
    
    # Metadata
    created_at: datetime
    priority: str                       # "low", "medium", "high", "urgent"


class AdaptiveLearningOrchestrator:
    """
    Intelligent orchestrator for adaptive learning decisions.
    
    Analyzes learner performance and makes data-driven recommendations
    for content difficulty, learning paths, and interventions.
    """
    
    def __init__(self):
        # Thresholds for performance classification
        self.MASTERY_THRESHOLD = 0.90
        self.PROFICIENCY_THRESHOLD = 0.75
        self.DEVELOPING_THRESHOLD = 0.60
        
        # Progression rules
        self.MIN_ATTEMPTS_BEFORE_LEVEL_UP = 10
        self.MIN_DAYS_AT_LEVEL = 2
        self.CONSECUTIVE_SUCCESS_FOR_LEVEL_UP = 8
        self.CONSECUTIVE_FAILURE_FOR_LEVEL_DOWN = 5
        
        # Focus and engagement thresholds
        self.LOW_FOCUS_THRESHOLD = 0.4
        self.OPTIMAL_SESSION_LENGTH = 25  # minutes
        self.MAX_SESSION_LENGTH = 50
    
    async def analyze_and_recommend(
        self,
        metrics: LearnerMetrics
    ) -> LearningRecommendation:
        """
        Analyze learner metrics and generate intelligent recommendation.
        
        This is the main decision engine.
        """
        logger.info(
            f"Analyzing performance for student {metrics.student_id} "
            f"on {metrics.subject}/{metrics.skill}"
        )
        
        # Step 1: Classify current performance level
        performance_level = self._classify_performance(metrics)
        
        # Step 2: Check for urgent interventions
        urgent_action = self._check_urgent_interventions(metrics)
        if urgent_action:
            return urgent_action
        
        # Step 3: Determine recommendation type
        recommendation_type = self._determine_recommendation(
            metrics, performance_level
        )
        
        # Step 4: Calculate recommended level
        recommended_level = self._calculate_recommended_level(
            metrics, recommendation_type
        )
        
        # Step 5: Generate reasoning and evidence
        reasoning, evidence = self._generate_reasoning(
            metrics, performance_level, recommendation_type
        )
        
        # Step 6: Create actionable suggestions
        suggested_actions = self._generate_actions(
            recommendation_type, metrics
        )
        
        suggested_content = self._suggest_content(
            metrics, recommended_level
        )
        
        # Step 7: Calculate confidence
        confidence = self._calculate_confidence(metrics)
        
        # Step 8: Determine priority
        priority = self._determine_priority(
            recommendation_type, performance_level
        )
        
        recommendation = LearningRecommendation(
            student_id=metrics.student_id,
            recommendation_type=recommendation_type,
            current_level=metrics.current_level,
            recommended_level=recommended_level,
            confidence=confidence,
            reasoning=reasoning,
            evidence=evidence,
            expected_impact=self._describe_expected_impact(
                recommendation_type
            ),
            suggested_actions=suggested_actions,
            suggested_content=suggested_content,
            estimated_time_to_adjustment=self._estimate_adjustment_time(
                metrics, recommendation_type
            ),
            created_at=datetime.utcnow(),
            priority=priority
        )
        
        logger.info(
            f"Generated recommendation: {recommendation_type.value} "
            f"({metrics.current_level} -> {recommended_level}) "
            f"with {confidence:.0%} confidence"
        )
        
        return recommendation
    
    def _classify_performance(
        self, metrics: LearnerMetrics
    ) -> PerformanceLevel:
        """Classify learner's current performance level"""
        accuracy = metrics.recent_accuracy
        speed = metrics.average_time_per_task
        
        # Advanced: High accuracy + fast completion
        if accuracy >= 0.95 and speed < 30:  # 30 seconds
            return PerformanceLevel.ADVANCED
        
        # Mastered: Consistent high accuracy
        elif accuracy >= self.MASTERY_THRESHOLD:
            return PerformanceLevel.MASTERED
        
        # Proficient: Good accuracy
        elif accuracy >= self.PROFICIENCY_THRESHOLD:
            return PerformanceLevel.PROFICIENT
        
        # Developing: Moderate accuracy
        elif accuracy >= self.DEVELOPING_THRESHOLD:
            return PerformanceLevel.DEVELOPING
        
        # Struggling: Low accuracy
        else:
            return PerformanceLevel.STRUGGLING
    
    def _check_urgent_interventions(
        self, metrics: LearnerMetrics
    ) -> Optional[LearningRecommendation]:
        """Check if urgent intervention is needed"""
        
        # Urgent: Very low focus (learner is disengaged)
        if metrics.focus_score < self.LOW_FOCUS_THRESHOLD:
            return LearningRecommendation(
                student_id=metrics.student_id,
                recommendation_type=RecommendationType.BREAK,
                current_level=metrics.current_level,
                recommended_level=metrics.current_level,
                confidence=0.95,
                reasoning="Focus score critically low - immediate break needed",
                evidence=[
                    f"Focus score: {metrics.focus_score:.0%} "
                    f"(threshold: {self.LOW_FOCUS_THRESHOLD:.0%})",
                    f"Session duration: {metrics.session_duration:.0f} min"
                ],
                expected_impact="Restore focus and prevent frustration",
                suggested_actions=[
                    "Take a 10-minute break with physical activity",
                    "Return to easier content after break",
                    "Consider shorter learning sessions"
                ],
                suggested_content=["5-minute movement break video"],
                estimated_time_to_adjustment="Immediate",
                created_at=datetime.utcnow(),
                priority="urgent"
            )
        
        # Urgent: Session too long
        if metrics.session_duration > self.MAX_SESSION_LENGTH:
            return LearningRecommendation(
                student_id=metrics.student_id,
                recommendation_type=RecommendationType.BREAK,
                current_level=metrics.current_level,
                recommended_level=metrics.current_level,
                confidence=0.90,
                reasoning="Session length exceeds optimal learning duration",
                evidence=[
                    f"Current session: {metrics.session_duration:.0f} min",
                    f"Optimal: {self.OPTIMAL_SESSION_LENGTH} min"
                ],
                expected_impact="Prevent cognitive overload",
                suggested_actions=[
                    "End current session",
                    "Schedule next session for tomorrow",
                    "Review today's learning during break"
                ],
                suggested_content=["Session summary review"],
                estimated_time_to_adjustment="Immediate",
                created_at=datetime.utcnow(),
                priority="urgent"
            )
        
        # Urgent: Consecutive failures (frustration risk)
        recent_failures = (
            metrics.attempts_at_current_level -
            metrics.successful_at_current_level
        )
        if recent_failures >= self.CONSECUTIVE_FAILURE_FOR_LEVEL_DOWN:
            return LearningRecommendation(
                student_id=metrics.student_id,
                recommendation_type=RecommendationType.LEVEL_DOWN,
                current_level=metrics.current_level,
                recommended_level=max(1, metrics.current_level - 1),
                confidence=0.92,
                reasoning="Multiple consecutive failures indicate content "
                          "is too challenging",
                evidence=[
                    f"{recent_failures} consecutive failures",
                    f"Accuracy: {metrics.recent_accuracy:.0%}",
                    f"Hint usage: {metrics.hint_usage_rate:.0%}"
                ],
                expected_impact="Rebuild confidence and fill knowledge gaps",
                suggested_actions=[
                    "Return to previous level immediately",
                    "Focus on foundational concepts",
                    "Provide encouraging feedback"
                ],
                suggested_content=[
                    f"Review materials for Level {metrics.current_level - 1}"
                ],
                estimated_time_to_adjustment="1-2 sessions",
                created_at=datetime.utcnow(),
                priority="high"
            )
        
        return None  # No urgent intervention needed
    
    def _determine_recommendation(
        self,
        metrics: LearnerMetrics,
        performance_level: PerformanceLevel
    ) -> RecommendationType:
        """Determine what type of recommendation to make"""
        
        # Check if enough data to make decision
        if metrics.attempts_at_current_level < self.MIN_ATTEMPTS_BEFORE_LEVEL_UP:
            return RecommendationType.MAINTAIN
        
        # Check time at current level
        if metrics.time_at_current_level < self.MIN_DAYS_AT_LEVEL:
            return RecommendationType.MAINTAIN
        
        # Advanced/Mastered: Level up
        if performance_level in [
            PerformanceLevel.ADVANCED,
            PerformanceLevel.MASTERED
        ]:
            consecutive_successes = metrics.successful_at_current_level
            if consecutive_successes >= self.CONSECUTIVE_SUCCESS_FOR_LEVEL_UP:
                return RecommendationType.LEVEL_UP
            else:
                return RecommendationType.ENRICHMENT
        
        # Proficient: Maintain or enrich
        elif performance_level == PerformanceLevel.PROFICIENT:
            # Check trend - improving or stable?
            if self._is_trend_improving(metrics.last_7_days_accuracy):
                return RecommendationType.ENRICHMENT
            else:
                return RecommendationType.MAINTAIN
        
        # Developing: Maintain or change approach
        elif performance_level == PerformanceLevel.DEVELOPING:
            # If stuck at this level for too long, change approach
            if metrics.time_at_current_level > 7:  # More than a week
                return RecommendationType.CHANGE_APPROACH
            else:
                return RecommendationType.MAINTAIN
        
        # Struggling: Remediation or level down
        else:  # STRUGGLING
            # If struggling after multiple attempts, level down
            if metrics.attempts_at_current_level > 15:
                return RecommendationType.LEVEL_DOWN
            else:
                return RecommendationType.REMEDIATION
    
    def _calculate_recommended_level(
        self,
        metrics: LearnerMetrics,
        recommendation_type: RecommendationType
    ) -> int:
        """Calculate what level to recommend"""
        current = metrics.current_level
        
        if recommendation_type == RecommendationType.LEVEL_UP:
            # Advance by 1 level (conservative)
            return min(10, current + 1)
        
        elif recommendation_type == RecommendationType.LEVEL_DOWN:
            # Go back 1 level
            return max(1, current - 1)
        
        elif recommendation_type == RecommendationType.REMEDIATION:
            # Go back 2 levels for fundamentals
            return max(1, current - 2)
        
        else:  # MAINTAIN, ENRICHMENT, CHANGE_APPROACH, BREAK
            return current
    
    def _generate_reasoning(
        self,
        metrics: LearnerMetrics,
        performance_level: PerformanceLevel,
        recommendation_type: RecommendationType
    ) -> Tuple[str, List[str]]:
        """Generate human-readable reasoning and evidence"""
        
        reasoning = ""
        evidence = []
        
        if recommendation_type == RecommendationType.LEVEL_UP:
            reasoning = (
                f"Learner has mastered Level {metrics.current_level} content "
                f"with {metrics.recent_accuracy:.0%} accuracy. Ready for "
                f"more challenging material."
            )
            evidence = [
                f"Recent accuracy: {metrics.recent_accuracy:.0%}",
                f"Successful completions: {metrics.successful_at_current_level}"
                f"/{metrics.attempts_at_current_level}",
                f"Time at current level: {metrics.time_at_current_level:.1f} days",
                f"Minimal hint usage: {metrics.hint_usage_rate:.0%}"
            ]
        
        elif recommendation_type == RecommendationType.LEVEL_DOWN:
            reasoning = (
                f"Learner is struggling with Level {metrics.current_level}. "
                f"Returning to Level {metrics.current_level - 1} will "
                f"rebuild confidence and address knowledge gaps."
            )
            evidence = [
                f"Recent accuracy: {metrics.recent_accuracy:.0%}",
                f"High hint usage: {metrics.hint_usage_rate:.0%}",
                f"Slow completion: {metrics.average_time_per_task:.0f}s per task"
            ]
        
        elif recommendation_type == RecommendationType.ENRICHMENT:
            reasoning = (
                f"Learner is performing well at Level {metrics.current_level}. "
                f"Suggest enrichment activities before advancing."
            )
            evidence = [
                f"Consistent accuracy: {metrics.recent_accuracy:.0%}",
                f"Needs more practice for mastery"
            ]
        
        elif recommendation_type == RecommendationType.REMEDIATION:
            reasoning = (
                f"Learner shows gaps in foundational concepts. "
                f"Recommend focused review before continuing."
            )
            evidence = [
                f"Low accuracy: {metrics.recent_accuracy:.0%}",
                f"Multiple attempts: {metrics.attempts_at_current_level}",
                "Foundation concepts need reinforcement"
            ]
        
        elif recommendation_type == RecommendationType.CHANGE_APPROACH:
            reasoning = (
                f"Learner has plateaued at Level {metrics.current_level}. "
                f"Try different teaching methods or content formats."
            )
            evidence = [
                f"Time at level: {metrics.time_at_current_level:.1f} days",
                f"Static accuracy: {metrics.recent_accuracy:.0%}",
                "No improvement trend detected"
            ]
        
        else:  # MAINTAIN
            reasoning = (
                f"Learner is making steady progress at Level "
                f"{metrics.current_level}. Continue current approach."
            )
            evidence = [
                f"Accuracy: {metrics.recent_accuracy:.0%}",
                f"Consistent engagement"
            ]
        
        return reasoning, evidence
    
    def _generate_actions(
        self,
        recommendation_type: RecommendationType,
        metrics: LearnerMetrics
    ) -> List[str]:
        """Generate specific action items"""
        
        actions = []
        
        if recommendation_type == RecommendationType.LEVEL_UP:
            actions = [
                f"Advance to Level {metrics.current_level + 1} content",
                "Introduce new concepts gradually",
                "Provide scaffolding for new material",
                "Celebrate achievement with positive feedback"
            ]
        
        elif recommendation_type == RecommendationType.LEVEL_DOWN:
            actions = [
                f"Return to Level {max(1, metrics.current_level - 1)}",
                "Focus on fundamental concepts",
                "Use multi-modal teaching (visual, auditory, kinesthetic)",
                "Provide frequent encouragement",
                "Reduce task complexity temporarily"
            ]
        
        elif recommendation_type == RecommendationType.ENRICHMENT:
            actions = [
                "Provide additional practice problems",
                "Introduce application-based activities",
                "Offer creative extension projects",
                "Maintain current difficulty level"
            ]
        
        elif recommendation_type == RecommendationType.REMEDIATION:
            actions = [
                f"Review Level {max(1, metrics.current_level - 2)} fundamentals",
                "Use diagnostic assessment to identify gaps",
                "Provide targeted mini-lessons",
                "Check for prerequisite knowledge"
            ]
        
        elif recommendation_type == RecommendationType.CHANGE_APPROACH:
            actions = [
                "Try different content format (video, interactive, text)",
                "Change teaching method (explicit, discovery, collaborative)",
                "Use real-world examples and applications",
                "Incorporate learner's interests"
            ]
        
        elif recommendation_type == RecommendationType.BREAK:
            actions = [
                "Pause learning session",
                "Suggest physical activity or relaxation",
                "Review session achievements",
                "Plan shorter sessions in future"
            ]
        
        else:  # MAINTAIN
            actions = [
                "Continue current learning path",
                "Monitor progress closely",
                "Provide positive reinforcement",
                "Prepare for advancement"
            ]
        
        return actions
    
    def _suggest_content(
        self,
        metrics: LearnerMetrics,
        recommended_level: int
    ) -> List[str]:
        """Suggest specific content based on level and subject"""
        
        # In production, this would query content database
        # For now, return structured suggestions
        
        content = [
            f"{metrics.subject} - Level {recommended_level} lessons",
            f"{metrics.skill} practice activities",
            f"Interactive exercises for {metrics.subject}"
        ]
        
        return content
    
    def _calculate_confidence(self, metrics: LearnerMetrics) -> float:
        """Calculate confidence in recommendation (0-1)"""
        
        confidence = 0.5  # Base confidence
        
        # More attempts = higher confidence
        if metrics.attempts_at_current_level >= 20:
            confidence += 0.2
        elif metrics.attempts_at_current_level >= 10:
            confidence += 0.1
        
        # Longer time at level = higher confidence
        if metrics.time_at_current_level >= 7:
            confidence += 0.15
        elif metrics.time_at_current_level >= 3:
            confidence += 0.1
        
        # Clear trend = higher confidence
        if self._is_trend_clear(metrics.last_7_days_accuracy):
            confidence += 0.15
        
        return min(1.0, confidence)
    
    def _determine_priority(
        self,
        recommendation_type: RecommendationType,
        performance_level: PerformanceLevel
    ) -> str:
        """Determine recommendation priority"""
        
        if recommendation_type == RecommendationType.BREAK:
            return "urgent"
        
        elif recommendation_type == RecommendationType.LEVEL_DOWN:
            return "high"
        
        elif recommendation_type == RecommendationType.LEVEL_UP:
            if performance_level == PerformanceLevel.ADVANCED:
                return "high"
            else:
                return "medium"
        
        elif recommendation_type == RecommendationType.REMEDIATION:
            return "high"
        
        else:
            return "medium"
    
    def _describe_expected_impact(
        self, recommendation_type: RecommendationType
    ) -> str:
        """Describe expected impact of recommendation"""
        
        impacts = {
            RecommendationType.LEVEL_UP: (
                "Increased engagement through challenge, "
                "accelerated learning progress"
            ),
            RecommendationType.LEVEL_DOWN: (
                "Improved confidence, stronger foundation, "
                "reduced frustration"
            ),
            RecommendationType.ENRICHMENT: (
                "Deeper understanding, mastery consolidation"
            ),
            RecommendationType.REMEDIATION: (
                "Fill knowledge gaps, improved future performance"
            ),
            RecommendationType.CHANGE_APPROACH: (
                "Break through plateau, renewed engagement"
            ),
            RecommendationType.BREAK: (
                "Restored focus, better retention"
            ),
            RecommendationType.MAINTAIN: (
                "Steady progress, skill development"
            )
        }
        
        return impacts.get(
            recommendation_type,
            "Improved learning outcomes"
        )
    
    def _estimate_adjustment_time(
        self,
        metrics: LearnerMetrics,
        recommendation_type: RecommendationType
    ) -> str:
        """Estimate time until adjustment takes effect"""
        
        if recommendation_type == RecommendationType.BREAK:
            return "Immediate"
        elif recommendation_type == RecommendationType.LEVEL_DOWN:
            return "1-2 sessions"
        elif recommendation_type == RecommendationType.LEVEL_UP:
            return "2-3 sessions"
        elif recommendation_type == RecommendationType.REMEDIATION:
            return "3-5 sessions"
        elif recommendation_type == RecommendationType.CHANGE_APPROACH:
            return "1-2 weeks"
        else:
            return "Ongoing"
    
    def _is_trend_improving(self, values: List[float]) -> bool:
        """Check if trend is improving"""
        if len(values) < 3:
            return False
        
        recent = sum(values[-3:]) / 3
        older = sum(values[:-3]) / max(1, len(values) - 3)
        
        return recent > older + 0.05  # 5% improvement
    
    def _is_trend_clear(self, values: List[float]) -> bool:
        """Check if trend is clear (not noisy)"""
        if len(values) < 3:
            return False
        
        # Calculate variance
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        
        # Low variance = clear trend
        return variance < 0.05
    
    async def batch_analyze_students(
        self,
        student_metrics: List[LearnerMetrics]
    ) -> List[LearningRecommendation]:
        """Analyze multiple students and generate recommendations"""
        
        recommendations = []
        
        for metrics in student_metrics:
            try:
                recommendation = await self.analyze_and_recommend(metrics)
                recommendations.append(recommendation)
            except Exception as e:
                logger.error(
                    f"Error analyzing student {metrics.student_id}: {e}"
                )
        
        # Sort by priority
        priority_order = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
        recommendations.sort(
            key=lambda r: priority_order.get(r.priority, 4)
        )
        
        return recommendations
