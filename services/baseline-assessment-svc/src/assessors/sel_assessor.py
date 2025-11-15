"""
Social-Emotional Learning (SEL) Assessment Module
Comprehensive evaluation of social-emotional development
Evidence-based approach following CASEL framework
"""
import logging
from typing import Dict, List
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import httpx

logger = logging.getLogger(__name__)


class CompetencyLevel(str, Enum):
    """CASEL competency levels"""
    SIGNIFICANTLY_BELOW = "significantly_below"  # Serious concerns
    BELOW_EXPECTED = "below_expected"  # Needs support
    DEVELOPING = "developing"  # Emerging skills
    AT_EXPECTED = "at_expected"  # Age-appropriate
    ABOVE_EXPECTED = "above_expected"  # Advanced


class EmotionalIntelligenceLevel(str, Enum):
    """Emotional intelligence levels (RULER framework)"""
    EMERGING = "emerging"
    DEVELOPING = "developing"
    PROFICIENT = "proficient"
    ADVANCED = "advanced"


class ResilienceLevel(str, Enum):
    """Resilience assessment levels"""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"


class MentalHealthRisk(str, Enum):
    """Mental health screening risk levels"""
    NO_CONCERNS = "no_concerns"
    MONITOR = "monitor"
    MILD_CONCERN = "mild_concern"
    MODERATE_CONCERN = "moderate_concern"
    SIGNIFICANT_CONCERN = "significant_concern"


@dataclass
class SelfAwarenessAssessment:
    """CASEL: Self-Awareness Competency"""
    emotion_recognition: float  # 0-100
    self_perception_accuracy: float
    strengths_recognition: float
    growth_mindset: float
    overall_score: float
    level: CompetencyLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class SelfManagementAssessment:
    """CASEL: Self-Management Competency"""
    impulse_control: float  # 0-100
    stress_management: float
    self_discipline: float
    goal_setting: float
    organizational_skills: float
    overall_score: float
    level: CompetencyLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class SocialAwarenessAssessment:
    """CASEL: Social Awareness Competency"""
    empathy: float  # 0-100
    perspective_taking: float
    appreciating_diversity: float
    respect_for_others: float
    understanding_social_norms: float
    overall_score: float
    level: CompetencyLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class RelationshipSkillsAssessment:
    """CASEL: Relationship Skills Competency"""
    communication: float  # 0-100
    cooperation: float
    conflict_resolution: float
    help_seeking: float
    building_relationships: float
    overall_score: float
    level: CompetencyLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ResponsibleDecisionMakingAssessment:
    """CASEL: Responsible Decision-Making Competency"""
    problem_identification: float  # 0-100
    solution_generation: float
    consequence_evaluation: float
    ethical_responsibility: float
    safety_awareness: float
    overall_score: float
    level: CompetencyLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class EmotionalIntelligenceAssessment:
    """Emotional Intelligence (RULER framework)"""
    recognizing_emotions: float  # 0-100
    understanding_emotions: float
    labeling_emotions: float
    expressing_emotions: float
    regulating_emotions: float
    overall_score: float
    level: EmotionalIntelligenceLevel
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ResilienceAssessment:
    """Resilience and coping skills"""
    adaptability: float  # 0-100
    problem_solving: float
    social_support: float
    optimism: float
    self_efficacy: float
    overall_score: float
    level: ResilienceLevel
    coping_strategies: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


@dataclass
class MentalHealthScreening:
    """Mental health screening indicators"""
    anxiety_indicators: List[str]
    depression_indicators: List[str]
    behavioral_concerns: List[str]
    attention_concerns: List[str]
    trauma_indicators: List[str]
    risk_level: MentalHealthRisk
    referral_recommended: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ExecutiveFunctionAssessment:
    """Executive function skills"""
    working_memory: float  # 0-100
    cognitive_flexibility: float
    inhibitory_control: float
    planning_organization: float
    task_initiation: float
    overall_score: float
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ComprehensiveSELAssessment:
    """Complete Social-Emotional Learning evaluation"""
    child_id: str
    assessment_date: datetime
    chronological_age: float
    grade_level: str

    # CASEL Five Competencies
    self_awareness: SelfAwarenessAssessment
    self_management: SelfManagementAssessment
    social_awareness: SocialAwarenessAssessment
    relationship_skills: RelationshipSkillsAssessment
    responsible_decision_making: ResponsibleDecisionMakingAssessment

    # Additional assessments
    emotional_intelligence: EmotionalIntelligenceAssessment
    resilience: ResilienceAssessment
    mental_health: MentalHealthScreening
    executive_function: ExecutiveFunctionAssessment

    # Summary
    overall_sel_score: float
    overall_sel_level: CompetencyLevel
    priority_areas: List[str]
    strengths: List[str]
    intervention_recommended: bool
    recommendations: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "child_id": self.child_id,
            "assessment_date": self.assessment_date.isoformat(),
            "chronological_age": self.chronological_age,
            "grade_level": self.grade_level,
            "casel_competencies": {
                "self_awareness": {
                    "emotion_recognition": self.self_awareness.emotion_recognition,
                    "self_perception_accuracy": self.self_awareness.self_perception_accuracy,
                    "strengths_recognition": self.self_awareness.strengths_recognition,
                    "growth_mindset": self.self_awareness.growth_mindset,
                    "overall_score": self.self_awareness.overall_score,
                    "level": self.self_awareness.level.value,
                    "recommendations": self.self_awareness.recommendations
                },
                "self_management": {
                    "impulse_control": self.self_management.impulse_control,
                    "stress_management": self.self_management.stress_management,
                    "self_discipline": self.self_management.self_discipline,
                    "goal_setting": self.self_management.goal_setting,
                    "organizational_skills": self.self_management.organizational_skills,
                    "overall_score": self.self_management.overall_score,
                    "level": self.self_management.level.value,
                    "recommendations": self.self_management.recommendations
                },
                "social_awareness": {
                    "empathy": self.social_awareness.empathy,
                    "perspective_taking": self.social_awareness.perspective_taking,
                    "appreciating_diversity": self.social_awareness.appreciating_diversity,
                    "respect_for_others": self.social_awareness.respect_for_others,
                    "understanding_social_norms": self.social_awareness.understanding_social_norms,
                    "overall_score": self.social_awareness.overall_score,
                    "level": self.social_awareness.level.value,
                    "recommendations": self.social_awareness.recommendations
                },
                "relationship_skills": {
                    "communication": self.relationship_skills.communication,
                    "cooperation": self.relationship_skills.cooperation,
                    "conflict_resolution": self.relationship_skills.conflict_resolution,
                    "help_seeking": self.relationship_skills.help_seeking,
                    "building_relationships": self.relationship_skills.building_relationships,
                    "overall_score": self.relationship_skills.overall_score,
                    "level": self.relationship_skills.level.value,
                    "recommendations": self.relationship_skills.recommendations
                },
                "responsible_decision_making": {
                    "problem_identification": self.responsible_decision_making.problem_identification,
                    "solution_generation": self.responsible_decision_making.solution_generation,
                    "consequence_evaluation": self.responsible_decision_making.consequence_evaluation,
                    "ethical_responsibility": self.responsible_decision_making.ethical_responsibility,
                    "safety_awareness": self.responsible_decision_making.safety_awareness,
                    "overall_score": self.responsible_decision_making.overall_score,
                    "level": self.responsible_decision_making.level.value,
                    "recommendations": self.responsible_decision_making.recommendations
                }
            },
            "emotional_intelligence": {
                "recognizing_emotions": self.emotional_intelligence.recognizing_emotions,
                "understanding_emotions": self.emotional_intelligence.understanding_emotions,
                "labeling_emotions": self.emotional_intelligence.labeling_emotions,
                "expressing_emotions": self.emotional_intelligence.expressing_emotions,
                "regulating_emotions": self.emotional_intelligence.regulating_emotions,
                "overall_score": self.emotional_intelligence.overall_score,
                "level": self.emotional_intelligence.level.value,
                "recommendations": self.emotional_intelligence.recommendations
            },
            "resilience": {
                "adaptability": self.resilience.adaptability,
                "problem_solving": self.resilience.problem_solving,
                "social_support": self.resilience.social_support,
                "optimism": self.resilience.optimism,
                "self_efficacy": self.resilience.self_efficacy,
                "overall_score": self.resilience.overall_score,
                "level": self.resilience.level.value,
                "coping_strategies": self.resilience.coping_strategies,
                "recommendations": self.resilience.recommendations
            },
            "mental_health": {
                "anxiety_indicators": self.mental_health.anxiety_indicators,
                "depression_indicators": self.mental_health.depression_indicators,
                "behavioral_concerns": self.mental_health.behavioral_concerns,
                "attention_concerns": self.mental_health.attention_concerns,
                "trauma_indicators": self.mental_health.trauma_indicators,
                "risk_level": self.mental_health.risk_level.value,
                "referral_recommended": self.mental_health.referral_recommended,
                "recommendations": self.mental_health.recommendations
            },
            "executive_function": {
                "working_memory": self.executive_function.working_memory,
                "cognitive_flexibility": self.executive_function.cognitive_flexibility,
                "inhibitory_control": self.executive_function.inhibitory_control,
                "planning_organization": self.executive_function.planning_organization,
                "task_initiation": self.executive_function.task_initiation,
                "overall_score": self.executive_function.overall_score,
                "age_appropriate": self.executive_function.age_appropriate,
                "recommendations": self.executive_function.recommendations
            },
            "summary": {
                "overall_sel_score": self.overall_sel_score,
                "overall_sel_level": self.overall_sel_level.value,
                "priority_areas": self.priority_areas,
                "strengths": self.strengths,
                "intervention_recommended": self.intervention_recommended,
                "recommendations": self.recommendations
            }
        }


class SocialEmotionalAssessor:
    """
    Comprehensive Social-Emotional Learning Assessor

    Conducts multi-domain SEL evaluation following CASEL framework:
    - Self-Awareness
    - Self-Management
    - Social Awareness
    - Relationship Skills
    - Responsible Decision-Making

    Plus additional assessments:
    - Emotional Intelligence (RULER)
    - Resilience
    - Mental Health Screening
    - Executive Function
    """

    def __init__(self, sel_api_url: str = "http://sel-agent-svc:8015"):
        self.sel_api_url = sel_api_url
        self.client = httpx.AsyncClient(timeout=30.0)

    async def conduct_comprehensive_assessment(
        self,
        child_id: str,
        age: float,
        grade: str,
        assessment_data: Dict
    ) -> ComprehensiveSELAssessment:
        """
        Conduct comprehensive SEL assessment

        Args:
            child_id: Child's unique identifier
            age: Chronological age in years
            grade: Grade level (K, 1-12)
            assessment_data: Dict with assessment responses

        Returns:
            ComprehensiveSELAssessment with all domain results
        """
        logger.info(f"Starting comprehensive SEL assessment for child {child_id}")

        # Conduct CASEL Five Competencies Assessment
        self_awareness = await self._assess_self_awareness(
            child_id, age, assessment_data
        )
        self_management = await self._assess_self_management(
            child_id, age, assessment_data
        )
        social_awareness = await self._assess_social_awareness(
            child_id, age, assessment_data
        )
        relationship_skills = await self._assess_relationship_skills(
            child_id, age, assessment_data
        )
        responsible_decision = await self._assess_responsible_decision_making(
            child_id, age, assessment_data
        )

        # Additional assessments
        emotional_intelligence = await self._assess_emotional_intelligence(
            child_id, age, assessment_data
        )
        resilience = await self._assess_resilience(
            child_id, age, assessment_data
        )
        mental_health = await self._screen_mental_health(
            child_id, age, assessment_data
        )
        executive_function = await self._assess_executive_function(
            child_id, age, assessment_data
        )

        # Calculate overall SEL score and level
        overall_score = self._calculate_overall_score(
            self_awareness, self_management, social_awareness,
            relationship_skills, responsible_decision
        )

        overall_level = self._determine_overall_level(overall_score)

        # Identify priorities and strengths
        priority_areas = self._identify_priority_areas(
            self_awareness, self_management, social_awareness,
            relationship_skills, responsible_decision,
            emotional_intelligence, resilience, executive_function
        )

        strengths = self._identify_strengths(
            self_awareness, self_management, social_awareness,
            relationship_skills, responsible_decision,
            emotional_intelligence, resilience, executive_function
        )

        # Determine if intervention needed
        intervention_recommended = (
            overall_level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]
            or mental_health.risk_level in [MentalHealthRisk.MODERATE_CONCERN, MentalHealthRisk.SIGNIFICANT_CONCERN]
        )

        # Generate overall recommendations
        recommendations = self._generate_overall_recommendations(
            self_awareness, self_management, social_awareness,
            relationship_skills, responsible_decision,
            emotional_intelligence, resilience, mental_health,
            executive_function, overall_level, priority_areas
        )

        return ComprehensiveSELAssessment(
            child_id=child_id,
            assessment_date=datetime.now(),
            chronological_age=age,
            grade_level=grade,
            self_awareness=self_awareness,
            self_management=self_management,
            social_awareness=social_awareness,
            relationship_skills=relationship_skills,
            responsible_decision_making=responsible_decision,
            emotional_intelligence=emotional_intelligence,
            resilience=resilience,
            mental_health=mental_health,
            executive_function=executive_function,
            overall_sel_score=overall_score,
            overall_sel_level=overall_level,
            priority_areas=priority_areas,
            strengths=strengths,
            intervention_recommended=intervention_recommended,
            recommendations=recommendations
        )

    async def _assess_self_awareness(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> SelfAwarenessAssessment:
        """Assess self-awareness competency"""

        data = assessment_data.get("self_awareness", {})

        emotion_recognition = data.get("emotion_recognition", 70.0)
        self_perception = data.get("self_perception_accuracy", 70.0)
        strengths_recognition = data.get("strengths_recognition", 70.0)
        growth_mindset = data.get("growth_mindset", 70.0)

        overall_score = (
            emotion_recognition + self_perception +
            strengths_recognition + growth_mindset
        ) / 4

        level = self._score_to_level(overall_score)

        recommendations = []
        if emotion_recognition < 60:
            recommendations.append("Emotion recognition activities and feeling charts")
        if growth_mindset < 60:
            recommendations.append("Growth mindset curriculum and praise effort over ability")
        if level == CompetencyLevel.SIGNIFICANTLY_BELOW:
            recommendations.append("Intensive self-awareness intervention with counselor")

        return SelfAwarenessAssessment(
            emotion_recognition=emotion_recognition,
            self_perception_accuracy=self_perception,
            strengths_recognition=strengths_recognition,
            growth_mindset=growth_mindset,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_self_management(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> SelfManagementAssessment:
        """Assess self-management competency"""

        data = assessment_data.get("self_management", {})

        impulse_control = data.get("impulse_control", 70.0)
        stress_management = data.get("stress_management", 70.0)
        self_discipline = data.get("self_discipline", 70.0)
        goal_setting = data.get("goal_setting", 70.0)
        organizational_skills = data.get("organizational_skills", 70.0)

        overall_score = (
            impulse_control + stress_management + self_discipline +
            goal_setting + organizational_skills
        ) / 5

        level = self._score_to_level(overall_score)

        recommendations = []
        if impulse_control < 60:
            recommendations.append("Impulse control strategies and behavior management")
        if stress_management < 60:
            recommendations.append("Stress reduction techniques and coping skills")
        if organizational_skills < 60:
            recommendations.append("Executive function coaching and organizational tools")

        return SelfManagementAssessment(
            impulse_control=impulse_control,
            stress_management=stress_management,
            self_discipline=self_discipline,
            goal_setting=goal_setting,
            organizational_skills=organizational_skills,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_social_awareness(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> SocialAwarenessAssessment:
        """Assess social awareness competency"""

        data = assessment_data.get("social_awareness", {})

        empathy = data.get("empathy", 70.0)
        perspective_taking = data.get("perspective_taking", 70.0)
        appreciating_diversity = data.get("appreciating_diversity", 70.0)
        respect_for_others = data.get("respect_for_others", 70.0)
        understanding_norms = data.get("understanding_social_norms", 70.0)

        overall_score = (
            empathy + perspective_taking + appreciating_diversity +
            respect_for_others + understanding_norms
        ) / 5

        level = self._score_to_level(overall_score)

        recommendations = []
        if empathy < 60:
            recommendations.append("Empathy-building activities and perspective-taking exercises")
        if appreciating_diversity < 60:
            recommendations.append("Diversity education and multicultural experiences")

        return SocialAwarenessAssessment(
            empathy=empathy,
            perspective_taking=perspective_taking,
            appreciating_diversity=appreciating_diversity,
            respect_for_others=respect_for_others,
            understanding_social_norms=understanding_norms,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_relationship_skills(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> RelationshipSkillsAssessment:
        """Assess relationship skills competency"""

        data = assessment_data.get("relationship_skills", {})

        communication = data.get("communication", 70.0)
        cooperation = data.get("cooperation", 70.0)
        conflict_resolution = data.get("conflict_resolution", 70.0)
        help_seeking = data.get("help_seeking", 70.0)
        building_relationships = data.get("building_relationships", 70.0)

        overall_score = (
            communication + cooperation + conflict_resolution +
            help_seeking + building_relationships
        ) / 5

        level = self._score_to_level(overall_score)

        recommendations = []
        if communication < 60:
            recommendations.append("Communication skills training and assertiveness practice")
        if conflict_resolution < 60:
            recommendations.append("Conflict resolution strategies and mediation skills")
        if building_relationships < 60:
            recommendations.append("Social skills groups and friendship coaching")

        return RelationshipSkillsAssessment(
            communication=communication,
            cooperation=cooperation,
            conflict_resolution=conflict_resolution,
            help_seeking=help_seeking,
            building_relationships=building_relationships,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_responsible_decision_making(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> ResponsibleDecisionMakingAssessment:
        """Assess responsible decision-making competency"""

        data = assessment_data.get("responsible_decision_making", {})

        problem_identification = data.get("problem_identification", 70.0)
        solution_generation = data.get("solution_generation", 70.0)
        consequence_evaluation = data.get("consequence_evaluation", 70.0)
        ethical_responsibility = data.get("ethical_responsibility", 70.0)
        safety_awareness = data.get("safety_awareness", 70.0)

        overall_score = (
            problem_identification + solution_generation +
            consequence_evaluation + ethical_responsibility + safety_awareness
        ) / 5

        level = self._score_to_level(overall_score)

        recommendations = []
        if consequence_evaluation < 60:
            recommendations.append("Decision-making frameworks and consequence thinking")
        if safety_awareness < 60:
            recommendations.append("Safety education and risk assessment training")

        return ResponsibleDecisionMakingAssessment(
            problem_identification=problem_identification,
            solution_generation=solution_generation,
            consequence_evaluation=consequence_evaluation,
            ethical_responsibility=ethical_responsibility,
            safety_awareness=safety_awareness,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_emotional_intelligence(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> EmotionalIntelligenceAssessment:
        """Assess emotional intelligence using RULER framework"""

        # Try to get detailed EI assessment from SEL service
        ei_data = assessment_data.get("emotional_intelligence", {})

        try:
            response = await self.client.post(
                f"{self.sel_api_url}/v1/sel/assess-emotional-intelligence",
                json={
                    "child_id": child_id,
                    "age": age,
                    "responses": ei_data
                }
            )
            if response.status_code == 200:
                analysis = response.json()
                ei_data.update(analysis)
        except Exception as e:
            logger.warning(f"Could not get detailed EI analysis: {e}")

        recognizing = ei_data.get("recognizing_emotions", 70.0)
        understanding = ei_data.get("understanding_emotions", 70.0)
        labeling = ei_data.get("labeling_emotions", 70.0)
        expressing = ei_data.get("expressing_emotions", 70.0)
        regulating = ei_data.get("regulating_emotions", 70.0)

        overall_score = (
            recognizing + understanding + labeling + expressing + regulating
        ) / 5

        if overall_score >= 85:
            level = EmotionalIntelligenceLevel.ADVANCED
        elif overall_score >= 70:
            level = EmotionalIntelligenceLevel.PROFICIENT
        elif overall_score >= 55:
            level = EmotionalIntelligenceLevel.DEVELOPING
        else:
            level = EmotionalIntelligenceLevel.EMERGING

        recommendations = []
        if recognizing < 60:
            recommendations.append("Emotion recognition training with facial expressions")
        if regulating < 60:
            recommendations.append("Emotion regulation strategies and mindfulness practice")
        if level == EmotionalIntelligenceLevel.EMERGING:
            recommendations.append("Comprehensive RULER curriculum implementation")

        return EmotionalIntelligenceAssessment(
            recognizing_emotions=recognizing,
            understanding_emotions=understanding,
            labeling_emotions=labeling,
            expressing_emotions=expressing,
            regulating_emotions=regulating,
            overall_score=overall_score,
            level=level,
            recommendations=recommendations
        )

    async def _assess_resilience(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> ResilienceAssessment:
        """Assess resilience and coping skills"""

        res_data = assessment_data.get("resilience", {})

        adaptability = res_data.get("adaptability", 70.0)
        problem_solving = res_data.get("problem_solving", 70.0)
        social_support = res_data.get("social_support", 70.0)
        optimism = res_data.get("optimism", 70.0)
        self_efficacy = res_data.get("self_efficacy", 70.0)

        overall_score = (
            adaptability + problem_solving + social_support +
            optimism + self_efficacy
        ) / 5

        if overall_score >= 80:
            level = ResilienceLevel.VERY_HIGH
        elif overall_score >= 70:
            level = ResilienceLevel.HIGH
        elif overall_score >= 55:
            level = ResilienceLevel.MODERATE
        else:
            level = ResilienceLevel.LOW

        coping_strategies = res_data.get("coping_strategies", [
            "deep_breathing", "talking_to_trusted_adult", "physical_activity"
        ])

        recommendations = []
        if level == ResilienceLevel.LOW:
            recommendations.append("Resilience-building program and coping skills training")
            recommendations.append("Connect with counselor for support")
        if social_support < 60:
            recommendations.append("Build support network through peer groups")
        if optimism < 60:
            recommendations.append("Positive psychology interventions and gratitude practice")

        return ResilienceAssessment(
            adaptability=adaptability,
            problem_solving=problem_solving,
            social_support=social_support,
            optimism=optimism,
            self_efficacy=self_efficacy,
            overall_score=overall_score,
            level=level,
            coping_strategies=coping_strategies,
            recommendations=recommendations
        )

    async def _screen_mental_health(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> MentalHealthScreening:
        """Screen for mental health concerns"""

        mh_data = assessment_data.get("mental_health", {})

        anxiety_indicators = mh_data.get("anxiety_indicators", [])
        depression_indicators = mh_data.get("depression_indicators", [])
        behavioral_concerns = mh_data.get("behavioral_concerns", [])
        attention_concerns = mh_data.get("attention_concerns", [])
        trauma_indicators = mh_data.get("trauma_indicators", [])

        # Calculate risk level based on indicators
        total_indicators = (
            len(anxiety_indicators) + len(depression_indicators) +
            len(behavioral_concerns) + len(attention_concerns) +
            len(trauma_indicators)
        )

        if total_indicators >= 8 or len(trauma_indicators) >= 3:
            risk_level = MentalHealthRisk.SIGNIFICANT_CONCERN
            referral_recommended = True
        elif total_indicators >= 5:
            risk_level = MentalHealthRisk.MODERATE_CONCERN
            referral_recommended = True
        elif total_indicators >= 3:
            risk_level = MentalHealthRisk.MILD_CONCERN
            referral_recommended = False
        elif total_indicators >= 1:
            risk_level = MentalHealthRisk.MONITOR
            referral_recommended = False
        else:
            risk_level = MentalHealthRisk.NO_CONCERNS
            referral_recommended = False

        recommendations = []
        if risk_level == MentalHealthRisk.SIGNIFICANT_CONCERN:
            recommendations.append("URGENT: Refer to mental health professional immediately")
            recommendations.append("Safety assessment and crisis plan needed")
        elif risk_level == MentalHealthRisk.MODERATE_CONCERN:
            recommendations.append("Refer to school counselor or mental health professional")
            recommendations.append("Regular check-ins and monitoring")
        elif risk_level == MentalHealthRisk.MILD_CONCERN:
            recommendations.append("Monitor and provide additional support")
            recommendations.append("Consider preventive interventions")
        elif risk_level == MentalHealthRisk.MONITOR:
            recommendations.append("Continue monitoring for changes")

        if anxiety_indicators:
            recommendations.append("Anxiety management strategies and relaxation techniques")
        if depression_indicators:
            recommendations.append("Mood monitoring and depression screening")
        if attention_concerns:
            recommendations.append("ADHD screening and executive function support")

        return MentalHealthScreening(
            anxiety_indicators=anxiety_indicators,
            depression_indicators=depression_indicators,
            behavioral_concerns=behavioral_concerns,
            attention_concerns=attention_concerns,
            trauma_indicators=trauma_indicators,
            risk_level=risk_level,
            referral_recommended=referral_recommended,
            recommendations=recommendations
        )

    async def _assess_executive_function(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> ExecutiveFunctionAssessment:
        """Assess executive function skills"""

        ef_data = assessment_data.get("executive_function", {})

        working_memory = ef_data.get("working_memory", 70.0)
        cognitive_flexibility = ef_data.get("cognitive_flexibility", 70.0)
        inhibitory_control = ef_data.get("inhibitory_control", 70.0)
        planning_organization = ef_data.get("planning_organization", 70.0)
        task_initiation = ef_data.get("task_initiation", 70.0)

        overall_score = (
            working_memory + cognitive_flexibility + inhibitory_control +
            planning_organization + task_initiation
        ) / 5

        age_appropriate = overall_score >= 60

        recommendations = []
        if working_memory < 60:
            recommendations.append("Working memory training and mnemonic strategies")
        if planning_organization < 60:
            recommendations.append("Organizational tools and planning support")
        if task_initiation < 60:
            recommendations.append("Task initiation strategies and structure")
        if not age_appropriate:
            recommendations.append("Executive function coaching and accommodations")

        return ExecutiveFunctionAssessment(
            working_memory=working_memory,
            cognitive_flexibility=cognitive_flexibility,
            inhibitory_control=inhibitory_control,
            planning_organization=planning_organization,
            task_initiation=task_initiation,
            overall_score=overall_score,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )

    def _calculate_overall_score(
        self,
        self_awareness: SelfAwarenessAssessment,
        self_management: SelfManagementAssessment,
        social_awareness: SocialAwarenessAssessment,
        relationship_skills: RelationshipSkillsAssessment,
        responsible_decision: ResponsibleDecisionMakingAssessment
    ) -> float:
        """Calculate overall SEL score from CASEL competencies"""
        return (
            self_awareness.overall_score +
            self_management.overall_score +
            social_awareness.overall_score +
            relationship_skills.overall_score +
            responsible_decision.overall_score
        ) / 5

    def _determine_overall_level(self, score: float) -> CompetencyLevel:
        """Determine overall competency level from score"""
        return self._score_to_level(score)

    def _score_to_level(self, score: float) -> CompetencyLevel:
        """Convert score to competency level"""
        if score >= 85:
            return CompetencyLevel.ABOVE_EXPECTED
        elif score >= 70:
            return CompetencyLevel.AT_EXPECTED
        elif score >= 55:
            return CompetencyLevel.DEVELOPING
        elif score >= 40:
            return CompetencyLevel.BELOW_EXPECTED
        else:
            return CompetencyLevel.SIGNIFICANTLY_BELOW

    def _identify_priority_areas(self, *assessments) -> List[str]:
        """Identify priority areas for intervention"""
        priorities = []

        # Check CASEL competencies
        self_awareness, self_management, social_awareness, relationship_skills, responsible_decision = assessments[:5]

        if self_awareness.level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]:
            priorities.append("self_awareness")
        if self_management.level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]:
            priorities.append("self_management")
        if social_awareness.level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]:
            priorities.append("social_awareness")
        if relationship_skills.level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]:
            priorities.append("relationship_skills")
        if responsible_decision.level in [CompetencyLevel.SIGNIFICANTLY_BELOW, CompetencyLevel.BELOW_EXPECTED]:
            priorities.append("responsible_decision_making")

        # Check additional assessments
        if len(assessments) > 5:
            emotional_intelligence, resilience, executive_function = assessments[5:8]

            if emotional_intelligence.level in [EmotionalIntelligenceLevel.EMERGING]:
                priorities.append("emotional_intelligence")
            if resilience.level in [ResilienceLevel.LOW]:
                priorities.append("resilience")
            if not executive_function.age_appropriate:
                priorities.append("executive_function")

        return priorities

    def _identify_strengths(self, *assessments) -> List[str]:
        """Identify areas of strength"""
        strengths = []

        # Check CASEL competencies
        self_awareness, self_management, social_awareness, relationship_skills, responsible_decision = assessments[:5]

        if self_awareness.level == CompetencyLevel.ABOVE_EXPECTED:
            strengths.append("self_awareness")
        if self_management.level == CompetencyLevel.ABOVE_EXPECTED:
            strengths.append("self_management")
        if social_awareness.level == CompetencyLevel.ABOVE_EXPECTED:
            strengths.append("social_awareness")
        if relationship_skills.level == CompetencyLevel.ABOVE_EXPECTED:
            strengths.append("relationship_skills")
        if responsible_decision.level == CompetencyLevel.ABOVE_EXPECTED:
            strengths.append("responsible_decision_making")

        # Check additional assessments
        if len(assessments) > 5:
            emotional_intelligence, resilience, _ = assessments[5:8]

            if emotional_intelligence.level == EmotionalIntelligenceLevel.ADVANCED:
                strengths.append("emotional_intelligence")
            if resilience.level == ResilienceLevel.VERY_HIGH:
                strengths.append("resilience")

        return strengths

    def _generate_overall_recommendations(self, *args) -> List[str]:
        """Generate overall SEL recommendations"""
        (self_awareness, self_management, social_awareness, relationship_skills,
         responsible_decision, emotional_intelligence, resilience,
         mental_health, executive_function, overall_level, priority_areas) = args

        recommendations = []

        # Priority based on overall level
        if overall_level == CompetencyLevel.SIGNIFICANTLY_BELOW:
            recommendations.append("Comprehensive SEL intervention program recommended")
            recommendations.append("Small group or individual counseling 2-3x weekly")
        elif overall_level == CompetencyLevel.BELOW_EXPECTED:
            recommendations.append("SEL intervention and support services recommended")
            recommendations.append("Weekly counseling or SEL curriculum participation")
        elif overall_level == CompetencyLevel.DEVELOPING:
            recommendations.append("Continue SEL instruction and monitor progress")

        # Mental health concerns
        if mental_health.referral_recommended:
            recommendations.extend(mental_health.recommendations[:2])

        # Priority areas
        if priority_areas:
            recommendations.append(
                f"Focus intervention on: {', '.join(priority_areas[:3])}"
            )

        # Collect unique recommendations from all domains
        all_recs = (
            self_awareness.recommendations +
            self_management.recommendations +
            social_awareness.recommendations +
            relationship_skills.recommendations +
            responsible_decision.recommendations +
            emotional_intelligence.recommendations +
            resilience.recommendations
        )

        unique_recs = []
        for rec in all_recs:
            if rec not in unique_recs and rec not in recommendations:
                unique_recs.append(rec)

        recommendations.extend(unique_recs[:6])  # Top 6 specific recommendations

        return recommendations
