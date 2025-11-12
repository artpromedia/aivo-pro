"""
Advanced Content Generation Engines
AI-powered content generation with differentiation, scaffolding, and real-world connections
Author: Principal Education Architect
"""

import random
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    """Difficulty levels for content"""
    EMERGING = "emerging"  # 0.0-0.2
    DEVELOPING = "developing"  # 0.2-0.4
    PROFICIENT = "proficient"  # 0.4-0.6
    ADVANCED = "advanced"  # 0.6-0.8
    EXPERT = "expert"  # 0.8-1.0


class ContentType(str, Enum):
    """Types of educational content"""
    CONCEPT_EXPLANATION = "concept_explanation"
    WORKED_EXAMPLE = "worked_example"
    PRACTICE_PROBLEM = "practice_problem"
    REAL_WORLD_APPLICATION = "real_world_application"
    PROJECT = "project"
    INVESTIGATION = "investigation"
    DISCUSSION_PROMPT = "discussion_prompt"
    REFLECTION = "reflection"


class AdvancedMathGenerator:
    """
    Advanced mathematics content generator
    With AI integration, differentiation, and scaffolding
    """
    
    def __init__(self):
        self.topics_taxonomy = self._load_math_taxonomy()
        self.real_world_contexts = self._load_real_world_contexts()
        self.misconceptions = self._load_common_misconceptions()
    
    def _load_math_taxonomy(self) -> Dict:
        """Load comprehensive math topics taxonomy"""
        return {
            "arithmetic": {
                "subtopics": [
                    "addition", "subtraction", "multiplication", "division",
                    "place_value", "estimation", "mental_math"
                ],
                "grade_range": "K-5",
                "prerequisites": []
            },
            "fractions": {
                "subtopics": [
                    "understanding_fractions", "equivalent_fractions",
                    "comparing_fractions", "adding_fractions",
                    "subtracting_fractions", "multiplying_fractions",
                    "dividing_fractions", "mixed_numbers"
                ],
                "grade_range": "3-8",
                "prerequisites": ["division", "multiplication"]
            },
            "algebra": {
                "subtopics": [
                    "variables", "expressions", "equations", "inequalities",
                    "linear_functions", "quadratic_functions",
                    "systems_of_equations", "polynomials"
                ],
                "grade_range": "6-12",
                "prerequisites": ["arithmetic", "fractions"]
            },
            "geometry": {
                "subtopics": [
                    "shapes", "angles", "triangles", "circles",
                    "area", "perimeter", "volume", "surface_area",
                    "pythagorean_theorem", "trigonometry", "coordinate_geometry"
                ],
                "grade_range": "K-12",
                "prerequisites": ["arithmetic"]
            },
            "statistics": {
                "subtopics": [
                    "data_collection", "graphs", "mean_median_mode",
                    "probability", "distributions", "inference",
                    "correlation", "regression"
                ],
                "grade_range": "4-12",
                "prerequisites": ["arithmetic", "fractions"]
            },
            "calculus": {
                "subtopics": [
                    "limits", "derivatives", "integrals",
                    "applications_of_derivatives", "applications_of_integrals",
                    "differential_equations"
                ],
                "grade_range": "11-12",
                "prerequisites": ["algebra", "trigonometry"]
            }
        }
    
    def _load_real_world_contexts(self) -> Dict:
        """Load real-world contexts for math problems"""
        return {
            "shopping": [
                "calculating discounts",
                "comparing prices",
                "budgeting",
                "unit prices"
            ],
            "cooking": [
                "recipe scaling",
                "measuring ingredients",
                "cooking times",
                "temperature conversion"
            ],
            "travel": [
                "distance and time",
                "fuel efficiency",
                "currency conversion",
                "time zones"
            ],
            "sports": [
                "statistics and averages",
                "percentages",
                "probabilities",
                "measurements"
            ],
            "construction": [
                "measurements",
                "area and volume",
                "scaling plans",
                "material estimation"
            ],
            "technology": [
                "data storage",
                "processing speed",
                "screen resolution",
                "download times"
            ],
            "environment": [
                "climate data",
                "conservation",
                "sustainability metrics",
                "population studies"
            ],
            "business": [
                "profit and loss",
                "interest rates",
                "growth rates",
                "market analysis"
            ]
        }
    
    def _load_common_misconceptions(self) -> Dict:
        """Load common misconceptions to address"""
        return {
            "fractions": [
                "Adding numerators and denominators separately",
                "Larger denominator means larger fraction",
                "Fractions can't be greater than 1"
            ],
            "negative_numbers": [
                "Two negatives always make a positive",
                "Negative numbers can't be subtracted",
                "Larger negative number is greater"
            ],
            "algebra": [
                "Variables must be x, y, z",
                "2x means 2 times x, so 2x² is 2x times 2x",
                "Can't have negative solutions"
            ],
            "geometry": [
                "Area and perimeter increase proportionally",
                "All triangles are equilateral",
                "Angles in any polygon sum to 180°"
            ]
        }
    
    async def generate_differentiated_content(
        self,
        topic: str,
        base_difficulty: float,
        student_level: str,
        learning_style: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate differentiated content based on student needs
        """
        # Determine actual difficulty based on student level
        adjusted_difficulty = self._adjust_difficulty(
            base_difficulty,
            student_level
        )
        
        # Generate core content
        content = await self._generate_core_content(
            topic,
            adjusted_difficulty
        )
        
        # Add scaffolding for struggling students
        if student_level in ["emerging", "developing"]:
            content["scaffolding"] = await self._add_scaffolding(
                topic,
                content
            )
        
        # Add extensions for advanced students
        if student_level in ["advanced", "expert"]:
            content["extensions"] = await self._add_extensions(
                topic,
                content
            )
        
        # Adapt for learning style
        if learning_style:
            content = await self._adapt_for_learning_style(
                content,
                learning_style
            )
        
        # Add metacognitive prompts
        content["reflection_questions"] = self._generate_reflection_questions(
            topic
        )
        
        return content
    
    def _adjust_difficulty(
        self,
        base_difficulty: float,
        student_level: str
    ) -> float:
        """Adjust difficulty based on student level"""
        adjustments = {
            "emerging": -0.2,
            "developing": -0.1,
            "proficient": 0.0,
            "advanced": 0.1,
            "expert": 0.2
        }
        
        adjusted = base_difficulty + adjustments.get(student_level, 0.0)
        return max(0.0, min(1.0, adjusted))  # Clamp to [0, 1]
    
    async def _generate_core_content(
        self,
        topic: str,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate core mathematical content"""
        
        if "fraction" in topic.lower():
            return await self._generate_fraction_content(difficulty)
        elif "algebra" in topic.lower():
            return await self._generate_algebra_content(difficulty)
        elif "geometry" in topic.lower():
            return await self._generate_geometry_content(difficulty)
        elif "statistics" in topic.lower():
            return await self._generate_statistics_content(difficulty)
        else:
            return await self._generate_generic_math_content(topic, difficulty)
    
    async def _generate_fraction_content(
        self,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate fraction content with progression"""
        
        if difficulty < 0.3:
            # Basic fraction understanding
            numerator = random.randint(1, 5)
            denominator = random.randint(2, 8)
            
            return {
                "type": "concept_introduction",
                "concept": f"Understanding {numerator}/{denominator}",
                "visual": {
                    "type": "circle_diagram",
                    "parts": denominator,
                    "shaded": numerator
                },
                "explanation": f"When we divide something into {denominator} equal parts and take {numerator} of them, we have {numerator}/{denominator}",
                "problem": f"Shade {numerator}/{denominator} of the circle",
                "hint": f"Divide the circle into {denominator} equal parts, then shade {numerator} parts"
            }
        
        elif difficulty < 0.5:
            # Adding fractions with same denominator
            denominator = random.randint(3, 10)
            num1 = random.randint(1, denominator - 2)
            num2 = random.randint(1, denominator - num1)
            
            return {
                "type": "worked_example",
                "problem": f"Add: {num1}/{denominator} + {num2}/{denominator}",
                "solution": {
                    "step_1": f"Since denominators are the same ({denominator}), add the numerators",
                    "step_2": f"{num1} + {num2} = {num1 + num2}",
                    "step_3": f"Keep the denominator: {num1 + num2}/{denominator}",
                    "answer": f"{num1 + num2}/{denominator}"
                },
                "practice": [
                    {
                        "problem": f"{random.randint(1, 5)}/{denominator} + {random.randint(1, 5)}/{denominator}",
                        "hint": "Add the numerators, keep the denominator"
                    }
                    for _ in range(3)
                ]
            }
        
        elif difficulty < 0.7:
            # Adding fractions with different denominators
            d1, d2 = random.randint(2, 8), random.randint(2, 8)
            n1, n2 = random.randint(1, d1 - 1), random.randint(1, d2 - 1)
            
            # Calculate LCD
            import math
            lcd = (d1 * d2) // math.gcd(d1, d2)
            
            return {
                "type": "problem_solving",
                "problem": f"Add: {n1}/{d1} + {n2}/{d2}",
                "scaffolding": {
                    "step_1": f"Find common denominator (LCD of {d1} and {d2})",
                    "step_2": f"Convert both fractions to denominator {lcd}",
                    "step_3": "Add the numerators",
                    "step_4": "Simplify if possible"
                },
                "solution_steps": [
                    f"LCD of {d1} and {d2} is {lcd}",
                    f"{n1}/{d1} = {n1 * (lcd // d1)}/{lcd}",
                    f"{n2}/{d2} = {n2 * (lcd // d2)}/{lcd}",
                    f"Add: {n1 * (lcd // d1)}/{lcd} + {n2 * (lcd // d2)}/{lcd} = {n1 * (lcd // d1) + n2 * (lcd // d2)}/{lcd}"
                ]
            }
        
        else:
            # Complex fraction operations
            return {
                "type": "multi_step_problem",
                "problem": "Real-world fraction problem with multiple operations",
                "context": "A recipe calls for 2/3 cup of flour, but you want to make 1.5 times the recipe. How much flour do you need?",
                "solution_strategy": [
                    "Identify the operation: multiplication",
                    "Convert 1.5 to fraction: 3/2",
                    "Multiply: 2/3 × 3/2",
                    "Simplify the result"
                ],
                "answer": "1 cup",
                "extensions": [
                    "What if you wanted to make half the recipe?",
                    "If flour costs $0.50 per cup, what's the cost?"
                ]
            }
    
    async def _generate_algebra_content(
        self,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate algebra content"""
        
        if difficulty < 0.4:
            # Basic variables and expressions
            coef = random.randint(2, 10)
            const = random.randint(1, 20)
            
            return {
                "type": "concept_introduction",
                "concept": "Understanding Variables",
                "explanation": f"In algebra, letters represent unknown numbers. For example, if x = 5, then {coef}x + {const} = {coef * 5 + const}",
                "practice": [
                    {
                        "problem": f"If x = 3, what is {coef}x + {const}?",
                        "answer": coef * 3 + const,
                        "steps": [
                            f"Substitute x = 3: {coef}(3) + {const}",
                            f"Multiply: {coef * 3} + {const}",
                            f"Add: {coef * 3 + const}"
                        ]
                    }
                ]
            }
        
        elif difficulty < 0.6:
            # Solving linear equations
            a = random.randint(2, 10)
            b = random.randint(1, 20)
            x = random.randint(1, 10)
            c = a * x + b
            
            return {
                "type": "worked_example",
                "problem": f"Solve: {a}x + {b} = {c}",
                "solution": {
                    "step_1": f"Subtract {b} from both sides",
                    "equation_1": f"{a}x = {c - b}",
                    "step_2": f"Divide both sides by {a}",
                    "equation_2": f"x = {(c - b) / a}",
                    "answer": f"x = {x}"
                },
                "check": f"Verify: {a}({x}) + {b} = {a * x + b} = {c} ✓"
            }
        
        else:
            # Quadratic equations
            a = random.randint(1, 3)
            b = random.randint(-10, 10)
            c = random.randint(-10, 10)
            
            return {
                "type": "problem_solving",
                "problem": f"Solve using the quadratic formula: {a}x² + {b}x + {c} = 0",
                "formula": "x = (-b ± √(b² - 4ac)) / 2a",
                "steps": [
                    f"Identify: a = {a}, b = {b}, c = {c}",
                    f"Calculate discriminant: b² - 4ac = {b}² - 4({a})({c}) = {b**2 - 4*a*c}",
                    "Determine number of solutions based on discriminant",
                    "Apply quadratic formula"
                ],
                "real_world_connection": "Quadratic equations model projectile motion, area problems, and many physics phenomena"
            }
    
    async def _generate_geometry_content(
        self,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate geometry content"""
        
        if difficulty < 0.4:
            # Basic shapes and area
            length = random.randint(5, 15)
            width = random.randint(3, 12)
            
            return {
                "type": "concept_application",
                "problem": f"Find the area of a rectangle with length {length} units and width {width} units",
                "visual": {
                    "type": "rectangle",
                    "dimensions": {"length": length, "width": width},
                    "grid": True
                },
                "formula": "Area = length × width",
                "solution": f"Area = {length} × {width} = {length * width} square units",
                "real_world": f"This is like finding how much carpet you need for a room {length} feet by {width} feet"
            }
        
        elif difficulty < 0.7:
            # Pythagorean theorem
            a = random.randint(3, 12)
            b = random.randint(4, 12)
            c_squared = a**2 + b**2
            c = round(c_squared ** 0.5, 2)
            
            return {
                "type": "problem_solving",
                "problem": f"A right triangle has legs of {a} and {b} units. Find the hypotenuse.",
                "theorem": "Pythagorean Theorem: a² + b² = c²",
                "solution": {
                    "step_1": f"Substitute values: {a}² + {b}² = c²",
                    "step_2": f"Calculate: {a**2} + {b**2} = c²",
                    "step_3": f"{c_squared} = c²",
                    "step_4": f"c = √{c_squared} ≈ {c} units"
                },
                "applications": [
                    "Finding diagonal distances",
                    "Construction and carpentry",
                    "Navigation and surveying"
                ]
            }
        
        else:
            # Trigonometry
            angle = random.choice([30, 45, 60])
            side = random.randint(5, 20)
            
            return {
                "type": "advanced_problem",
                "problem": f"In a right triangle, one angle is {angle}° and the adjacent side is {side} units. Find the opposite side.",
                "concepts": ["Trigonometric ratios", "Right triangle relationships"],
                "solution_approach": [
                    f"Identify the trigonometric ratio: tan({angle}°) = opposite/adjacent",
                    f"Substitute: tan({angle}°) = opposite/{side}",
                    f"Solve for opposite: opposite = {side} × tan({angle}°)",
                    "Calculate using calculator or trig table"
                ],
                "real_world": "Used in surveying, architecture, and engineering to calculate heights and distances"
            }
    
    async def _generate_statistics_content(
        self,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate statistics content"""
        
        if difficulty < 0.4:
            # Mean, median, mode
            data = sorted([random.randint(1, 100) for _ in range(7)])
            mean = sum(data) / len(data)
            median = data[len(data) // 2]
            
            return {
                "type": "data_analysis",
                "problem": "Find the mean and median of this data set",
                "data": data,
                "visual": {
                    "type": "dot_plot",
                    "values": data
                },
                "solution": {
                    "mean": {
                        "calculation": f"({' + '.join(map(str, data))}) / {len(data)}",
                        "result": round(mean, 2)
                    },
                    "median": {
                        "explanation": "Middle value when sorted",
                        "result": median
                    }
                },
                "interpretation": f"The average (mean) is {round(mean, 2)}, and half the values are below {median}"
            }
        
        else:
            # Probability
            favorable = random.randint(1, 10)
            total = random.randint(favorable + 5, 20)
            
            return {
                "type": "probability_problem",
                "problem": f"A bag contains {total} marbles, {favorable} are red. What is the probability of drawing a red marble?",
                "solution": {
                    "formula": "P(event) = favorable outcomes / total outcomes",
                    "calculation": f"P(red) = {favorable}/{total}",
                    "decimal": round(favorable / total, 3),
                    "percentage": f"{round(100 * favorable / total, 1)}%"
                },
                "extensions": [
                    "What if you draw two marbles? (with/without replacement)",
                    "How many red marbles needed for 50% probability?"
                ]
            }
    
    async def _generate_generic_math_content(
        self,
        topic: str,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate generic math content"""
        return {
            "type": "concept_explanation",
            "topic": topic,
            "difficulty_level": self._get_difficulty_label(difficulty),
            "explanation": f"Content for {topic} at difficulty {difficulty:.1f}",
            "note": "Specific content generator in development"
        }
    
    def _get_difficulty_label(self, difficulty: float) -> str:
        """Convert numeric difficulty to label"""
        if difficulty < 0.2:
            return "Emerging"
        elif difficulty < 0.4:
            return "Developing"
        elif difficulty < 0.6:
            return "Proficient"
        elif difficulty < 0.8:
            return "Advanced"
        else:
            return "Expert"
    
    async def _add_scaffolding(
        self,
        topic: str,
        content: Dict
    ) -> Dict[str, Any]:
        """Add scaffolding supports"""
        return {
            "visual_aids": [
                "Diagrams showing concept",
                "Number lines or manipulatives",
                "Step-by-step visual guides"
            ],
            "sentence_frames": [
                "First, I will...",
                "Then, I can...",
                "The answer is... because..."
            ],
            "worked_examples": "Detailed example with every step explained",
            "hint_progression": [
                "What do you know about this topic?",
                "What operation should you use?",
                "Try breaking it into smaller steps"
            ],
            "vocabulary_support": self._get_vocabulary_for_topic(topic)
        }
    
    async def _add_extensions(
        self,
        topic: str,
        content: Dict
    ) -> Dict[str, Any]:
        """Add extension activities"""
        return {
            "challenge_problems": [
                "Multi-step problem combining concepts",
                "Open-ended investigation",
                "Real-world project application"
            ],
            "connections": [
                "How does this relate to other math topics?",
                "Where is this used in real life?",
                "Can you create your own problem?"
            ],
            "deeper_questions": [
                "Why does this method work?",
                "What patterns do you notice?",
                "Can you generalize this rule?"
            ],
            "research_topics": [
                f"History of {topic}",
                f"Advanced applications of {topic}",
                f"Careers using {topic}"
            ]
        }
    
    async def _adapt_for_learning_style(
        self,
        content: Dict,
        learning_style: str
    ) -> Dict:
        """Adapt content for learning style"""
        
        if learning_style == "visual":
            content["enhanced_visuals"] = True
            content["visual_representations"] = [
                "Diagrams", "Charts", "Color coding", "Graphic organizers"
            ]
        
        elif learning_style == "auditory":
            content["discussion_prompts"] = [
                "Explain your thinking out loud",
                "Discuss with a partner",
                "Use verbal reasoning"
            ]
        
        elif learning_style == "kinesthetic":
            content["hands_on_activities"] = [
                "Use manipulatives",
                "Draw or build models",
                "Act out the problem"
            ]
        
        elif learning_style == "reading_writing":
            content["written_explanations"] = True
            content["journaling_prompts"] = [
                "Write about what you learned",
                "Explain the steps in your own words"
            ]
        
        return content
    
    def _generate_reflection_questions(self, topic: str) -> List[str]:
        """Generate metacognitive reflection questions"""
        return [
            "What strategy did you use to solve this?",
            "Was there another way you could have approached this?",
            "What was challenging about this problem?",
            "How confident are you with this topic? (1-5)",
            f"Where else might you use {topic}?"
        ]
    
    def _get_vocabulary_for_topic(self, topic: str) -> Dict[str, str]:
        """Get key vocabulary with definitions"""
        vocab_bank = {
            "fraction": {
                "numerator": "The top number (how many parts you have)",
                "denominator": "The bottom number (total number of equal parts)",
                "equivalent": "Different fractions that represent the same amount"
            },
            "algebra": {
                "variable": "A letter that represents an unknown number",
                "expression": "A mathematical phrase with numbers and operations",
                "equation": "A mathematical sentence showing two things are equal"
            },
            "geometry": {
                "perimeter": "Distance around the outside of a shape",
                "area": "Amount of space inside a shape",
                "volume": "Amount of space inside a 3D object"
            }
        }
        
        for key in vocab_bank:
            if key in topic.lower():
                return vocab_bank[key]
        
        return {}
    
    async def generate_real_world_problem(
        self,
        topic: str,
        context: str,
        difficulty: float
    ) -> Dict[str, Any]:
        """Generate real-world application problem"""
        
        contexts = self.real_world_contexts.get(context, [])
        if not contexts:
            context = "shopping"  # Default
            contexts = self.real_world_contexts["shopping"]
        
        scenario = random.choice(contexts)
        
        # Generate context-specific problem
        if context == "shopping" and "fraction" in topic:
            return {
                "context": "Shopping",
                "scenario": "Store discount calculation",
                "problem": "A shirt costs $24. It's on sale for 1/3 off. How much do you save? What's the sale price?",
                "real_world_connection": "Understanding fractions helps you calculate discounts and compare deals",
                "solution_steps": [
                    "Find 1/3 of $24",
                    "Calculate: 24 ÷ 3 = $8 (savings)",
                    "Subtract from original: $24 - $8 = $16 (sale price)"
                ],
                "extensions": [
                    "What if it was 1/4 off?",
                    "Which is better: 1/3 off or $10 off?"
                ]
            }
        
        elif context == "cooking" and "fraction" in topic:
            return {
                "context": "Cooking",
                "scenario": "Recipe scaling",
                "problem": "A recipe calls for 2/3 cup sugar for 12 cookies. You want to make 18 cookies. How much sugar?",
                "real_world_connection": "Chefs and bakers use fractions every day to scale recipes",
                "solution_steps": [
                    "Find the scaling factor: 18 ÷ 12 = 1.5 or 3/2",
                    "Multiply: 2/3 × 3/2",
                    "Calculate: 6/6 = 1 cup sugar"
                ]
            }
        
        # Generic real-world problem
        return {
            "context": context,
            "scenario": scenario,
            "problem": f"Real-world problem involving {topic} in {context} context",
            "real_world_connection": f"{topic.title()} is used in {context} for {scenario}",
            "note": "Specific problem generation in development"
        }


# Create global instance
advanced_math_generator = AdvancedMathGenerator()


class AdvancedScienceGenerator:
    """
    Advanced science content generator
    Biology, Chemistry, Physics, Earth Science
    """
    
    def __init__(self):
        self.science_domains = self._load_science_domains()
        self.lab_activities = self._load_lab_activities()
        self.phenomena = self._load_phenomena()
    
    def _load_science_domains(self) -> Dict:
        """Load science domains and topics"""
        return {
            "biology": {
                "topics": [
                    "cells", "genetics", "evolution", "ecology",
                    "human_body", "plants", "animals", "microorganisms"
                ],
                "skills": ["observation", "classification", "experimentation"]
            },
            "chemistry": {
                "topics": [
                    "matter", "atoms", "molecules", "reactions",
                    "acids_bases", "periodic_table", "bonding"
                ],
                "skills": ["measurement", "lab_safety", "analysis"]
            },
            "physics": {
                "topics": [
                    "motion", "forces", "energy", "waves",
                    "electricity", "magnetism", "light", "sound"
                ],
                "skills": ["calculation", "graphing", "modeling"]
            },
            "earth_science": {
                "topics": [
                    "rocks_minerals", "weather", "climate", "water_cycle",
                    "plate_tectonics", "solar_system", "astronomy"
                ],
                "skills": ["data_collection", "mapping", "prediction"]
            }
        }
    
    def _load_lab_activities(self) -> Dict:
        """Load inquiry-based lab activities"""
        return {
            "biology": [
                {
                    "name": "Cell Observation",
                    "materials": ["microscope", "slides", "onion", "iodine"],
                    "procedure": [
                        "Prepare thin onion slice",
                        "Add drop of iodine stain",
                        "Observe under microscope at 40x and 400x"
                    ],
                    "observations": "Cell walls, nucleus, cytoplasm",
                    "questions": [
                        "What structures can you identify?",
                        "How do plant cells differ from animal cells?",
                        "Why do we use stain?"
                    ]
                }
            ],
            "chemistry": [
                {
                    "name": "Acid-Base Indicators",
                    "materials": ["red cabbage", "various liquids", "test tubes"],
                    "procedure": [
                        "Boil red cabbage to make indicator solution",
                        "Add indicator to different liquids",
                        "Observe color changes"
                    ],
                    "observations": "Red=acid, Purple=neutral, Green=base",
                    "questions": [
                        "Which liquids are acidic?",
                        "What causes color change?",
                        "How could you make your own indicator?"
                    ]
                }
            ],
            "physics": [
                {
                    "name": "Pendulum Investigation",
                    "materials": ["string", "weights", "timer", "ruler"],
                    "procedure": [
                        "Set up pendulum with different lengths",
                        "Time 10 swings for each length",
                        "Calculate period (time per swing)",
                        "Graph length vs. period"
                    ],
                    "observations": "Longer string = slower swings",
                    "questions": [
                        "What affects pendulum period?",
                        "Does mass matter?",
                        "What's the mathematical relationship?"
                    ]
                }
            ]
        }
    
    def _load_phenomena(self) -> Dict:
        """Load observable phenomena for investigation"""
        return {
            "biology": [
                "Why do leaves change color?",
                "How do vaccines work?",
                "Why do we look like our parents?",
                "How do animals survive winter?"
            ],
            "chemistry": [
                "Why does bread rise?",
                "What makes fireworks colorful?",
                "Why does iron rust?",
                "How do hand warmers work?"
            ],
            "physics": [
                "Why do objects fall at the same rate?",
                "How do magnets work?",
                "Why is the sky blue?",
                "How does a skateboard move?"
            ],
            "earth_science": [
                "Why do earthquakes happen?",
                "Where does rain come from?",
                "Why do seasons change?",
                "How do mountains form?"
            ]
        }
    
    async def generate_science_content(
        self,
        domain: str,  # biology, chemistry, physics, earth_science
        topic: str,
        grade_level: str,
        student_level: str = "proficient",
        include_lab: bool = True
    ) -> Dict[str, Any]:
        """Generate comprehensive science content"""
        
        content = {
            "domain": domain,
            "topic": topic,
            "grade_level": grade_level,
            "student_level": student_level,
            "timestamp": datetime.now().isoformat()
        }
        
        # 1. Phenomenon/Hook
        phenomena = self.phenomena.get(domain, [])
        if phenomena:
            content["phenomenon"] = random.choice(phenomena)
        
        # 2. Core Content
        content["core_content"] = self._generate_science_explanation(
            domain, topic, student_level
        )
        
        # 3. Lab Activity (if requested)
        if include_lab:
            labs = self.lab_activities.get(domain, [])
            if labs:
                content["lab_activity"] = random.choice(labs)
        
        # 4. Differentiation
        if student_level == "struggling":
            content["scaffolding"] = self._add_science_scaffolding(domain, topic)
        elif student_level == "advanced":
            content["extensions"] = self._add_science_extensions(domain, topic)
        
        # 5. Practice Questions
        content["practice_questions"] = self._generate_science_questions(
            domain, topic, student_level
        )
        
        # 6. Real-World Connections
        content["real_world_connections"] = self._get_real_world_science(
            domain, topic
        )
        
        return content
    
    def _generate_science_explanation(
        self, domain: str, topic: str, level: str
    ) -> Dict:
        """Generate science concept explanation"""
        
        if domain == "biology" and "cell" in topic:
            return {
                "concept": "Cells are the basic units of life",
                "key_points": [
                    "All living things are made of cells",
                    "Cells have specific structures (organelles)",
                    "Plant cells have cell walls, animal cells don't",
                    "DNA in nucleus controls cell activities"
                ],
                "vocabulary": {
                    "cell": "Smallest unit of life",
                    "nucleus": "Control center containing DNA",
                    "cytoplasm": "Gel-like substance inside cell",
                    "membrane": "Outer boundary of cell"
                },
                "visuals_needed": [
                    "Labeled cell diagram",
                    "Comparison chart: plant vs animal cells",
                    "Microscope image of real cells"
                ]
            }
        
        return {
            "concept": f"Core concept for {topic} in {domain}",
            "key_points": [
                "Main idea 1", "Main idea 2", "Main idea 3"
            ],
            "vocabulary": {},
            "visuals_needed": []
        }
    
    def _add_science_scaffolding(self, domain: str, topic: str) -> Dict:
        """Add scaffolding for struggling students"""
        return {
            "graphic_organizers": [
                "Concept map template",
                "Venn diagram for comparisons",
                "KWL chart (Know, Want to know, Learned)"
            ],
            "vocabulary_support": {
                "picture_dictionary": True,
                "word_wall": True,
                "sentence_frames": [
                    "I observed that...",
                    "This is similar to... because...",
                    "I predict that... because..."
                ]
            },
            "simplified_text": "Break down into shorter sentences",
            "hands_on_models": "Use physical models before abstract concepts"
        }
    
    def _add_science_extensions(self, domain: str, topic: str) -> Dict:
        """Add extensions for advanced students"""
        return {
            "research_projects": [
                f"Investigate cutting-edge research in {topic}",
                f"Design an experiment to test a hypothesis about {topic}",
                f"Create a presentation explaining {topic} to younger students"
            ],
            "complex_questions": [
                "How might climate change affect this system?",
                "What ethical considerations exist?",
                "How could this be applied to solve real problems?"
            ],
            "cross_disciplinary": [
                "Connect to mathematics (data analysis, graphing)",
                "Connect to engineering (design solutions)",
                "Connect to social studies (science history, impact)"
            ]
        }
    
    def _generate_science_questions(
        self, domain: str, topic: str, level: str
    ) -> List[Dict]:
        """Generate practice questions"""
        return [
            {
                "type": "recall",
                "question": f"What is the main function of {topic}?",
                "bloom_level": "remember"
            },
            {
                "type": "explain",
                "question": f"Explain how {topic} works.",
                "bloom_level": "understand"
            },
            {
                "type": "apply",
                "question": f"Predict what would happen if {topic} was removed.",
                "bloom_level": "apply"
            },
            {
                "type": "analyze",
                "question": f"Compare and contrast {topic} in different organisms.",
                "bloom_level": "analyze"
            }
        ]
    
    def _get_real_world_science(self, domain: str, topic: str) -> List[str]:
        """Get real-world applications"""
        connections = {
            "biology": [
                "Medicine and healthcare",
                "Agriculture and food production",
                "Environmental conservation",
                "Biotechnology and genetics"
            ],
            "chemistry": [
                "Cooking and food science",
                "Cleaning products",
                "Batteries and energy storage",
                "Materials engineering"
            ],
            "physics": [
                "Transportation and vehicles",
                "Electronics and computers",
                "Sports and athletics",
                "Building and construction"
            ],
            "earth_science": [
                "Weather forecasting",
                "Natural disaster preparedness",
                "Resource management",
                "Space exploration"
            ]
        }
        return connections.get(domain, [])


class AdvancedELAGenerator:
    """
    Advanced English Language Arts content generator
    Reading, Writing, Speaking, Listening
    """
    
    def __init__(self):
        self.reading_skills = self._load_reading_skills()
        self.writing_genres = self._load_writing_genres()
        self.literary_elements = self._load_literary_elements()
    
    def _load_reading_skills(self) -> Dict:
        """Load reading comprehension skills"""
        return {
            "foundational": [
                "phonics", "phonemic_awareness", "fluency",
                "sight_words", "decoding"
            ],
            "comprehension": [
                "main_idea", "details", "sequence", "cause_effect",
                "compare_contrast", "inference", "prediction",
                "summarizing", "questioning"
            ],
            "literary_analysis": [
                "theme", "character_analysis", "plot_structure",
                "setting", "point_of_view", "symbolism",
                "figurative_language", "tone", "mood"
            ],
            "critical_reading": [
                "author_purpose", "bias", "fact_vs_opinion",
                "evaluate_sources", "synthesize_information"
            ]
        }
    
    def _load_writing_genres(self) -> Dict:
        """Load writing genres and structures"""
        return {
            "narrative": {
                "purpose": "Tell a story",
                "structure": ["beginning", "middle", "end"],
                "elements": [
                    "characters", "setting", "plot", "conflict",
                    "resolution", "dialogue"
                ],
                "prompts": [
                    "Write about a time you overcame a challenge",
                    "Create a story where the main character discovers something unexpected",
                    "Tell a story from an animal's perspective"
                ]
            },
            "informative": {
                "purpose": "Explain or inform",
                "structure": [
                    "introduction", "body_paragraphs", "conclusion"
                ],
                "elements": [
                    "topic_sentence", "facts", "examples",
                    "transitions", "summary"
                ],
                "prompts": [
                    "Explain how something works",
                    "Describe the life cycle of...",
                    "Compare two animals/places/time periods"
                ]
            },
            "argumentative": {
                "purpose": "Persuade with evidence",
                "structure": [
                    "claim", "reasons", "evidence",
                    "counterclaim", "rebuttal", "conclusion"
                ],
                "elements": [
                    "thesis_statement", "supporting_evidence",
                    "logical_reasoning", "credible_sources"
                ],
                "prompts": [
                    "Should schools have longer recess?",
                    "Is social media good or bad for teens?",
                    "Should schools require uniforms?"
                ]
            },
            "poetry": {
                "purpose": "Express feelings/ideas artistically",
                "forms": [
                    "haiku", "acrostic", "free_verse",
                    "limerick", "sonnet"
                ],
                "elements": [
                    "rhyme", "rhythm", "imagery",
                    "metaphor", "simile", "personification"
                ],
                "prompts": [
                    "Write a poem about a season",
                    "Describe an emotion using imagery",
                    "Write a haiku about nature"
                ]
            }
        }
    
    def _load_literary_elements(self) -> Dict:
        """Load literary elements for analysis"""
        return {
            "figurative_language": {
                "simile": "Comparison using like or as",
                "metaphor": "Direct comparison",
                "personification": "Giving human qualities to non-human",
                "hyperbole": "Extreme exaggeration",
                "idiom": "Phrase with non-literal meaning",
                "onomatopoeia": "Words that sound like what they mean"
            },
            "story_elements": {
                "character": "People/animals in the story",
                "setting": "Time and place",
                "plot": "Sequence of events",
                "conflict": "Problem or struggle",
                "theme": "Central message or lesson",
                "point_of_view": "Who tells the story"
            }
        }
    
    async def generate_ela_content(
        self,
        skill_area: str,  # reading, writing, grammar, vocabulary
        topic: str,
        grade_level: str,
        student_level: str = "proficient",
        genre: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate comprehensive ELA content"""
        
        content = {
            "skill_area": skill_area,
            "topic": topic,
            "grade_level": grade_level,
            "student_level": student_level,
            "timestamp": datetime.now().isoformat()
        }
        
        if skill_area == "reading":
            content["reading_content"] = await self._generate_reading_content(
                topic, grade_level, student_level
            )
        elif skill_area == "writing":
            content["writing_content"] = await self._generate_writing_content(
                genre or "narrative", grade_level, student_level
            )
        elif skill_area == "grammar":
            content["grammar_content"] = self._generate_grammar_content(
                topic, student_level
            )
        elif skill_area == "vocabulary":
            content["vocabulary_content"] = self._generate_vocabulary_content(
                topic, grade_level, student_level
            )
        
        # Add differentiation
        if student_level == "struggling":
            content["scaffolding"] = self._add_ela_scaffolding(skill_area)
        elif student_level == "advanced":
            content["extensions"] = self._add_ela_extensions(skill_area)
        
        return content
    
    async def _generate_reading_content(
        self, topic: str, grade: str, level: str
    ) -> Dict:
        """Generate reading comprehension content"""
        
        # Sample passage (would be retrieved from library)
        passage_complexity = {
            "struggling": "simple sentences, common words",
            "proficient": "varied sentences, grade-level vocabulary",
            "advanced": "complex sentences, sophisticated vocabulary"
        }
        
        return {
            "passage": {
                "title": f"Sample Text about {topic}",
                "text": "Passage text would go here...",
                "lexile_level": self._get_lexile_for_grade(grade),
                "complexity": passage_complexity.get(level, "proficient"),
                "length": f"{100 * int(grade)}+ words"
            },
            "comprehension_questions": [
                {
                    "type": "literal",
                    "question": "What happened first in the story?",
                    "answer_type": "multiple_choice"
                },
                {
                    "type": "inferential",
                    "question": "Why did the character make that choice?",
                    "answer_type": "short_answer"
                },
                {
                    "type": "evaluative",
                    "question": "Do you agree with the character's decision? Why?",
                    "answer_type": "paragraph"
                }
            ],
            "vocabulary_words": [
                {"word": "example", "definition": "...", "sentence": "..."}
            ],
            "discussion_questions": [
                "How does this connect to your life?",
                "What would you do differently?",
                "What's the author's message?"
            ]
        }
    
    async def _generate_writing_content(
        self, genre: str, grade: str, level: str
    ) -> Dict:
        """Generate writing assignment"""
        
        genre_data = self.writing_genres.get(genre, {})
        
        return {
            "genre": genre,
            "purpose": genre_data.get("purpose"),
            "prompt": random.choice(genre_data.get("prompts", ["Write about..."])),
            "structure": genre_data.get("structure", []),
            "graphic_organizer": self._get_organizer_for_genre(genre),
            "mentor_text": {
                "title": f"Example {genre.title()} Writing",
                "text": "Sample text...",
                "what_to_notice": [
                    "Strong opening",
                    "Clear organization",
                    "Descriptive language",
                    "Effective conclusion"
                ]
            },
            "checklist": [
                "Did I include all required elements?",
                "Did I use descriptive language?",
                "Did I check spelling and grammar?",
                "Did I vary my sentence structure?"
            ],
            "rubric": self._generate_writing_rubric(genre)
        }
    
    def _generate_grammar_content(self, topic: str, level: str) -> Dict:
        """Generate grammar lesson"""
        
        grammar_topics = {
            "parts_of_speech": {
                "nouns": "Person, place, thing, or idea",
                "verbs": "Action or state of being",
                "adjectives": "Describes a noun",
                "adverbs": "Describes a verb, adjective, or adverb"
            },
            "sentence_structure": {
                "simple": "One independent clause",
                "compound": "Two independent clauses joined",
                "complex": "Independent + dependent clause"
            },
            "punctuation": {
                "period": "End of statement",
                "question_mark": "End of question",
                "comma": "Pause or separate items",
                "apostrophe": "Possession or contraction"
            }
        }
        
        return {
            "topic": topic,
            "explanation": "Grammar concept explanation...",
            "examples": [
                "Correct example 1",
                "Correct example 2",
                "Correct example 3"
            ],
            "non_examples": [
                "Incorrect example (with correction)"
            ],
            "practice_sentences": [
                "Sentence for student to correct/identify"
            ],
            "application": "Write 5 sentences using this concept"
        }
    
    def _generate_vocabulary_content(
        self, topic: str, grade: str, level: str
    ) -> Dict:
        """Generate vocabulary lesson"""
        
        return {
            "words": [
                {
                    "word": "example",
                    "definition": "Student-friendly definition",
                    "part_of_speech": "noun",
                    "example_sentence": "Use in context...",
                    "synonyms": ["similar word 1", "similar word 2"],
                    "antonyms": ["opposite word"],
                    "word_family": ["related", "words"],
                    "image": "Visual representation"
                }
            ],
            "activities": [
                "Match words to definitions",
                "Fill in the blank sentences",
                "Create your own sentences",
                "Draw a picture representing the word",
                "Act out the word (charades)"
            ],
            "context_practice": "Short paragraph using all vocabulary words",
            "assessment": "Quiz on word meanings and usage"
        }
    
    def _add_ela_scaffolding(self, skill_area: str) -> Dict:
        """Add scaffolding for struggling students"""
        return {
            "reading_supports": [
                "Audio version of text",
                "Highlighted main ideas",
                "Vocabulary pre-teaching",
                "Chunked text (read small sections)",
                "Guiding questions while reading"
            ],
            "writing_supports": [
                "Sentence starters",
                "Word banks",
                "Graphic organizers",
                "Partner brainstorming",
                "Oral rehearsal before writing"
            ],
            "visual_aids": [
                "Anchor charts",
                "Example texts",
                "Step-by-step guides"
            ]
        }
    
    def _add_ela_extensions(self, skill_area: str) -> Dict:
        """Add extensions for advanced students"""
        return {
            "reading_extensions": [
                "Analyze author's craft and style",
                "Compare multiple texts on same topic",
                "Evaluate credibility of sources",
                "Create alternative ending",
                "Present book talk to class"
            ],
            "writing_extensions": [
                "Write in different genre about same topic",
                "Add multimedia elements to writing",
                "Publish writing for real audience",
                "Mentor younger writers",
                "Enter writing competition"
            ],
            "challenge_activities": [
                "Independent reading project",
                "Create podcast/video about book",
                "Write to author",
                "Research author's other works"
            ]
        }
    
    def _get_lexile_for_grade(self, grade: str) -> str:
        """Get appropriate Lexile range"""
        lexile_ranges = {
            "K": "BR-190L",
            "1": "190-530L",
            "2": "420-650L",
            "3": "520-820L",
            "4": "740-940L",
            "5": "830-1010L",
            "6": "925-1070L",
            "7": "970-1120L",
            "8": "1010-1185L",
            "9": "1050-1260L",
            "10": "1080-1335L",
            "11": "1185-1385L",
            "12": "1185-1385L"
        }
        return lexile_ranges.get(grade, "varies")
    
    def _get_organizer_for_genre(self, genre: str) -> Dict:
        """Get graphic organizer for writing genre"""
        organizers = {
            "narrative": {
                "name": "Story Map",
                "sections": [
                    "Characters", "Setting", "Beginning",
                    "Middle", "End", "Problem", "Solution"
                ]
            },
            "informative": {
                "name": "Main Idea Web",
                "sections": [
                    "Topic", "Main Idea 1 + details",
                    "Main Idea 2 + details", "Main Idea 3 + details"
                ]
            },
            "argumentative": {
                "name": "Claim-Evidence Chart",
                "sections": [
                    "Claim", "Reason 1 + Evidence",
                    "Reason 2 + Evidence", "Counterclaim", "Rebuttal"
                ]
            }
        }
        return organizers.get(genre, {"name": "Generic organizer"})
    
    def _generate_writing_rubric(self, genre: str) -> Dict:
        """Generate writing rubric"""
        return {
            "criteria": {
                "ideas_content": "Clear topic, relevant details",
                "organization": "Logical structure, transitions",
                "voice": "Appropriate style and tone",
                "word_choice": "Precise, varied vocabulary",
                "sentence_fluency": "Varied sentence structure",
                "conventions": "Grammar, spelling, punctuation"
            },
            "scale": "4 = Excellent, 3 = Good, 2 = Developing, 1 = Beginning"
        }


class WorldLanguagesGenerator:
    """
    World Languages content generator
    Supports 50+ languages with CEFR levels
    """
    
    def __init__(self):
        self.cefr_levels = self._load_cefr_framework()
        self.language_families = self._load_language_families()
    
    def _load_cefr_framework(self) -> Dict:
        """Load CEFR (Common European Framework) levels"""
        return {
            "A1": {
                "name": "Beginner",
                "can_do": [
                    "Introduce yourself",
                    "Ask and answer simple questions",
                    "Understand basic phrases",
                    "Use numbers, dates, prices"
                ],
                "vocabulary": "500-1000 words",
                "grammar": "Present tense, basic pronouns"
            },
            "A2": {
                "name": "Elementary",
                "can_do": [
                    "Describe family, hobbies, work",
                    "Handle simple transactions",
                    "Understand short texts",
                    "Write simple notes"
                ],
                "vocabulary": "1000-1500 words",
                "grammar": "Past tense, basic future, comparatives"
            },
            "B1": {
                "name": "Intermediate",
                "can_do": [
                    "Handle most travel situations",
                    "Describe experiences and events",
                    "Give reasons and explanations",
                    "Understand main points of clear texts"
                ],
                "vocabulary": "2000-2500 words",
                "grammar": "All tenses, conditionals, subjunctive"
            },
            "B2": {
                "name": "Upper Intermediate",
                "can_do": [
                    "Interact fluently with native speakers",
                    "Understand complex texts",
                    "Write detailed essays",
                    "Explain viewpoints on topics"
                ],
                "vocabulary": "3000-4000 words",
                "grammar": "Advanced structures, idioms"
            },
            "C1": {
                "name": "Advanced",
                "can_do": [
                    "Use language flexibly",
                    "Understand implicit meaning",
                    "Write complex texts",
                    "Present clear, well-structured arguments"
                ],
                "vocabulary": "5000+ words",
                "grammar": "Nuanced expressions, complex syntax"
            },
            "C2": {
                "name": "Mastery",
                "can_do": [
                    "Understand virtually everything",
                    "Express yourself spontaneously and precisely",
                    "Differentiate finer shades of meaning"
                ],
                "vocabulary": "8000+ words",
                "grammar": "Native-like proficiency"
            }
        }
    
    def _load_language_families(self) -> Dict:
        """Load language families for transfer strategies"""
        return {
            "romance": ["Spanish", "French", "Italian", "Portuguese", "Romanian"],
            "germanic": ["German", "Dutch", "Swedish", "Norwegian", "Danish"],
            "slavic": ["Russian", "Polish", "Czech", "Ukrainian"],
            "semitic": ["Arabic", "Hebrew"],
            "sinitic": ["Mandarin", "Cantonese"],
            "indo_aryan": ["Hindi", "Urdu", "Bengali"]
        }
    
    async def generate_language_lesson(
        self,
        language: str,
        cefr_level: str,
        topic: str,
        skill: str = "integrated"  # speaking, listening, reading, writing, integrated
    ) -> Dict[str, Any]:
        """Generate comprehensive language lesson"""
        
        level_data = self.cefr_levels.get(cefr_level, {})
        
        content = {
            "language": language,
            "cefr_level": cefr_level,
            "level_name": level_data.get("name"),
            "topic": topic,
            "skill_focus": skill,
            "timestamp": datetime.now().isoformat()
        }
        
        # 1. Vocabulary
        content["vocabulary"] = self._generate_vocabulary_list(
            language, topic, cefr_level
        )
        
        # 2. Grammar Point
        content["grammar"] = self._select_grammar_point(language, cefr_level)
        
        # 3. Authentic Materials
        content["authentic_materials"] = self._get_authentic_materials(
            language, cefr_level, topic
        )
        
        # 4. Communicative Activities
        content["activities"] = self._generate_language_activities(
            language, cefr_level, skill
        )
        
        # 5. Cultural Context
        content["cultural_notes"] = self._add_cultural_context(language, topic)
        
        # 6. Assessment
        content["assessment"] = self._generate_language_assessment(
            language, cefr_level, skill
        )
        
        return content
    
    def _generate_vocabulary_list(
        self, language: str, topic: str, level: str
    ) -> Dict:
        """Generate vocabulary for lesson"""
        
        # Example for Spanish
        if language == "Spanish" and topic == "family":
            vocab = {
                "A1": [
                    {"word": "familia", "english": "family", "pronunciation": "fah-MEE-lyah"},
                    {"word": "madre", "english": "mother", "pronunciation": "MAH-dreh"},
                    {"word": "padre", "english": "father", "pronunciation": "PAH-dreh"},
                    {"word": "hermano", "english": "brother", "pronunciation": "ehr-MAH-noh"},
                    {"word": "hermana", "english": "sister", "pronunciation": "ehr-MAH-nah"}
                ],
                "A2": [
                    {"word": "abuelo", "english": "grandfather"},
                    {"word": "abuela", "english": "grandmother"},
                    {"word": "tío", "english": "uncle"},
                    {"word": "tía", "english": "aunt"},
                    {"word": "primo/a", "english": "cousin"}
                ]
            }
            words = vocab.get(level, vocab["A1"])
        else:
            # Generic structure
            words = [
                {"word": f"{language} word 1", "english": "English translation"},
                {"word": f"{language} word 2", "english": "English translation"}
            ]
        
        return {
            "words": words,
            "practice_activities": [
                "Flashcards",
                "Matching game",
                "Fill in the blank",
                "Create sentences"
            ],
            "pronunciation_guide": "Audio files for each word"
        }
    
    def _select_grammar_point(self, language: str, level: str) -> Dict:
        """Select appropriate grammar point"""
        
        grammar_progression = {
            "A1": [
                "Present tense regular verbs",
                "Subject pronouns",
                "Basic sentence structure",
                "Question formation"
            ],
            "A2": [
                "Past tense",
                "Future expressions",
                "Adjective agreement",
                "Comparatives"
            ],
            "B1": [
                "Subjunctive mood",
                "Conditional sentences",
                "Complex sentence structures"
            ]
        }
        
        topics = grammar_progression.get(level, grammar_progression["A1"])
        
        return {
            "topic": random.choice(topics),
            "explanation": "Grammar rule explanation",
            "examples": ["Example 1", "Example 2", "Example 3"],
            "practice_exercises": [
                "Fill in the blank",
                "Transform sentences",
                "Error correction"
            ]
        }
    
    def _get_authentic_materials(
        self, language: str, level: str, topic: str
    ) -> Dict:
        """Get authentic materials in target language"""
        
        return {
            "reading": {
                "type": "Short text/dialogue",
                "title": f"{topic.title()} in {language}",
                "text": "Authentic text in target language...",
                "level": level,
                "comprehension_questions": [
                    "Who?", "What?", "Where?", "When?", "Why?"
                ]
            },
            "listening": {
                "type": "Audio clip",
                "duration": "1-3 minutes",
                "topic": topic,
                "tasks": [
                    "Listen for main idea",
                    "Listen for specific information",
                    "Listen and repeat"
                ]
            },
            "video": {
                "type": "Short video clip",
                "source": "Native speakers",
                "captions": "Available in target language",
                "tasks": ["Watch and answer questions"]
            }
        }
    
    def _generate_language_activities(
        self, language: str, level: str, skill: str
    ) -> List[Dict]:
        """Generate communicative activities"""
        
        activities = []
        
        # Speaking activities
        activities.append({
            "skill": "speaking",
            "activity": "Role Play",
            "description": "Practice a real-life conversation",
            "pairs_or_groups": "pairs",
            "time": "5-10 minutes",
            "example": "Order food at a restaurant"
        })
        
        # Listening activities
        activities.append({
            "skill": "listening",
            "activity": "Dictation",
            "description": "Listen and write what you hear",
            "format": "individual",
            "time": "10 minutes"
        })
        
        # Reading activities
        activities.append({
            "skill": "reading",
            "activity": "Comprehension Questions",
            "description": "Read and answer questions",
            "format": "individual or pairs",
            "time": "15 minutes"
        })
        
        # Writing activities
        activities.append({
            "skill": "writing",
            "activity": "Guided Writing",
            "description": "Write a paragraph using prompts",
            "format": "individual",
            "time": "15-20 minutes"
        })
        
        return activities
    
    def _add_cultural_context(self, language: str, topic: str) -> Dict:
        """Add cultural information"""
        
        return {
            "cultural_notes": [
                f"In {language}-speaking countries...",
                "Cultural practice related to topic",
                "Important customs to know"
            ],
            "comparisons": [
                "How is this similar to your culture?",
                "How is this different?",
                "What surprises you?"
            ],
            "authentic_products": [
                "Foods", "Music", "Art", "Literature", "Celebrations"
            ]
        }
    
    def _generate_language_assessment(
        self, language: str, level: str, skill: str
    ) -> Dict:
        """Generate language assessment"""
        
        return {
            "formative_assessment": [
                "Exit ticket (one thing learned today)",
                "Quick quiz on vocabulary",
                "Self-assessment checklist"
            ],
            "summative_assessment": {
                "speaking": "Oral interview or presentation",
                "listening": "Listen and answer questions",
                "reading": "Read passage and complete tasks",
                "writing": "Write paragraph or essay",
                "integrated": "Complete multi-skill task"
            },
            "rubric": {
                "comprehension": "Understands main ideas and details",
                "vocabulary": "Uses appropriate words for level",
                "grammar": "Applies grammar rules accurately",
                "fluency": "Speaks/writes with appropriate speed",
                "pronunciation": "Pronounces clearly and accurately",
                "cultural_awareness": "Shows understanding of culture"
            }
        }


# Create global instances
advanced_science_generator = AdvancedScienceGenerator()
advanced_ela_generator = AdvancedELAGenerator()
world_languages_generator = WorldLanguagesGenerator()
