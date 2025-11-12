"""
Test suite for Adaptive Learning Orchestrator
Demonstrates intelligent learning recommendations
"""

import pytest
from src.adaptive_orchestrator import (
    AdaptiveLearningOrchestrator,
    LearnerMetrics,
    PerformanceLevel,
    RecommendationType
)


class TestAdaptiveLearningOrchestrator:
    """Test adaptive learning recommendation engine"""
    
    @pytest.fixture
    def orchestrator(self):
        """Create orchestrator instance"""
        return AdaptiveLearningOrchestrator()
    
    # =====================================================
    # SCENARIO 1: Student Mastering Content (Level Up)
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_level_up_for_mastery(self, orchestrator):
        """Test level up recommendation for mastered content"""
        
        # Student performing excellently
        metrics = LearnerMetrics(
            student_id="emma_123",
            subject="mathematics",
            skill="fractions",
            recent_accuracy=0.94,
            overall_accuracy=0.89,
            completion_rate=0.95,
            average_time_per_task=25.0,
            focus_score=0.85,
            session_duration=20.0,
            consecutive_sessions=5,
            hint_usage_rate=0.08,
            current_level=4,
            attempts_at_current_level=15,
            successful_at_current_level=14,
            time_at_current_level=4.0,
            last_7_days_accuracy=[0.88, 0.90, 0.92, 0.94, 0.95, 0.94, 0.94],
            last_7_days_time=[30, 28, 26, 25, 24, 25, 25]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend level up
        assert recommendation.recommendation_type == RecommendationType.LEVEL_UP
        assert recommendation.recommended_level == 5
        assert recommendation.confidence >= 0.8
        assert recommendation.priority in ["high", "medium"]
        assert "mastered" in recommendation.reasoning.lower()
        assert len(recommendation.evidence) > 0
        assert len(recommendation.suggested_actions) > 0
    
    # =====================================================
    # SCENARIO 2: Student Struggling (Level Down)
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_level_down_for_struggling(self, orchestrator):
        """Test level down for struggling student"""
        
        # Student struggling with current content
        metrics = LearnerMetrics(
            student_id="alex_456",
            subject="reading",
            skill="comprehension",
            recent_accuracy=0.45,
            overall_accuracy=0.52,
            completion_rate=0.68,
            average_time_per_task=120.0,
            focus_score=0.55,
            session_duration=18.0,
            consecutive_sessions=3,
            hint_usage_rate=0.75,
            current_level=5,
            attempts_at_current_level=20,
            successful_at_current_level=9,
            time_at_current_level=6.0,
            last_7_days_accuracy=[0.50, 0.48, 0.45, 0.42, 0.45, 0.40, 0.45],
            last_7_days_time=[110, 115, 120, 125, 120, 130, 120]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend level down or remediation
        assert recommendation.recommendation_type in [
            RecommendationType.LEVEL_DOWN,
            RecommendationType.REMEDIATION
        ]
        assert recommendation.recommended_level < metrics.current_level
        assert recommendation.confidence >= 0.7
        assert recommendation.priority in ["high", "urgent"]
    
    # =====================================================
    # SCENARIO 3: Low Focus (Break Needed)
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_break_for_low_focus(self, orchestrator):
        """Test break recommendation when focus drops"""
        
        # Student with critically low focus
        metrics = LearnerMetrics(
            student_id="jordan_789",
            subject="science",
            skill="biology",
            recent_accuracy=0.65,
            overall_accuracy=0.72,
            completion_rate=0.80,
            average_time_per_task=60.0,
            focus_score=0.32,  # Very low focus!
            session_duration=35.0,
            consecutive_sessions=1,
            hint_usage_rate=0.40,
            current_level=3,
            attempts_at_current_level=8,
            successful_at_current_level=5,
            time_at_current_level=1.5,
            last_7_days_accuracy=[0.70, 0.68, 0.65, 0.62, 0.60, 0.62, 0.65],
            last_7_days_time=[55, 58, 60, 65, 60, 62, 60]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend immediate break
        assert recommendation.recommendation_type == RecommendationType.BREAK
        assert recommendation.priority == "urgent"
        assert recommendation.confidence >= 0.9
        assert "focus" in recommendation.reasoning.lower()
        assert any("break" in action.lower() 
                  for action in recommendation.suggested_actions)
    
    # =====================================================
    # SCENARIO 4: Plateau Detected (Change Approach)
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_change_approach_for_plateau(self, orchestrator):
        """Test change approach when student plateaus"""
        
        # Student stuck at same level for long time
        metrics = LearnerMetrics(
            student_id="sam_101",
            subject="writing",
            skill="grammar",
            recent_accuracy=0.72,
            overall_accuracy=0.73,
            completion_rate=0.85,
            average_time_per_task=90.0,
            focus_score=0.65,
            session_duration=22.0,
            consecutive_sessions=10,
            hint_usage_rate=0.35,
            current_level=3,
            attempts_at_current_level=25,
            successful_at_current_level=18,
            time_at_current_level=9.0,  # 9 days!
            last_7_days_accuracy=[0.72, 0.71, 0.73, 0.72, 0.72, 0.71, 0.72],
            last_7_days_time=[88, 90, 92, 90, 89, 91, 90]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend changing approach
        assert recommendation.recommendation_type in [
            RecommendationType.CHANGE_APPROACH,
            RecommendationType.MAINTAIN
        ]
        if recommendation.recommendation_type == RecommendationType.CHANGE_APPROACH:
            assert "approach" in recommendation.reasoning.lower() or \
                   "plateau" in recommendation.reasoning.lower()
    
    # =====================================================
    # SCENARIO 5: Enrichment Needed
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_enrichment_for_good_performance(self, orchestrator):
        """Test enrichment recommendation for proficient student"""
        
        # Student doing well but not quite ready to advance
        metrics = LearnerMetrics(
            student_id="maya_202",
            subject="mathematics",
            skill="geometry",
            recent_accuracy=0.85,
            overall_accuracy=0.82,
            completion_rate=0.92,
            average_time_per_task=45.0,
            focus_score=0.78,
            session_duration=23.0,
            consecutive_sessions=4,
            hint_usage_rate=0.18,
            current_level=5,
            attempts_at_current_level=7,  # Not enough attempts yet
            successful_at_current_level=6,
            time_at_current_level=1.5,  # Not enough time yet
            last_7_days_accuracy=[0.80, 0.82, 0.85, 0.86, 0.85, 0.87, 0.85],
            last_7_days_time=[50, 48, 45, 44, 45, 43, 45]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend maintain or enrichment
        assert recommendation.recommendation_type in [
            RecommendationType.MAINTAIN,
            RecommendationType.ENRICHMENT
        ]
        assert recommendation.recommended_level == metrics.current_level
    
    # =====================================================
    # SCENARIO 6: Session Too Long
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_recommend_break_for_long_session(self, orchestrator):
        """Test break recommendation for overly long session"""
        
        metrics = LearnerMetrics(
            student_id="riley_303",
            subject="history",
            skill="world_history",
            recent_accuracy=0.75,
            overall_accuracy=0.76,
            completion_rate=0.88,
            average_time_per_task=55.0,
            focus_score=0.58,  # Focus declining
            session_duration=55.0,  # Too long!
            consecutive_sessions=2,
            hint_usage_rate=0.25,
            current_level=4,
            attempts_at_current_level=12,
            successful_at_current_level=9,
            time_at_current_level=3.0,
            last_7_days_accuracy=[0.78, 0.76, 0.75, 0.74, 0.75, 0.75, 0.75],
            last_7_days_time=[50, 52, 55, 55, 55, 56, 55]
        )
        
        recommendation = await orchestrator.analyze_and_recommend(metrics)
        
        # Should recommend break due to session length
        assert recommendation.recommendation_type == RecommendationType.BREAK
        assert recommendation.priority in ["urgent", "high"]
        assert "session" in recommendation.reasoning.lower()
    
    # =====================================================
    # SCENARIO 7: Performance Classification
    # =====================================================
    
    def test_performance_classification(self, orchestrator):
        """Test performance level classification"""
        
        # Advanced
        advanced_metrics = LearnerMetrics(
            student_id="test", subject="test", skill="test",
            recent_accuracy=0.96, overall_accuracy=0.95,
            completion_rate=0.95, average_time_per_task=25.0,
            focus_score=0.9, session_duration=20.0, consecutive_sessions=1,
            hint_usage_rate=0.05, current_level=1,
            attempts_at_current_level=5, successful_at_current_level=5,
            time_at_current_level=1.0, last_7_days_accuracy=[],
            last_7_days_time=[]
        )
        assert orchestrator._classify_performance(advanced_metrics) == \
               PerformanceLevel.ADVANCED
        
        # Struggling
        struggling_metrics = LearnerMetrics(
            student_id="test", subject="test", skill="test",
            recent_accuracy=0.50, overall_accuracy=0.52,
            completion_rate=0.70, average_time_per_task=120.0,
            focus_score=0.5, session_duration=20.0, consecutive_sessions=1,
            hint_usage_rate=0.7, current_level=1,
            attempts_at_current_level=10, successful_at_current_level=5,
            time_at_current_level=3.0, last_7_days_accuracy=[],
            last_7_days_time=[]
        )
        assert orchestrator._classify_performance(struggling_metrics) == \
               PerformanceLevel.STRUGGLING
    
    # =====================================================
    # SCENARIO 8: Batch Analysis
    # =====================================================
    
    @pytest.mark.asyncio
    async def test_batch_analyze_students(self, orchestrator):
        """Test analyzing multiple students at once"""
        
        students = [
            # Student 1: Mastering
            LearnerMetrics(
                student_id="student_1", subject="math", skill="algebra",
                recent_accuracy=0.92, overall_accuracy=0.88,
                completion_rate=0.95, average_time_per_task=30.0,
                focus_score=0.85, session_duration=20.0, consecutive_sessions=5,
                hint_usage_rate=0.10, current_level=3,
                attempts_at_current_level=12, successful_at_current_level=11,
                time_at_current_level=4.0,
                last_7_days_accuracy=[0.88, 0.90, 0.92, 0.92, 0.93, 0.92, 0.92],
                last_7_days_time=[32, 30, 28, 30, 30, 29, 30]
            ),
            # Student 2: Struggling
            LearnerMetrics(
                student_id="student_2", subject="reading", skill="phonics",
                recent_accuracy=0.48, overall_accuracy=0.52,
                completion_rate=0.65, average_time_per_task=100.0,
                focus_score=0.55, session_duration=18.0, consecutive_sessions=2,
                hint_usage_rate=0.70, current_level=2,
                attempts_at_current_level=18, successful_at_current_level=9,
                time_at_current_level=5.0,
                last_7_days_accuracy=[0.50, 0.48, 0.45, 0.48, 0.50, 0.47, 0.48],
                last_7_days_time=[95, 100, 105, 100, 98, 102, 100]
            )
        ]
        
        recommendations = await orchestrator.batch_analyze_students(students)
        
        # Should return 2 recommendations
        assert len(recommendations) == 2
        
        # Should be sorted by priority
        priorities = [r.priority for r in recommendations]
        assert all(priorities[i] <= priorities[i+1] 
                  for i in range(len(priorities)-1)
                  if priorities[i] in ["urgent", "high"] and 
                     priorities[i+1] in ["medium", "low"])


@pytest.mark.integration
class TestAdaptiveLearningIntegration:
    """Integration tests with training pipeline"""
    
    @pytest.mark.asyncio
    async def test_full_analysis_to_model_update_flow(self):
        """Test complete flow from analysis to model update"""
        from src.training import ContinuousTrainingPipeline
        
        pipeline = ContinuousTrainingPipeline()
        
        # High-performing student data
        performance_data = {
            "recent_accuracy": 0.95,
            "overall_accuracy": 0.90,
            "completion_rate": 0.98,
            "average_time_per_task": 28.0,
            "focus_score": 0.88,
            "session_duration": 22.0,
            "consecutive_sessions": 6,
            "hint_usage_rate": 0.05,
            "current_level": 4,
            "attempts_at_current_level": 15,
            "successful_at_current_level": 14,
            "time_at_current_level": 5.0,
            "last_7_days_accuracy": [0.90, 0.92, 0.94, 0.95, 0.96, 0.95, 0.95],
            "last_7_days_time": [30, 28, 27, 28, 28, 27, 28]
        }
        
        # Analyze performance
        recommendation = await pipeline.analyze_learner_performance(
            student_id="test_student",
            subject="mathematics",
            skill="fractions",
            performance_data=performance_data
        )
        
        # Should get level up recommendation
        assert recommendation.recommendation_type == RecommendationType.LEVEL_UP
        assert recommendation.confidence >= 0.8
        
        # Should trigger model update (logged, not executed in test)
        # In production, this would queue a model fine-tuning job
