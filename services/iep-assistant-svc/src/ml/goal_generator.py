"""
SMART Goal Generation Engine
Follows Microsoft Education IEP best practices
"""

from typing import Dict, List

from openai import AsyncOpenAI


class SMARTGoalEngine:
    """Generate SMART IEP goals using AI"""
    
    def __init__(self, api_key: str, model: str = "gpt-4"):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
        
        # Goal templates
        self.templates = {
            "academic": (
                "By {date}, when given {condition}, {student} will {behavior} "
                "with {accuracy}% accuracy as measured by {measurement}."
            ),
            "behavioral": (
                "By {date}, {student} will {behavior} for {duration} minutes "
                "during {activity} with no more than {max_prompts} prompts."
            ),
            "communication": (
                "By {date}, {student} will {behavior} in {context} with "
                "{accuracy}% accuracy as measured by {measurement}."
            ),
        }
    
    async def generate_smart_goal(
        self,
        student_name: str,
        goal_type: str,
        area: str,
        baseline_data: Dict,
        grade_level: int
    ) -> Dict:
        """Generate a SMART goal"""
        
        # Build context
        context = self._build_context(
            student_name, goal_type, area, baseline_data, grade_level
        )
        
        # Generate with AI
        goal_data = await self._generate_with_ai(context)
        
        # Validate SMART criteria
        validation = self._validate_smart(goal_data)
        
        return {
            "goal_text": goal_data["goal_text"],
            "goal_type": goal_type,
            "area": area,
            "baseline": baseline_data,
            "target": goal_data["target"],
            "measurement_method": goal_data["measurement"],
            "timeline_end": goal_data["timeline_end"],
            "smart_validation": validation,
            "confidence_score": validation["overall_score"],
            "objectives": goal_data.get("objectives", [])
        }
    
    def _build_context(
        self,
        student_name: str,
        goal_type: str,
        area: str,
        baseline: Dict,
        grade: int
    ) -> str:
        """Build context for AI"""
        return f"""Generate a SMART IEP goal:

Student: {student_name} (Grade {grade})
Goal Type: {goal_type}
Area: {area}
Current Performance: {baseline.get('current_level', 'Unknown')}
Grade Level Expectation: {baseline.get('grade_level_expectation', 'Unknown')}

Requirements:
1. Specific - Clearly defined behavior/skill
2. Measurable - Quantifiable progress metric
3. Achievable - Realistic given baseline
4. Relevant - Aligned to standards/needs
5. Time-bound - Annual goal with quarterly benchmarks

Format response as JSON with:
- goal_text: complete goal statement
- target: {{value: X, unit: "..."}}
- measurement: how progress is measured
- timeline_end: date (1 year from now)
- objectives: [quarterly benchmarks]
"""
    
    async def _generate_with_ai(self, context: str) -> Dict:
        """Generate goal using AI"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an IEP specialist. Generate SMART goals "
                        "following IDEA regulations."
                    )
                },
                {"role": "user", "content": context}
            ],
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)
    
    def _validate_smart(self, goal_data: Dict) -> Dict:
        """Validate SMART criteria"""
        
        scores = {
            "specific": self._check_specific(goal_data),
            "measurable": self._check_measurable(goal_data),
            "achievable": self._check_achievable(goal_data),
            "relevant": self._check_relevant(goal_data),
            "time_bound": self._check_time_bound(goal_data)
        }
        
        overall = sum(scores.values()) / len(scores)
        
        return {
            "scores": scores,
            "overall_score": overall,
            "passes": overall >= 0.7,
            "issues": [
                k for k, v in scores.items() if v < 0.7
            ]
        }
    
    def _check_specific(self, goal: Dict) -> float:
        """Check if goal is specific"""
        text = goal.get("goal_text", "")
        
        # Check for concrete behavior
        has_behavior = any(
            w in text.lower()
            for w in ["will", "demonstrate", "complete", "identify"]
        )
        
        # Check for conditions
        has_conditions = "when given" in text.lower() or "given" in text.lower()
        
        score = 0.0
        if has_behavior:
            score += 0.5
        if has_conditions:
            score += 0.5
        
        return score
    
    def _check_measurable(self, goal: Dict) -> float:
        """Check if goal is measurable"""
        text = goal.get("goal_text", "")
        measurement = goal.get("measurement", "")
        
        # Check for numeric criteria
        has_number = any(c.isdigit() for c in text)
        
        # Check for measurement method
        has_method = len(measurement) > 0
        
        score = 0.0
        if has_number:
            score += 0.5
        if has_method:
            score += 0.5
        
        return score
    
    def _check_achievable(self, goal: Dict) -> float:
        """Check if goal is achievable"""
        # Simplified - would compare baseline to target
        return 0.8
    
    def _check_relevant(self, goal: Dict) -> float:
        """Check if goal is relevant"""
        # Simplified - would check standards alignment
        return 0.8
    
    def _check_time_bound(self, goal: Dict) -> float:
        """Check if goal is time-bound"""
        has_timeline = "timeline_end" in goal
        has_objectives = len(goal.get("objectives", [])) > 0
        
        score = 0.0
        if has_timeline:
            score += 0.5
        if has_objectives:
            score += 0.5
        
        return score
    
    def generate_objectives(
        self,
        goal_text: str,
        baseline: Dict,
        target: Dict,
        quarters: int = 4
    ) -> List[Dict]:
        """Generate quarterly objectives"""
        
        baseline_val = baseline.get("value", 0)
        target_val = target.get("value", 100)
        increment = (target_val - baseline_val) / quarters
        
        objectives = []
        for q in range(1, quarters + 1):
            objectives.append({
                "quarter": q,
                "timeline": f"Quarter {q}",
                "target": baseline_val + (increment * q),
                "criteria": f"Achieve {baseline_val + (increment * q)}% accuracy",
                "status": "pending"
            })
        
        return objectives
