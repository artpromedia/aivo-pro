"""
Skill Vector Calculation
Multidimensional IRT analysis for skill mastery
"""
import numpy as np
from typing import Dict, List
from dataclasses import dataclass
import logging

from src.core.irt_engine import Response, ItemParameters, irt_engine

logger = logging.getLogger(__name__)


@dataclass
class SkillMastery:
    """Mastery information for a skill"""
    skill: str
    mastery: float  # 0.0 to 1.0
    confidence: float  # 0.0 to 1.0
    items_answered: int
    theta: float
    standard_error: float


class SkillAnalyzer:
    """Analyzes responses to calculate skill-specific mastery"""
    
    def calculate_skill_vector(
        self,
        responses: List[Response],
        item_params: Dict[str, ItemParameters],
        item_skills: Dict[str, str],  # Maps item_id to skill
        overall_theta: float
    ) -> Dict[str, SkillMastery]:
        """
        Calculate mastery for each skill from responses
        
        Args:
            responses: List of student responses
            item_params: Dictionary of item parameters
            item_skills: Mapping from item_id to skill name
            overall_theta: Overall ability estimate
            
        Returns:
            Dictionary mapping skill to SkillMastery
        """
        # Group responses by skill
        skill_responses: Dict[str, List[Response]] = {}
        
        for response in responses:
            skill = item_skills.get(response.item_id)
            if skill:
                if skill not in skill_responses:
                    skill_responses[skill] = []
                skill_responses[skill].append(response)
        
        # Calculate mastery for each skill
        skill_vector: Dict[str, SkillMastery] = {}
        
        for skill, skill_resp in skill_responses.items():
            # Estimate ability for this skill
            theta, se = irt_engine.estimate_ability_mle(
                skill_resp,
                item_params,
                initial_theta=overall_theta
            )
            
            # Convert theta to mastery scale (0 to 1)
            # Using logistic transformation
            mastery = 1.0 / (1.0 + np.exp(-theta))
            
            # Calculate confidence (inverse of standard error)
            # Normalized to 0-1 range
            confidence = 1.0 / (1.0 + se)
            
            skill_vector[skill] = SkillMastery(
                skill=skill,
                mastery=round(float(mastery), 3),
                confidence=round(float(confidence), 3),
                items_answered=len(skill_resp),
                theta=round(float(theta), 3),
                standard_error=round(float(se), 3)
            )
        
        # Fill in skills with no responses using overall theta
        all_skills = set(item_skills.values())
        for skill in all_skills:
            if skill not in skill_vector:
                # Use overall theta as estimate
                mastery = 1.0 / (1.0 + np.exp(-overall_theta))
                
                skill_vector[skill] = SkillMastery(
                    skill=skill,
                    mastery=round(float(mastery), 3),
                    confidence=0.0,  # No confidence without data
                    items_answered=0,
                    theta=round(overall_theta, 3),
                    standard_error=float('inf')
                )
        
        return skill_vector
    
    def identify_strengths_weaknesses(
        self,
        skill_vector: Dict[str, SkillMastery],
        strength_threshold: float = 0.7,
        weakness_threshold: float = 0.4
    ) -> Dict:
        """
        Identify student's strengths and weaknesses
        
        Args:
            skill_vector: Calculated skill mastery
            strength_threshold: Mastery threshold for strength
            weakness_threshold: Mastery threshold for weakness
            
        Returns:
            Dictionary with strengths and weaknesses
        """
        strengths = [
            skill for skill, mastery in skill_vector.items()
            if mastery.mastery >= strength_threshold and
            mastery.confidence > 0.5
        ]
        
        weaknesses = [
            skill for skill, mastery in skill_vector.items()
            if mastery.mastery <= weakness_threshold and
            mastery.confidence > 0.5
        ]
        
        developing = [
            skill for skill, mastery in skill_vector.items()
            if weakness_threshold < mastery.mastery < strength_threshold and
            mastery.confidence > 0.5
        ]
        
        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "developing": developing,
            "needs_assessment": [
                skill for skill, mastery in skill_vector.items()
                if mastery.confidence <= 0.5
            ]
        }
    
    def generate_recommendations(
        self,
        skill_vector: Dict[str, SkillMastery],
        analysis: Dict
    ) -> List[str]:
        """
        Generate learning recommendations
        
        Args:
            skill_vector: Calculated skill mastery
            analysis: Strengths/weaknesses analysis
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # Prioritize weaknesses
        if analysis["weaknesses"]:
            weak_skills = ", ".join(analysis["weaknesses"][:3])
            recommendations.append(
                f"Focus on building foundational skills in: {weak_skills}"
            )
        
        # Build on strengths
        if analysis["strengths"]:
            strong_skills = ", ".join(analysis["strengths"][:3])
            recommendations.append(
                f"Continue excelling in: {strong_skills}"
            )
        
        # Develop skills in progress
        if analysis["developing"]:
            dev_skills = ", ".join(analysis["developing"][:3])
            recommendations.append(
                f"Continue developing: {dev_skills}"
            )
        
        # Assess uncertain areas
        if analysis["needs_assessment"]:
            uncertain_skills = ", ".join(analysis["needs_assessment"][:2])
            recommendations.append(
                f"Additional assessment needed for: {uncertain_skills}"
            )
        
        return recommendations


# Global skill analyzer
skill_analyzer = SkillAnalyzer()
