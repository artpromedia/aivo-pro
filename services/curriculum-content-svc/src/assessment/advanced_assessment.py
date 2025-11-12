"""
Advanced Assessment Generation System
Comprehensive assessment engine with rubrics, performance tasks, and auto-grading
Author: Principal Assessment Architect
"""

from typing import Dict, List, Optional, Any
from enum import Enum
from dataclasses import dataclass
import random


class AssessmentType(str, Enum):
    """Types of assessments"""
    MULTIPLE_CHOICE = "multiple_choice"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"
    PERFORMANCE_TASK = "performance_task"
    PROJECT = "project"
    LAB_REPORT = "lab_report"
    PORTFOLIO = "portfolio"
    PRESENTATION = "presentation"
    PROBLEM_SOLVING = "problem_solving"
    CODING_CHALLENGE = "coding_challenge"


class QuestionDifficulty(str, Enum):
    """Question difficulty levels"""
    RECALL = "recall"  # Remember facts
    UNDERSTAND = "understand"  # Explain ideas
    APPLY = "apply"  # Use knowledge
    ANALYZE = "analyze"  # Break down
    EVALUATE = "evaluate"  # Judge/critique
    CREATE = "create"  # Make something new


@dataclass
class RubricCriterion:
    """Single rubric criterion"""
    name: str
    description: str
    levels: Dict[str, Dict[str, Any]]  # "exemplary", "proficient", etc.
    weight: float  # 0.0-1.0


class AdvancedAssessmentEngine:
    """
    Comprehensive assessment generation with cultural appropriateness
    """
    
    def __init__(self):
        self.question_templates = self._load_question_templates()
        self.rubric_templates = self._load_rubric_templates()
        self.bloom_taxonomy = self._load_blooms_taxonomy()
    
    def _load_blooms_taxonomy(self) -> Dict:
        """Load Bloom's Taxonomy levels and verbs"""
        return {
            "remember": {
                "level": 1,
                "verbs": [
                    "define", "identify", "list", "name", "recall",
                    "recognize", "state", "describe"
                ],
                "question_stems": [
                    "What is...?",
                    "Who was...?",
                    "When did...?",
                    "Can you recall...?"
                ]
            },
            "understand": {
                "level": 2,
                "verbs": [
                    "explain", "summarize", "paraphrase", "classify",
                    "compare", "interpret", "exemplify"
                ],
                "question_stems": [
                    "Explain why...?",
                    "What is the main idea of...?",
                    "Compare and contrast...",
                    "Summarize..."
                ]
            },
            "apply": {
                "level": 3,
                "verbs": [
                    "calculate", "solve", "use", "demonstrate",
                    "apply", "show", "illustrate"
                ],
                "question_stems": [
                    "How would you use...?",
                    "Apply the concept to...",
                    "Solve...",
                    "Calculate..."
                ]
            },
            "analyze": {
                "level": 4,
                "verbs": [
                    "analyze", "examine", "investigate", "categorize",
                    "compare", "contrast", "differentiate"
                ],
                "question_stems": [
                    "What are the parts of...?",
                    "How does... relate to...?",
                    "What evidence supports...?",
                    "Analyze the relationship between..."
                ]
            },
            "evaluate": {
                "level": 5,
                "verbs": [
                    "evaluate", "judge", "critique", "assess",
                    "defend", "justify", "support"
                ],
                "question_stems": [
                    "What is your opinion of...?",
                    "Judge the value of...",
                    "Defend your position on...",
                    "Evaluate the effectiveness of..."
                ]
            },
            "create": {
                "level": 6,
                "verbs": [
                    "create", "design", "construct", "develop",
                    "formulate", "invent", "compose"
                ],
                "question_stems": [
                    "Design a...",
                    "Create a plan for...",
                    "Develop a solution to...",
                    "Construct a model of..."
                ]
            }
        }
    
    def _load_question_templates(self) -> Dict:
        """Load question templates by subject"""
        return {
            "mathematics": {
                "multiple_choice": {
                    "calculation": "Calculate {expression}. A) {option1} B) {option2} C) {option3} D) {option4}",
                    "concept": "Which statement about {concept} is true?",
                    "application": "A {scenario} involves {concept}. What is {question}?"
                },
                "short_answer": {
                    "show_work": "Solve {problem}. Show all your work.",
                    "explain": "Explain how you would solve {problem}.",
                    "real_world": "Describe a real-world situation where you would use {concept}."
                }
            },
            "science": {
                "multiple_choice": {
                    "recall": "What is the function of {structure}?",
                    "understand": "Why does {phenomenon} occur?",
                    "apply": "In which situation would you observe {process}?"
                },
                "lab": {
                    "hypothesis": "Write a hypothesis for: {experiment}",
                    "procedure": "Design a procedure to test: {question}",
                    "analysis": "Analyze this data and draw conclusions: {data}"
                }
            },
            "ela": {
                "comprehension": {
                    "literal": "According to the text, what happened when...?",
                    "inferential": "Based on the text, why did...?",
                    "evaluative": "Do you agree with the author's perspective? Why?"
                },
                "writing": {
                    "narrative": "Write a narrative about {prompt}",
                    "informative": "Explain {topic} in a clear, organized essay",
                    "argumentative": "Take a position on {issue} and support it"
                }
            },
            "social_studies": {
                "analysis": {
                    "cause_effect": "What were the causes and effects of {event}?",
                    "compare": "Compare {entity1} and {entity2}",
                    "perspective": "How might {group} have viewed {event}?"
                },
                "document_based": {
                    "analyze": "Analyze this {document_type}: {document}",
                    "synthesize": "Using documents A-C, explain {question}"
                }
            }
        }
    
    def _load_rubric_templates(self) -> Dict:
        """Load rubric templates"""
        return {
            "written_response": {
                "criteria": {
                    "content_accuracy": {
                        "weight": 0.4,
                        "levels": {
                            "4_exemplary": {
                                "score": 4,
                                "description": "Demonstrates thorough understanding with accurate, detailed information"
                            },
                            "3_proficient": {
                                "score": 3,
                                "description": "Shows good understanding with mostly accurate information"
                            },
                            "2_developing": {
                                "score": 2,
                                "description": "Shows partial understanding with some inaccuracies"
                            },
                            "1_beginning": {
                                "score": 1,
                                "description": "Shows minimal understanding with significant inaccuracies"
                            }
                        }
                    },
                    "organization": {
                        "weight": 0.2,
                        "levels": {
                            "4_exemplary": {
                                "score": 4,
                                "description": "Clear structure with logical flow and smooth transitions"
                            },
                            "3_proficient": {
                                "score": 3,
                                "description": "Generally organized with adequate transitions"
                            },
                            "2_developing": {
                                "score": 2,
                                "description": "Some organization but lacks clarity"
                            },
                            "1_beginning": {
                                "score": 1,
                                "description": "Disorganized and hard to follow"
                            }
                        }
                    },
                    "evidence_support": {
                        "weight": 0.3,
                        "levels": {
                            "4_exemplary": {
                                "score": 4,
                                "description": "Strong evidence from multiple sources, well-integrated"
                            },
                            "3_proficient": {
                                "score": 3,
                                "description": "Adequate evidence that supports main points"
                            },
                            "2_developing": {
                                "score": 2,
                                "description": "Limited evidence or poorly integrated"
                            },
                            "1_beginning": {
                                "score": 1,
                                "description": "Little to no evidence provided"
                            }
                        }
                    },
                    "language_conventions": {
                        "weight": 0.1,
                        "levels": {
                            "4_exemplary": {
                                "score": 4,
                                "description": "Consistently correct grammar, spelling, punctuation"
                            },
                            "3_proficient": {
                                "score": 3,
                                "description": "Mostly correct with minor errors"
                            },
                            "2_developing": {
                                "score": 2,
                                "description": "Several errors that interfere with clarity"
                            },
                            "1_beginning": {
                                "score": 1,
                                "description": "Frequent errors that impede understanding"
                            }
                        }
                    }
                }
            },
            "math_problem_solving": {
                "criteria": {
                    "strategy_selection": {
                        "weight": 0.25,
                        "levels": {
                            "4": "Selects most efficient strategy",
                            "3": "Selects appropriate strategy",
                            "2": "Strategy partially appropriate",
                            "1": "Strategy ineffective"
                        }
                    },
                    "execution": {
                        "weight": 0.35,
                        "levels": {
                            "4": "Flawless execution of all steps",
                            "3": "Minor computational errors only",
                            "2": "Significant errors in execution",
                            "1": "Unable to execute strategy"
                        }
                    },
                    "explanation": {
                        "weight": 0.25,
                        "levels": {
                            "4": "Clear, detailed explanation of reasoning",
                            "3": "Adequate explanation of steps",
                            "2": "Incomplete explanation",
                            "1": "No explanation provided"
                        }
                    },
                    "answer": {
                        "weight": 0.15,
                        "levels": {
                            "4": "Correct answer with proper units/format",
                            "3": "Correct answer, minor format issues",
                            "2": "Incorrect due to execution error",
                            "1": "Incorrect answer"
                        }
                    }
                }
            },
            "science_lab": {
                "criteria": {
                    "hypothesis": {
                        "weight": 0.15,
                        "description": "Clear, testable hypothesis"
                    },
                    "procedure": {
                        "weight": 0.25,
                        "description": "Detailed, replicable procedure"
                    },
                    "data_collection": {
                        "weight": 0.20,
                        "description": "Accurate, organized data"
                    },
                    "analysis": {
                        "weight": 0.25,
                        "description": "Thorough analysis of results"
                    },
                    "conclusion": {
                        "weight": 0.15,
                        "description": "Evidence-based conclusion"
                    }
                }
            },
            "presentation": {
                "criteria": {
                    "content_knowledge": {
                        "weight": 0.35,
                        "description": "Demonstrates deep understanding"
                    },
                    "organization": {
                        "weight": 0.20,
                        "description": "Logical flow and structure"
                    },
                    "visuals": {
                        "weight": 0.15,
                        "description": "Effective visual aids"
                    },
                    "delivery": {
                        "weight": 0.20,
                        "description": "Clear speech, eye contact, confidence"
                    },
                    "engagement": {
                        "weight": 0.10,
                        "description": "Engages audience effectively"
                    }
                }
            }
        }
    
    async def generate_assessment(
        self,
        subject: str,
        topics: List[str],
        grade_level: str,
        assessment_type: AssessmentType,
        difficulty_distribution: Optional[Dict[str, float]] = None,
        cultural_context: Optional[Dict] = None,
        num_questions: int = 10
    ) -> Dict[str, Any]:
        """
        Generate comprehensive assessment with rubrics
        """
        
        # Default difficulty distribution (Bloom's levels)
        if not difficulty_distribution:
            difficulty_distribution = {
                "remember": 0.2,
                "understand": 0.3,
                "apply": 0.3,
                "analyze": 0.15,
                "evaluate": 0.05,
                "create": 0.0
            }
        
        # Generate questions based on distribution
        questions = []
        for bloom_level, proportion in difficulty_distribution.items():
            num_at_level = int(num_questions * proportion)
            for _ in range(num_at_level):
                question = await self._generate_question(
                    subject=subject,
                    topic=random.choice(topics),
                    bloom_level=bloom_level,
                    assessment_type=assessment_type,
                    cultural_context=cultural_context
                )
                questions.append(question)
        
        # Generate rubric if needed
        rubric = None
        if assessment_type in [
            AssessmentType.ESSAY,
            AssessmentType.PERFORMANCE_TASK,
            AssessmentType.PROJECT,
            AssessmentType.LAB_REPORT
        ]:
            rubric = await self._generate_rubric(
                assessment_type=assessment_type,
                subject=subject
            )
        
        # Create assessment structure
        assessment = {
            "id": f"assess_{random.randint(1000, 9999)}",
            "subject": subject,
            "topics": topics,
            "grade_level": grade_level,
            "type": assessment_type.value,
            "num_questions": len(questions),
            "questions": questions,
            "rubric": rubric,
            "estimated_time": self._estimate_time(questions, assessment_type),
            "difficulty_distribution": difficulty_distribution,
            "standards_alignment": self._get_standards_for_topics(
                subject,
                topics,
                grade_level
            ),
            "accommodations": self._generate_accommodations(),
            "grading": {
                "auto_gradable": self._is_auto_gradable(assessment_type),
                "points_possible": self._calculate_total_points(questions, rubric)
            }
        }
        
        # Apply cultural adaptations if needed
        if cultural_context:
            assessment = await self._culturally_adapt_assessment(
                assessment,
                cultural_context
            )
        
        return assessment
    
    async def _generate_question(
        self,
        subject: str,
        topic: str,
        bloom_level: str,
        assessment_type: AssessmentType,
        cultural_context: Optional[Dict]
    ) -> Dict[str, Any]:
        """Generate a single question"""
        
        bloom_data = self.bloom_taxonomy.get(bloom_level, {})
        verb = random.choice(bloom_data.get("verbs", ["explain"]))
        stem = random.choice(bloom_data.get("question_stems", ["Describe"]))
        
        if assessment_type == AssessmentType.MULTIPLE_CHOICE:
            return await self._generate_multiple_choice(
                subject, topic, bloom_level, verb
            )
        elif assessment_type == AssessmentType.SHORT_ANSWER:
            return await self._generate_short_answer(
                subject, topic, bloom_level, stem
            )
        elif assessment_type == AssessmentType.ESSAY:
            return await self._generate_essay_prompt(
                subject, topic, bloom_level
            )
        elif assessment_type == AssessmentType.PERFORMANCE_TASK:
            return await self._generate_performance_task(
                subject, topic, bloom_level
            )
        else:
            return await self._generate_generic_question(
                subject, topic, bloom_level, assessment_type
            )
    
    async def _generate_multiple_choice(
        self,
        subject: str,
        topic: str,
        bloom_level: str,
        verb: str
    ) -> Dict[str, Any]:
        """Generate multiple choice question"""
        
        # Mathematics example
        if subject == "mathematics" and "fraction" in topic.lower():
            numerator = random.randint(1, 5)
            denominator = random.randint(2, 10)
            correct_answer = numerator / denominator
            
            # Generate distractors
            distractors = [
                correct_answer + 0.1,
                correct_answer - 0.1,
                numerator + denominator  # Common misconception
            ]
            
            options = [correct_answer] + distractors
            random.shuffle(options)
            correct_index = options.index(correct_answer)
            
            return {
                "type": "multiple_choice",
                "bloom_level": bloom_level,
                "question": f"What is {numerator}/{denominator} as a decimal?",
                "options": [f"{opt:.2f}" for opt in options],
                "correct_answer": correct_index,
                "explanation": f"{numerator} ÷ {denominator} = {correct_answer:.2f}",
                "points": 1,
                "difficulty": bloom_level
            }
        
        # Generic multiple choice
        return {
            "type": "multiple_choice",
            "bloom_level": bloom_level,
            "question": f"{verb.title()} the concept of {topic}",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Explanation of correct answer",
            "points": 1
        }
    
    async def _generate_short_answer(
        self,
        subject: str,
        topic: str,
        bloom_level: str,
        stem: str
    ) -> Dict[str, Any]:
        """Generate short answer question"""
        
        return {
            "type": "short_answer",
            "bloom_level": bloom_level,
            "question": f"{stem} {topic}?",
            "expected_length": "2-3 sentences",
            "key_points": [
                f"Should mention {topic}",
                "Should demonstrate understanding",
                "Should provide example if applicable"
            ],
            "sample_answer": f"Sample answer about {topic}...",
            "points": 3,
            "grading_criteria": {
                "completeness": 1,
                "accuracy": 1,
                "clarity": 1
            }
        }
    
    async def _generate_essay_prompt(
        self,
        subject: str,
        topic: str,
        bloom_level: str
    ) -> Dict[str, Any]:
        """Generate essay prompt"""
        
        prompts_by_type = {
            "analyze": f"Analyze the key factors that contributed to {topic}",
            "evaluate": f"Evaluate the effectiveness of {topic}",
            "compare": f"Compare and contrast different approaches to {topic}",
            "argue": f"Take a position on {topic} and defend your view"
        }
        
        prompt_type = "analyze" if bloom_level == "analyze" else "evaluate"
        
        return {
            "type": "essay",
            "bloom_level": bloom_level,
            "prompt": prompts_by_type.get(
                prompt_type,
                f"Write an essay about {topic}"
            ),
            "requirements": {
                "length": "3-5 paragraphs",
                "structure": [
                    "Introduction with thesis statement",
                    "Body paragraphs with evidence",
                    "Conclusion summarizing main points"
                ],
                "sources": "Use at least 2 credible sources",
                "format": "MLA or APA format"
            },
            "points": 20,
            "grading": "See rubric"
        }
    
    async def _generate_performance_task(
        self,
        subject: str,
        topic: str,
        bloom_level: str
    ) -> Dict[str, Any]:
        """Generate performance task"""
        
        return {
            "type": "performance_task",
            "bloom_level": bloom_level,
            "title": f"{topic} Investigation",
            "scenario": f"Real-world scenario involving {topic}",
            "task": f"Design and complete a project that demonstrates your understanding of {topic}",
            "components": [
                "Research phase",
                "Planning and design",
                "Implementation",
                "Presentation of results"
            ],
            "deliverables": [
                "Written report",
                "Visual presentation",
                "Reflection on learning"
            ],
            "timeline": "2-3 weeks",
            "collaboration": "May work in pairs or small groups",
            "points": 50,
            "grading": "See project rubric"
        }
    
    async def _generate_generic_question(
        self,
        subject: str,
        topic: str,
        bloom_level: str,
        assessment_type: AssessmentType
    ) -> Dict[str, Any]:
        """Generate generic question"""
        
        return {
            "type": assessment_type.value,
            "bloom_level": bloom_level,
            "subject": subject,
            "topic": topic,
            "question": f"Question about {topic} at {bloom_level} level",
            "points": 5
        }
    
    async def _generate_rubric(
        self,
        assessment_type: AssessmentType,
        subject: str
    ) -> Dict[str, Any]:
        """Generate assessment rubric"""
        
        # Map assessment type to rubric template
        template_map = {
            AssessmentType.ESSAY: "written_response",
            AssessmentType.LAB_REPORT: "science_lab",
            AssessmentType.PRESENTATION: "presentation",
            AssessmentType.PERFORMANCE_TASK: "written_response",
            AssessmentType.PROBLEM_SOLVING: "math_problem_solving"
        }
        
        template_key = template_map.get(
            assessment_type,
            "written_response"
        )
        template = self.rubric_templates.get(template_key, {})
        
        return {
            "title": f"{assessment_type.value.replace('_', ' ').title()} Rubric",
            "criteria": template.get("criteria", {}),
            "total_points": self._calculate_rubric_points(
                template.get("criteria", {})
            ),
            "scoring_guide": "Each criterion scored 1-4 points",
            "notes": "Scores are weighted according to criterion importance"
        }
    
    def _calculate_rubric_points(self, criteria: Dict) -> int:
        """Calculate total points from rubric"""
        total = 0
        for criterion_data in criteria.values():
            weight = criterion_data.get("weight", 0.25)
            # Assume max score of 4 per criterion
            total += 4 * weight * 100  # Scale to percentage
        return int(total)
    
    def _estimate_time(
        self,
        questions: List[Dict],
        assessment_type: AssessmentType
    ) -> str:
        """Estimate time to complete assessment"""
        
        time_per_question = {
            AssessmentType.MULTIPLE_CHOICE: 1.5,  # minutes
            AssessmentType.SHORT_ANSWER: 5,
            AssessmentType.ESSAY: 30,
            AssessmentType.PERFORMANCE_TASK: 120,
            AssessmentType.LAB_REPORT: 90
        }
        
        minutes = len(questions) * time_per_question.get(
            assessment_type,
            5
        )
        
        if minutes < 60:
            return f"{int(minutes)} minutes"
        else:
            hours = minutes / 60
            return f"{hours:.1f} hours"
    
    def _get_standards_for_topics(
        self,
        subject: str,
        topics: List[str],
        grade_level: str
    ) -> List[str]:
        """Get aligned standards"""
        # Placeholder - would query standards database
        return [
            f"{subject.upper()}.{grade_level}.{i}"
            for i, topic in enumerate(topics, 1)
        ]
    
    def _generate_accommodations(self) -> List[str]:
        """Generate suggested accommodations"""
        return [
            "Extended time (time and a half)",
            "Read-aloud option for text-heavy questions",
            "Calculator permitted for complex calculations",
            "Quiet testing environment",
            "Frequent breaks allowed",
            "Scribe for written responses",
            "Large print or digital format"
        ]
    
    def _is_auto_gradable(self, assessment_type: AssessmentType) -> bool:
        """Check if assessment can be auto-graded"""
        auto_gradable_types = [
            AssessmentType.MULTIPLE_CHOICE,
            AssessmentType.PROBLEM_SOLVING,  # With numeric answers
            AssessmentType.CODING_CHALLENGE
        ]
        return assessment_type in auto_gradable_types
    
    def _calculate_total_points(
        self,
        questions: List[Dict],
        rubric: Optional[Dict]
    ) -> int:
        """Calculate total points possible"""
        total = sum(q.get("points", 1) for q in questions)
        if rubric:
            total += rubric.get("total_points", 0)
        return total
    
    async def _culturally_adapt_assessment(
        self,
        assessment: Dict,
        cultural_context: Dict
    ) -> Dict:
        """Adapt assessment for cultural appropriateness"""
        
        # Check for sensitive topics
        sensitive_topics = cultural_context.get("sensitive_topics", [])
        
        # Review each question
        for question in assessment["questions"]:
            question_text = str(question.get("question", "")).lower()
            
            # Check for sensitive content
            for sensitive in sensitive_topics:
                if sensitive.lower() in question_text:
                    question["cultural_note"] = f"Consider alternative framing for {cultural_context.get('region', 'this region')}"
        
        # Add cultural accommodations
        assessment["cultural_accommodations"] = [
            "Examples adapted to local context",
            "Culturally appropriate scenarios",
            "Respectful of regional sensitivities"
        ]
        
        return assessment
    
    async def auto_grade_response(
        self,
        question: Dict,
        student_response: Any
    ) -> Dict[str, Any]:
        """
        Automatically grade student response
        """
        question_type = question.get("type")
        
        if question_type == "multiple_choice":
            correct_index = question.get("correct_answer")
            is_correct = student_response == correct_index
            
            return {
                "is_correct": is_correct,
                "points_earned": question.get("points", 1) if is_correct else 0,
                "points_possible": question.get("points", 1),
                "feedback": question.get("explanation") if is_correct else "Incorrect. " + question.get("explanation", "")
            }
        
        elif question_type == "problem_solving":
            # For numeric answers
            correct_answer = question.get("correct_answer")
            tolerance = question.get("tolerance", 0.01)
            
            try:
                is_correct = abs(float(student_response) - float(correct_answer)) <= tolerance
                
                return {
                    "is_correct": is_correct,
                    "points_earned": question.get("points", 1) if is_correct else 0,
                    "points_possible": question.get("points", 1),
                    "feedback": "Correct!" if is_correct else f"The correct answer is {correct_answer}"
                }
            except (ValueError, TypeError):
                return {
                    "is_correct": False,
                    "points_earned": 0,
                    "points_possible": question.get("points", 1),
                    "feedback": "Invalid response format"
                }
        
        else:
            # Requires manual grading
            return {
                "requires_manual_grading": True,
                "points_possible": question.get("points", 1),
                "feedback": "Response submitted for teacher review"
            }


# Global instance
assessment_engine = AdvancedAssessmentEngine()
