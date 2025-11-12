"""
Comprehensive Report Generator
Generates unified assessment reports across all domains
"""
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime

logger = logging.getLogger(__name__)


@dataclass
class ExecutiveSummary:
    """Executive summary of comprehensive assessment"""
    child_id: str
    assessment_date: str
    chronological_age: float
    grade_level: str
    domains_assessed: List[str]
    overall_summary: str
    key_findings: List[str]
    priority_recommendations: List[str]


@dataclass
class DomainProfile:
    """Profile for a specific domain"""
    domain_name: str
    status: str  # strength, age_appropriate, concern, significant_concern
    summary: str
    strengths: List[str]
    challenges: List[str]
    recommendations: List[str]


@dataclass
class CrossDomainAnalysis:
    """Analysis of patterns across domains"""
    patterns: List[str]
    interconnections: List[str]
    impact_analysis: Dict[str, List[str]]  # domain -> impacts on other domains
    integrated_needs: List[str]


@dataclass
class ComprehensiveReport:
    """Complete comprehensive assessment report"""
    executive_summary: ExecutiveSummary
    academic_profile: Optional[DomainProfile]
    speech_language_profile: Optional[DomainProfile]
    social_emotional_profile: Optional[DomainProfile]
    cross_domain_analysis: CrossDomainAnalysis
    integrated_recommendations: List[str]
    personalized_plan: Dict
    next_steps: List[str]
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "executive_summary": {
                "child_id": self.executive_summary.child_id,
                "assessment_date": self.executive_summary.assessment_date,
                "chronological_age": self.executive_summary.chronological_age,
                "grade_level": self.executive_summary.grade_level,
                "domains_assessed": self.executive_summary.domains_assessed,
                "overall_summary": self.executive_summary.overall_summary,
                "key_findings": self.executive_summary.key_findings,
                "priority_recommendations": self.executive_summary.priority_recommendations
            },
            "domain_profiles": {
                "academic": self._profile_to_dict(self.academic_profile),
                "speech_language": self._profile_to_dict(self.speech_language_profile),
                "social_emotional": self._profile_to_dict(self.social_emotional_profile)
            },
            "cross_domain_analysis": {
                "patterns": self.cross_domain_analysis.patterns,
                "interconnections": self.cross_domain_analysis.interconnections,
                "impact_analysis": self.cross_domain_analysis.impact_analysis,
                "integrated_needs": self.cross_domain_analysis.integrated_needs
            },
            "integrated_recommendations": self.integrated_recommendations,
            "personalized_plan": self.personalized_plan,
            "next_steps": self.next_steps
        }
    
    def _profile_to_dict(self, profile: Optional[DomainProfile]) -> Optional[Dict]:
        """Convert domain profile to dict"""
        if not profile:
            return None
        return {
            "domain_name": profile.domain_name,
            "status": profile.status,
            "summary": profile.summary,
            "strengths": profile.strengths,
            "challenges": profile.challenges,
            "recommendations": profile.recommendations
        }


class ReportGenerator:
    """
    Comprehensive Report Generator
    
    Generates unified assessment reports integrating:
    - Academic assessment results (IRT)
    - Speech and language evaluation
    - Social-emotional learning assessment
    
    Provides cross-domain analysis and integrated recommendations
    """
    
    def generate_comprehensive_report(
        self,
        child_id: str,
        age: float,
        grade: str,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> ComprehensiveReport:
        """
        Generate comprehensive assessment report
        
        Args:
            child_id: Child's unique identifier
            age: Child's age in years
            grade: Grade level
            academic_results: Academic assessment data
            speech_results: Speech/language assessment data
            sel_results: SEL assessment data
        
        Returns:
            ComprehensiveReport with all sections
        """
        logger.info(f"Generating comprehensive report for child {child_id}")
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(
            child_id, age, grade, academic_results, speech_results, sel_results
        )
        
        # Generate domain profiles
        academic_profile = self._generate_academic_profile(academic_results)
        speech_profile = self._generate_speech_profile(speech_results)
        sel_profile = self._generate_sel_profile(sel_results)
        
        # Cross-domain analysis
        cross_domain = self._generate_cross_domain_analysis(
            academic_results, speech_results, sel_results
        )
        
        # Integrated recommendations
        recommendations = self._generate_integrated_recommendations(
            academic_profile, speech_profile, sel_profile, cross_domain
        )
        
        # Personalized plan (placeholder - would call plan generator)
        personalized_plan = {
            "note": "See personalized AIVO learning plan section"
        }
        
        # Next steps
        next_steps = self._generate_next_steps(
            academic_profile, speech_profile, sel_profile
        )
        
        return ComprehensiveReport(
            executive_summary=executive_summary,
            academic_profile=academic_profile,
            speech_language_profile=speech_profile,
            social_emotional_profile=sel_profile,
            cross_domain_analysis=cross_domain,
            integrated_recommendations=recommendations,
            personalized_plan=personalized_plan,
            next_steps=next_steps
        )
    
    def _generate_executive_summary(
        self,
        child_id: str,
        age: float,
        grade: str,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> ExecutiveSummary:
        """Generate executive summary"""
        
        domains_assessed = []
        key_findings = []
        priority_recommendations = []
        
        # Identify assessed domains
        if academic_results:
            domains_assessed.append("academic")
            key_findings.append(
                f"Academic assessment initiated in {len(academic_results)} subjects"
            )
        
        if speech_results and "error" not in speech_results:
            domains_assessed.append("speech_language")
            
            # Key speech findings
            therapy_rec = speech_results.get("summary", {}).get("therapy_recommended")
            if therapy_rec:
                severity = speech_results.get("summary", {}).get("overall_severity", "")
                key_findings.append(
                    f"Speech/language therapy recommended ({severity} severity)"
                )
                priority_recommendations.append("Speech-language therapy services")
        
        if sel_results and "error" not in sel_results:
            domains_assessed.append("social_emotional")
            
            # Key SEL findings
            intervention = sel_results.get("summary", {}).get("intervention_recommended")
            if intervention:
                key_findings.append(
                    "Social-emotional intervention recommended"
                )
                priority_recommendations.append("SEL support services")
            
            # Mental health concerns
            mh_risk = sel_results.get("mental_health", {}).get("risk_level", "")
            if mh_risk in ["moderate_concern", "significant_concern"]:
                key_findings.append(
                    f"Mental health screening: {mh_risk.replace('_', ' ')}"
                )
                priority_recommendations.append("Mental health referral")
        
        # Overall summary
        if len(domains_assessed) >= 3:
            overall_summary = (
                f"Comprehensive evaluation completed for {grade} student across "
                f"academic, speech/language, and social-emotional domains. "
                f"Assessment reveals specific strengths and targeted areas for growth."
            )
        else:
            overall_summary = (
                f"Multi-domain evaluation completed in: "
                f"{', '.join(domains_assessed)}. "
                f"Additional assessment recommended for comprehensive profile."
            )
        
        return ExecutiveSummary(
            child_id=child_id,
            assessment_date=datetime.now().isoformat(),
            chronological_age=age,
            grade_level=grade,
            domains_assessed=domains_assessed,
            overall_summary=overall_summary,
            key_findings=key_findings,
            priority_recommendations=priority_recommendations
        )
    
    def _generate_academic_profile(
        self,
        academic_results: Dict
    ) -> Optional[DomainProfile]:
        """Generate academic domain profile"""
        
        if not academic_results:
            return None
        
        subjects = list(academic_results.keys())
        
        summary = (
            f"Academic assessment initiated in {len(subjects)} subject area(s): "
            f"{', '.join(subjects)}. Complete adaptive testing in progress."
        )
        
        return DomainProfile(
            domain_name="Academic Performance",
            status="assessment_in_progress",
            summary=summary,
            strengths=[],
            challenges=[],
            recommendations=[
                "Complete adaptive academic assessment in all core subjects",
                "Monitor progress and adjust difficulty based on IRT results"
            ]
        )
    
    def _generate_speech_profile(
        self,
        speech_results: Optional[Dict]
    ) -> Optional[DomainProfile]:
        """Generate speech/language domain profile"""
        
        if not speech_results or "error" in speech_results:
            return None
        
        # Determine overall status
        therapy_rec = speech_results.get("summary", {}).get("therapy_recommended", False)
        severity = speech_results.get("summary", {}).get("overall_severity", "minimal")
        
        if severity == "severe":
            status = "significant_concern"
        elif severity == "moderate":
            status = "concern"
        elif severity == "mild":
            status = "mild_concern"
        else:
            status = "age_appropriate"
        
        # Identify strengths
        strengths = []
        if speech_results.get("articulation", {}).get("age_appropriate"):
            strengths.append("Age-appropriate articulation")
        if speech_results.get("language", {}).get("age_appropriate"):
            strengths.append("Age-appropriate language development")
        if speech_results.get("fluency", {}).get("age_appropriate"):
            strengths.append("Fluent speech production")
        if speech_results.get("pragmatics", {}).get("age_appropriate"):
            strengths.append("Effective social communication")
        
        # Identify challenges
        challenges = []
        priority_areas = speech_results.get("summary", {}).get("priority_areas", [])
        for area in priority_areas:
            challenges.append(f"{area.replace('_', ' ').title()} needs support")
        
        # Get recommendations
        recommendations = speech_results.get("summary", {}).get("recommendations", [])
        
        # Summary
        summary = f"Speech and language evaluation reveals {severity} concerns. "
        if therapy_rec:
            duration = speech_results.get("summary", {}).get("estimated_therapy_duration", "")
            summary += f"Therapy recommended for approximately {duration}. "
        if priority_areas:
            summary += f"Priority areas: {', '.join(priority_areas)}."
        
        return DomainProfile(
            domain_name="Speech and Language",
            status=status,
            summary=summary,
            strengths=strengths,
            challenges=challenges,
            recommendations=recommendations
        )
    
    def _generate_sel_profile(
        self,
        sel_results: Optional[Dict]
    ) -> Optional[DomainProfile]:
        """Generate social-emotional domain profile"""
        
        if not sel_results or "error" in sel_results:
            return None
        
        # Determine overall status
        overall_level = sel_results.get("summary", {}).get("overall_sel_level", "")
        intervention = sel_results.get("summary", {}).get("intervention_recommended", False)
        
        if overall_level == "significantly_below":
            status = "significant_concern"
        elif overall_level == "below_expected":
            status = "concern"
        elif overall_level == "developing":
            status = "emerging"
        elif overall_level == "at_expected":
            status = "age_appropriate"
        else:
            status = "strength"
        
        # Identify strengths
        strength_areas = sel_results.get("summary", {}).get("strengths", [])
        strengths = [
            f"Strong {area.replace('_', ' ')}"
            for area in strength_areas
        ]
        
        # Identify challenges
        priority_areas = sel_results.get("summary", {}).get("priority_areas", [])
        challenges = [
            f"{area.replace('_', ' ').title()} needs development"
            for area in priority_areas
        ]
        
        # Mental health screening
        mh_risk = sel_results.get("mental_health", {}).get("risk_level", "")
        if mh_risk != "no_concerns":
            challenges.append(
                f"Mental health screening: {mh_risk.replace('_', ' ')}"
            )
        
        # Get recommendations
        recommendations = sel_results.get("summary", {}).get("recommendations", [])
        
        # Summary
        overall_score = sel_results.get("summary", {}).get("overall_sel_score", 70)
        summary = (
            f"Social-emotional assessment reveals overall competency at "
            f"{overall_level.replace('_', ' ')} level (score: {overall_score:.1f}). "
        )
        if intervention:
            summary += "SEL intervention recommended. "
        if priority_areas:
            summary += f"Focus areas: {', '.join(priority_areas[:3])}."
        
        return DomainProfile(
            domain_name="Social-Emotional Learning",
            status=status,
            summary=summary,
            strengths=strengths,
            challenges=challenges,
            recommendations=recommendations
        )
    
    def _generate_cross_domain_analysis(
        self,
        academic_results: Dict,
        speech_results: Optional[Dict],
        sel_results: Optional[Dict]
    ) -> CrossDomainAnalysis:
        """Generate cross-domain analysis"""
        
        patterns = []
        interconnections = []
        impact_analysis = {}
        integrated_needs = []
        
        # Language-Academic connections
        if speech_results and "error" not in speech_results:
            lang_appropriate = speech_results.get("language", {}).get("age_appropriate")
            
            if not lang_appropriate:
                patterns.append(
                    "Language delays may impact reading comprehension, "
                    "written expression, and academic vocabulary"
                )
                interconnections.append("speech_language -> academic")
                impact_analysis["speech_language"] = [
                    "reading_comprehension",
                    "written_expression",
                    "vocabulary_development"
                ]
                integrated_needs.append(
                    "Coordinate language therapy with academic instruction"
                )
        
        # Pragmatics-Social Skills connections
        if (speech_results and sel_results and
            "error" not in speech_results and "error" not in sel_results):
            
            prag_appropriate = speech_results.get("pragmatics", {}).get("age_appropriate")
            rel_skills_level = (sel_results.get("casel_competencies", {})
                               .get("relationship_skills", {}).get("level", ""))
            
            if (not prag_appropriate and
                rel_skills_level in ["below_expected", "significantly_below"]):
                patterns.append(
                    "Social communication challenges evident across both "
                    "speech pragmatics and relationship skills domains"
                )
                interconnections.append("speech_language <-> social_emotional")
                integrated_needs.append(
                    "Integrated social communication intervention combining "
                    "speech therapy and SEL"
                )
        
        # Executive Function-Academic connections
        if sel_results and "error" not in sel_results:
            ef_appropriate = sel_results.get("executive_function", {}).get(
                "age_appropriate", True
            )
            
            if not ef_appropriate:
                patterns.append(
                    "Executive function challenges may impact academic "
                    "organization, task completion, and study skills"
                )
                interconnections.append("social_emotional -> academic")
                impact_analysis["social_emotional"] = [
                    "organization",
                    "task_completion",
                    "study_skills"
                ]
                integrated_needs.append(
                    "Executive function coaching integrated with academic support"
                )
        
        # Emotional Regulation-Learning connections
        if sel_results and "error" not in sel_results:
            reg_score = (sel_results.get("emotional_intelligence", {})
                        .get("regulating_emotions", 70))
            
            if reg_score < 60:
                patterns.append(
                    "Emotional regulation challenges may affect classroom "
                    "engagement and learning readiness"
                )
                integrated_needs.append(
                    "Provide emotion regulation strategies before challenging tasks"
                )
        
        # Articulation-Social confidence connections
        if (speech_results and sel_results and
            "error" not in speech_results and "error" not in sel_results):
            
            intelligibility = speech_results.get("articulation", {}).get(
                "intelligibility_percent", 95
            )
            self_awareness = sel_results.get("casel_competencies", {}).get(
                "self_awareness", {}
            )
            
            if intelligibility < 85:
                patterns.append(
                    "Low speech intelligibility may impact self-confidence "
                    "and social interactions"
                )
                integrated_needs.append(
                    "Build self-confidence while addressing articulation"
                )
        
        return CrossDomainAnalysis(
            patterns=patterns,
            interconnections=interconnections,
            impact_analysis=impact_analysis,
            integrated_needs=integrated_needs
        )
    
    def _generate_integrated_recommendations(
        self,
        academic_profile: Optional[DomainProfile],
        speech_profile: Optional[DomainProfile],
        sel_profile: Optional[DomainProfile],
        cross_domain: CrossDomainAnalysis
    ) -> List[str]:
        """Generate integrated recommendations across all domains"""
        
        recommendations = []
        
        # Priority: Significant concerns
        if speech_profile and speech_profile.status == "significant_concern":
            recommendations.append(
                "PRIORITY: Immediate speech-language evaluation and intervention"
            )
        
        if sel_profile and sel_profile.status == "significant_concern":
            recommendations.append(
                "PRIORITY: Mental health referral and SEL intervention"
            )
        
        # Integrated needs from cross-domain analysis
        recommendations.extend(cross_domain.integrated_needs)
        
        # Domain-specific top recommendations
        if speech_profile and speech_profile.recommendations:
            recommendations.extend(speech_profile.recommendations[:2])
        
        if sel_profile and sel_profile.recommendations:
            recommendations.extend(sel_profile.recommendations[:2])
        
        if academic_profile and academic_profile.recommendations:
            recommendations.extend(academic_profile.recommendations[:1])
        
        # General comprehensive recommendations
        if len([p for p in [academic_profile, speech_profile, sel_profile] if p]) >= 2:
            recommendations.append(
                "Schedule interdisciplinary team meeting to coordinate interventions"
            )
            recommendations.append(
                "Establish progress monitoring across all domains"
            )
        
        return recommendations
    
    def _generate_next_steps(
        self,
        academic_profile: Optional[DomainProfile],
        speech_profile: Optional[DomainProfile],
        sel_profile: Optional[DomainProfile]
    ) -> List[str]:
        """Generate next steps"""
        
        next_steps = []
        
        # Academic next steps
        if academic_profile:
            next_steps.append(
                "Complete adaptive academic assessment in all subject areas"
            )
        
        # Speech next steps
        if speech_profile:
            if speech_profile.status in ["concern", "significant_concern"]:
                next_steps.append(
                    "Schedule speech-language therapy evaluation and begin services"
                )
                next_steps.append(
                    "Parent training session for home practice activities"
                )
        
        # SEL next steps
        if sel_profile:
            if sel_profile.status in ["concern", "significant_concern"]:
                next_steps.append(
                    "Initiate SEL curriculum and weekly counseling check-ins"
                )
            
            # Check for mental health referral
            if "mental health" in sel_profile.summary.lower():
                next_steps.append(
                    "Complete mental health referral within 1 week"
                )
        
        # General next steps
        next_steps.append(
            "Review personalized AIVO learning plan with parents and student"
        )
        next_steps.append(
            "Schedule 6-week progress review to assess intervention effectiveness"
        )
        
        return next_steps


# Singleton instance
report_generator = ReportGenerator()
