"""
Personalized AIVO Learning Plan Generator
Creates individualized learning plans based on comprehensive assessment
"""
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@dataclass
class WeeklySchedule:
    """Weekly intervention schedule"""
    academic_sessions: Dict[str, str]  # subject -> frequency
    speech_therapy: Optional[str]  # e.g., "2x per week, 30 min"
    sel_activities: Optional[str]  # e.g., "Daily, 15 min"
    counseling: Optional[str]  # e.g., "Weekly check-ins"
    other_services: Dict[str, str]  # service -> frequency


@dataclass
class Goal:
    """Individual learning goal"""
    domain: str  # academic, speech, sel
    category: str  # e.g., articulation, self_awareness, math
    description: str
    target_date: str
    success_criteria: str
    progress_monitoring: str


@dataclass
class Accommodation:
    """Classroom or testing accommodation"""
    category: str  # academic, speech, sel, executive_function
    description: str
    implementation: str
    responsible_party: str


@dataclass
class PersonalizedPlan:
    """Complete personalized AIVO learning plan"""
    child_id: str
    plan_date: str
    review_date: str

    plan_name: str
    focus_areas: List[str]

    weekly_schedule: WeeklySchedule
    goals: List[Goal]
    accommodations: List[Accommodation]

    parent_involvement: List[str]
    home_activities: List[Dict[str, str]]
    progress_monitoring: Dict[str, str]

    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "child_id": self.child_id,
            "plan_date": self.plan_date,
            "review_date": self.review_date,
            "plan_name": self.plan_name,
            "focus_areas": self.focus_areas,
            "weekly_schedule": {
                "academic_sessions": self.weekly_schedule.academic_sessions,
                "speech_therapy": self.weekly_schedule.speech_therapy,
                "sel_activities": self.weekly_schedule.sel_activities,
                "counseling": self.weekly_schedule.counseling,
                "other_services": self.weekly_schedule.other_services
            },
            "goals": [
                {
                    "domain": g.domain,
                    "category": g.category,
                    "description": g.description,
                    "target_date": g.target_date,
                    "success_criteria": g.success_criteria,
                    "progress_monitoring": g.progress_monitoring
                }
                for g in self.goals
            ],
            "accommodations": [
                {
                    "category": a.category,
                    "description": a.description,
                    "implementation": a.implementation,
                    "responsible_party": a.responsible_party
                }
                for a in self.accommodations
            ],
            "parent_involvement": self.parent_involvement,
            "home_activities": self.home_activities,
            "progress_monitoring": self.progress_monitoring
        }


class PlanGenerator:
    """
    Personalized AIVO Learning Plan Generator

    Creates comprehensive, individualized learning plans based on:
    - Academic assessment results
    - Speech/language evaluation
    - Social-emotional assessment
    - Cross-domain analysis
    """

    def generate_personalized_plan(
        self,
        child_id: str,
        age: float,
        grade: str,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> PersonalizedPlan:
        """
        Generate personalized AIVO learning plan

        Args:
            child_id: Child's unique identifier
            age: Child's age in years
            grade: Grade level
            academic_results: Academic assessment results
            speech_results: Speech/language assessment results
            sel_results: SEL assessment results

        Returns:
            PersonalizedPlan with complete intervention plan
        """
        logger.info(f"Generating personalized plan for child {child_id}")

        plan_date = datetime.now()
        review_date = plan_date + timedelta(weeks=6)

        # Determine focus areas
        focus_areas = self._identify_focus_areas(
            academic_results, speech_results, sel_results
        )

        # Create weekly schedule
        weekly_schedule = self._create_weekly_schedule(
            academic_results, speech_results, sel_results
        )

        # Generate goals
        goals = self._generate_goals(
            age, grade, academic_results, speech_results, sel_results
        )

        # Determine accommodations
        accommodations = self._determine_accommodations(
            academic_results, speech_results, sel_results
        )

        # Parent involvement strategies
        parent_involvement = self._create_parent_involvement(
            speech_results, sel_results
        )

        # Home activities
        home_activities = self._create_home_activities(
            age, speech_results, sel_results
        )

        # Progress monitoring plan
        progress_monitoring = self._create_progress_monitoring(
            focus_areas
        )

        plan_name = f"Personalized AIVO Learning Plan - Grade {grade}"

        return PersonalizedPlan(
            child_id=child_id,
            plan_date=plan_date.isoformat(),
            review_date=review_date.isoformat(),
            plan_name=plan_name,
            focus_areas=focus_areas,
            weekly_schedule=weekly_schedule,
            goals=goals,
            accommodations=accommodations,
            parent_involvement=parent_involvement,
            home_activities=home_activities,
            progress_monitoring=progress_monitoring
        )

    def _identify_focus_areas(
        self,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> List[str]:
        """Identify primary focus areas for intervention"""

        focus_areas = []

        # Academic areas
        if academic_results:
            for subject in academic_results.keys():
                focus_areas.append(f"academic_{subject}")

        # Speech/language areas
        if speech_results and "error" not in speech_results:
            priority_areas = speech_results.get("summary", {}).get(
                "priority_areas", []
            )
            for area in priority_areas:
                focus_areas.append(f"speech_{area}")

        # SEL areas
        if sel_results and "error" not in sel_results:
            priority_areas = sel_results.get("summary", {}).get(
                "priority_areas", []
            )
            for area in priority_areas[:3]:  # Top 3
                focus_areas.append(f"sel_{area}")

        return focus_areas

    def _create_weekly_schedule(
        self,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> WeeklySchedule:
        """Create weekly intervention schedule"""

        academic_sessions = {}
        if academic_results:
            for subject in academic_results.keys():
                academic_sessions[subject] = "Daily adaptive lessons (20-30 min)"

        # Speech therapy schedule
        speech_therapy = None
        if speech_results and "error" not in speech_results:
            if speech_results.get("summary", {}).get("therapy_recommended"):
                severity = speech_results.get("summary", {}).get("overall_severity")
                if severity == "severe":
                    speech_therapy = "2-3 sessions per week (45 min each)"
                elif severity == "moderate":
                    speech_therapy = "1-2 sessions per week (30-45 min)"
                else:
                    speech_therapy = "1 session per week (30 min)"

        # SEL activities schedule
        sel_activities = None
        counseling = None
        if sel_results and "error" not in sel_results:
            if sel_results.get("summary", {}).get("intervention_recommended"):
                sel_activities = "Daily SEL curriculum (15-20 min)"
                counseling = "Weekly individual or group counseling (30 min)"
            else:
                sel_activities = "Daily SEL moments (5-10 min)"

        other_services = {}

        # Executive function coaching
        if sel_results and "error" not in sel_results:
            if not sel_results.get("executive_function", {}).get("age_appropriate"):
                other_services["executive_function_coaching"] = \
                    "2x per week (20 min)"

        return WeeklySchedule(
            academic_sessions=academic_sessions,
            speech_therapy=speech_therapy,
            sel_activities=sel_activities,
            counseling=counseling,
            other_services=other_services
        )

    def _generate_goals(
        self,
        age: float,
        grade: str,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> List[Goal]:
        """Generate SMART goals"""

        goals = []
        target_date = (datetime.now() + timedelta(weeks=12)).strftime("%Y-%m-%d")

        # Academic goals
        if academic_results:
            for subject in academic_results.keys():
                goals.append(Goal(
                    domain="academic",
                    category=subject,
                    description=f"Demonstrate grade-level proficiency in {subject}",
                    target_date=target_date,
                    success_criteria=f"IRT theta score ≥ 0.0 (grade level)",
                    progress_monitoring="Weekly adaptive assessments"
                ))

        # Speech/language goals
        if speech_results and "error" not in speech_results:
            priority_areas = speech_results.get("summary", {}).get(
                "priority_areas", []
            )

            if "articulation" in priority_areas:
                error_sounds = speech_results.get("articulation", {}).get(
                    "error_sounds", []
                )
                if error_sounds:
                    goals.append(Goal(
                        domain="speech",
                        category="articulation",
                        description=f"Produce {error_sounds[0]} sound correctly "
                                   f"in words and sentences",
                        target_date=target_date,
                        success_criteria="80% accuracy in spontaneous speech",
                        progress_monitoring="Weekly speech samples"
                    ))

            if "language" in priority_areas:
                goals.append(Goal(
                    domain="speech",
                    category="language",
                    description="Improve expressive language skills",
                    target_date=target_date,
                    success_criteria="MLU within 6 months of chronological age",
                    progress_monitoring="Monthly language samples"
                ))

        # SEL goals
        if sel_results and "error" not in sel_results:
            priority_areas = sel_results.get("summary", {}).get(
                "priority_areas", []
            )

            if "self_management" in priority_areas:
                goals.append(Goal(
                    domain="sel",
                    category="self_management",
                    description="Use emotion regulation strategies independently",
                    target_date=target_date,
                    success_criteria="Uses 3+ coping strategies without prompting",
                    progress_monitoring="Daily emotion check-ins and teacher reports"
                ))

            if "relationship_skills" in priority_areas:
                goals.append(Goal(
                    domain="sel",
                    category="relationship_skills",
                    description="Demonstrate positive peer interactions",
                    target_date=target_date,
                    success_criteria="80% positive interactions observed",
                    progress_monitoring="Weekly social skills observations"
                ))

        return goals

    def _determine_accommodations(
        self,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> List[Accommodation]:
        """Determine necessary accommodations"""

        accommodations = []

        # Speech accommodations
        if speech_results and "error" not in speech_results:
            if not speech_results.get("articulation", {}).get("age_appropriate"):
                accommodations.append(Accommodation(
                    category="speech",
                    description="Extra time for verbal responses",
                    implementation="Allow 50% additional time for oral presentations",
                    responsible_party="All teachers"
                ))

            if not speech_results.get("language", {}).get("age_appropriate"):
                accommodations.append(Accommodation(
                    category="speech",
                    description="Visual supports and simplified language",
                    implementation="Use visual aids, graphic organizers, "
                                  "and break instructions into steps",
                    responsible_party="All teachers"
                ))

        # Executive function accommodations
        if sel_results and "error" not in sel_results:
            if not sel_results.get("executive_function", {}).get("age_appropriate"):
                accommodations.extend([
                    Accommodation(
                        category="executive_function",
                        description="Extended time for assignments and tests",
                        implementation="Time and a half for all assessments",
                        responsible_party="All teachers"
                    ),
                    Accommodation(
                        category="executive_function",
                        description="Organizational supports",
                        implementation="Provide checklists, planners, "
                                      "and visual schedules",
                        responsible_party="Case manager"
                    ),
                    Accommodation(
                        category="executive_function",
                        description="Task breakdown",
                        implementation="Break long assignments into smaller steps",
                        responsible_party="All teachers"
                    )
                ])

        # SEL accommodations
        if sel_results and "error" not in sel_results:
            if sel_results.get("summary", {}).get("intervention_recommended"):
                accommodations.append(Accommodation(
                    category="sel",
                    description="Emotion regulation breaks",
                    implementation="Allow breaks as needed for emotion regulation",
                    responsible_party="All teachers"
                ))

                accommodations.append(Accommodation(
                    category="sel",
                    description="Quiet space access",
                    implementation="Provide access to calm-down space when needed",
                    responsible_party="School counselor"
                ))

        return accommodations

    def _create_parent_involvement(
        self,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> List[str]:
        """Create parent involvement strategies"""

        strategies = []

        # General involvement
        strategies.append(
            "Review AIVO progress reports weekly with your child"
        )
        strategies.append(
            "Celebrate effort and progress, not just outcomes"
        )

        # Speech involvement
        if speech_results and "error" not in speech_results:
            if speech_results.get("summary", {}).get("therapy_recommended"):
                strategies.append(
                    "Practice speech exercises at home 10-15 minutes daily"
                )
                strategies.append(
                    "Attend parent training sessions with speech therapist"
                )

        # SEL involvement
        if sel_results and "error" not in sel_results:
            strategies.append(
                "Daily emotion check-ins at home (morning and evening)"
            )
            strategies.append(
                "Practice mindfulness or breathing exercises together"
            )

            if sel_results.get("summary", {}).get("intervention_recommended"):
                strategies.append(
                    "Reinforce coping strategies learned in counseling"
                )

        return strategies

    def _create_home_activities(
        self,
        age: float,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> List[Dict[str, str]]:
        """Create suggested home activities"""

        activities = []

        # Speech activities
        if speech_results and "error" not in speech_results:
            priority_areas = speech_results.get("summary", {}).get(
                "priority_areas", []
            )

            if "articulation" in priority_areas:
                activities.append({
                    "domain": "speech",
                    "activity": "Sound Practice Games",
                    "description": "Play games that practice target sounds "
                                  "(e.g., I Spy, Go Fish with target words)",
                    "frequency": "10 minutes daily",
                    "materials": "Target word list from speech therapist"
                })

            if "language" in priority_areas:
                activities.append({
                    "domain": "speech",
                    "activity": "Story Time Conversations",
                    "description": "Read together and ask 'who, what, where, "
                                  "when, why' questions",
                    "frequency": "15 minutes daily",
                    "materials": "Age-appropriate books"
                })

        # SEL activities
        if sel_results and "error" not in sel_results:
            activities.append({
                "domain": "sel",
                "activity": "Emotion Check-In",
                "description": "Use feelings chart to identify and discuss emotions",
                "frequency": "Twice daily (morning and bedtime)",
                "materials": "Feelings chart or emotion cards"
            })

            activities.append({
                "domain": "sel",
                "activity": "Mindful Breathing",
                "description": "Practice deep breathing exercises together",
                "frequency": "5 minutes daily",
                "materials": "Breathing apps or guided videos"
            })

            priority_areas = sel_results.get("summary", {}).get(
                "priority_areas", []
            )

            if "self_management" in priority_areas:
                activities.append({
                    "domain": "sel",
                    "activity": "Coping Skills Practice",
                    "description": "Practice and discuss coping strategies "
                                  "(e.g., counting to 10, squeezing stress ball)",
                    "frequency": "As needed, review daily",
                    "materials": "Coping skills toolkit"
                })

        return activities

    def _create_progress_monitoring(
        self,
        focus_areas: List[str]
    ) -> Dict[str, str]:
        """Create progress monitoring plan"""

        monitoring = {}

        # Academic monitoring
        if any("academic" in area for area in focus_areas):
            monitoring["academic"] = "Weekly IRT adaptive assessments and skill mastery tracking"

        # Speech monitoring
        if any("speech" in area for area in focus_areas):
            monitoring["speech"] = "Weekly speech samples and therapist progress notes"

        # SEL monitoring
        if any("sel" in area for area in focus_areas):
            monitoring["sel"] = "Daily emotion check-ins and weekly counselor observations"

        # Overall
        monitoring["comprehensive_review"] = "6-week interdisciplinary team review"
        monitoring["parent_conferences"] = "Monthly progress updates with family"

        return monitoring


# Singleton instance
plan_generator = PlanGenerator()
