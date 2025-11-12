"""
Comprehensive Subject Registry - Global K-12 Coverage
Defines all subjects with regional variations and cultural adaptations
Author: Principal Education Architect (ex-Google Education/UNESCO)
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any
from enum import Enum


class SubjectCategory(str, Enum):
    """Subject categories"""
    STEM = "stem"
    LANGUAGE = "language"
    SOCIAL_STUDIES = "social_studies"
    ARTS = "arts"
    WELLNESS = "wellness"
    TECHNOLOGY = "technology"
    LIFE_SKILLS = "life_skills"


@dataclass
class SubjectDefinition:
    """Complete subject definition with all properties"""
    id: str
    name: str
    category: SubjectCategory
    grade_levels: List[str]
    skills: List[str]
    prerequisites: List[str]
    assessment_types: List[str]
    content_types: List[str]
    regional_variations: Dict[str, Any]
    cultural_considerations: Dict[str, Any]
    multilingual_support: Dict[str, str]


class GlobalSubjectRegistry:
    """
    Comprehensive registry of all K-12 subjects
    Based on UNESCO ISCED and global educational standards
    """
    
    def __init__(self):
        self.subjects = self._initialize_subjects()
    
    def _initialize_subjects(self) -> Dict[str, SubjectDefinition]:
        """Initialize all subject definitions"""
        return {
            # ==================== MATHEMATICS ====================
            "mathematics": SubjectDefinition(
                id="math",
                name="Mathematics",
                category=SubjectCategory.STEM,
                grade_levels=["K-12"],
                skills=[
                    "arithmetic", "algebra", "geometry", "trigonometry",
                    "calculus", "statistics", "probability", "number_theory",
                    "discrete_math", "logic", "problem_solving"
                ],
                prerequisites=[],
                assessment_types=[
                    "problem_solving", "proof", "computation", "word_problems",
                    "projects", "real_world_applications"
                ],
                content_types=[
                    "lessons", "problems", "visualizations", "proofs",
                    "interactive_simulations", "real_world_scenarios"
                ],
                regional_variations={
                    "us": {
                        "standards": "Common Core Math",
                        "emphasis": "problem_solving",
                        "units": "imperial_metric_mix",
                        "grade_structure": "K-12"
                    },
                    "uk": {
                        "standards": "National Curriculum",
                        "emphasis": "reasoning",
                        "units": "metric",
                        "grade_structure": "Year_1-13"
                    },
                    "china": {
                        "standards": "National Mathematics Curriculum",
                        "emphasis": "computation",
                        "competition": "olympiad_focus",
                        "rigorous": True
                    },
                    "middle_east": {
                        "standards": "Various National",
                        "emphasis": "applied_math",
                        "cultural": "islamic_mathematics_history"
                    },
                    "africa": {
                        "standards": "CAPS/Cambridge",
                        "emphasis": "practical_application",
                        "challenges": "limited_resources"
                    }
                },
                cultural_considerations={
                    "measurement": {
                        "us": "inches_feet_miles",
                        "global": "metric"
                    },
                    "number_systems": {
                        "arabic": "eastern_arabic_numerals_optional",
                        "china": "chinese_numerals_traditional"
                    },
                    "examples": {
                        "money": "local_currency",
                        "context": "culturally_relevant"
                    }
                },
                multilingual_support={
                    "en": "Mathematics",
                    "es": "Matemáticas",
                    "fr": "Mathématiques",
                    "zh": "数学",
                    "ar": "الرياضيات",
                    "pt": "Matemática",
                    "sw": "Hisabati"
                }
            ),
            
            # ==================== SCIENCES ====================
            "biology": SubjectDefinition(
                id="biology",
                name="Biology / Life Science",
                category=SubjectCategory.STEM,
                grade_levels=["6-12"],
                skills=[
                    "cell_biology", "genetics", "evolution", "ecology",
                    "anatomy", "physiology", "biochemistry", "microbiology",
                    "botany", "zoology", "molecular_biology"
                ],
                prerequisites=["basic_science"],
                assessment_types=[
                    "lab_reports", "experiments", "research_projects",
                    "dissections", "fieldwork", "presentations"
                ],
                content_types=[
                    "concepts", "labs", "simulations", "diagrams",
                    "videos", "virtual_dissections", "microscopy"
                ],
                regional_variations={
                    "us": {
                        "standards": "NGSS Life Science",
                        "topics": ["evolution", "genetics", "ecology"],
                        "labs": "extensive"
                    },
                    "uk": {
                        "standards": "GCSE/A-Level Biology",
                        "practical": "mandatory"
                    },
                    "middle_east": {
                        "standards": "National",
                        "evolution": "limited_or_adapted",
                        "human_anatomy": "gender_sensitive"
                    },
                    "china": {
                        "standards": "National Biology",
                        "emphasis": "molecular_biology",
                        "gaokao": "exam_focused"
                    },
                    "africa": {
                        "focus": "local_ecosystems",
                        "diseases": "tropical_diseases_emphasis"
                    }
                },
                cultural_considerations={
                    "evolution": {
                        "middle_east": "sensitive_topic",
                        "alternative": "adaptation_focus"
                    },
                    "human_reproduction": {
                        "approach": "age_appropriate",
                        "cultural": "sensitivity_required"
                    },
                    "dissection": {
                        "alternatives": "virtual_options",
                        "religious": "considerations"
                    }
                },
                multilingual_support={
                    "en": "Biology",
                    "es": "Biología",
                    "fr": "Biologie",
                    "zh": "生物学",
                    "ar": "علم الأحياء",
                    "pt": "Biologia",
                    "sw": "Biolojia"
                }
            ),
            
            "chemistry": SubjectDefinition(
                id="chemistry",
                name="Chemistry",
                category=SubjectCategory.STEM,
                grade_levels=["8-12"],
                skills=[
                    "atomic_structure", "chemical_reactions", "stoichiometry",
                    "acids_bases", "thermodynamics", "organic_chemistry",
                    "electrochemistry", "lab_techniques"
                ],
                prerequisites=["algebra", "basic_science"],
                assessment_types=[
                    "lab_work", "calculations", "molecular_modeling",
                    "chemical_equations", "experiments"
                ],
                content_types=[
                    "concepts", "labs", "equations", "molecular_visualizations",
                    "interactive_simulations", "safety_procedures"
                ],
                regional_variations={
                    "us": {"standards": "NGSS Physical Science"},
                    "uk": {"standards": "GCSE/A-Level Chemistry"},
                    "china": {"emphasis": "theoretical_rigor"},
                    "africa": {"challenges": "lab_equipment_limited"}
                },
                cultural_considerations={
                    "lab_safety": {"universal": "critical_priority"},
                    "nomenclature": {"iupac": "standard", "local": "variations"}
                },
                multilingual_support={
                    "en": "Chemistry",
                    "es": "Química",
                    "fr": "Chimie",
                    "zh": "化学",
                    "ar": "الكيمياء"
                }
            ),
            
            "physics": SubjectDefinition(
                id="physics",
                name="Physics",
                category=SubjectCategory.STEM,
                grade_levels=["8-12"],
                skills=[
                    "mechanics", "electricity", "magnetism", "waves",
                    "thermodynamics", "optics", "modern_physics", "quantum"
                ],
                prerequisites=["algebra", "trigonometry"],
                assessment_types=[
                    "problem_solving", "lab_experiments", "conceptual_questions",
                    "mathematical_proofs"
                ],
                content_types=[
                    "concepts", "problems", "simulations", "demonstrations",
                    "videos", "interactive_experiments"
                ],
                regional_variations={
                    "us": {
                        "standards": "NGSS Physical Science",
                        "units": "imperial_and_metric"
                    },
                    "europe": {
                        "standards": "European Baccalaureate",
                        "units": "metric"
                    },
                    "china": {
                        "emphasis": "mathematical_rigor",
                        "competition": "physics_olympiad"
                    }
                },
                cultural_considerations={
                    "units": {"us": "imperial", "global": "SI_units"}
                },
                multilingual_support={
                    "en": "Physics",
                    "es": "Física",
                    "fr": "Physique",
                    "zh": "物理",
                    "ar": "الفيزياء"
                }
            ),
            
            # ==================== LANGUAGE ARTS ====================
            "english_language_arts": SubjectDefinition(
                id="ela",
                name="English Language Arts",
                category=SubjectCategory.LANGUAGE,
                grade_levels=["K-12"],
                skills=[
                    "reading", "writing", "speaking", "listening",
                    "grammar", "literature", "rhetoric", "composition",
                    "critical_analysis", "creative_writing"
                ],
                prerequisites=[],
                assessment_types=[
                    "essay", "comprehension", "analysis", "creative_writing",
                    "presentations", "discussions", "portfolios"
                ],
                content_types=[
                    "texts", "writing_prompts", "grammar_exercises",
                    "literature_analysis", "vocabulary", "audio"
                ],
                regional_variations={
                    "us": {
                        "standards": "Common Core ELA",
                        "spelling": "american",
                        "literature": "american_british_world"
                    },
                    "uk": {
                        "standards": "National Curriculum English",
                        "spelling": "british",
                        "shakespeare": "mandatory"
                    },
                    "africa": {
                        "focus": "english_second_language",
                        "literature": "african_writers"
                    }
                },
                cultural_considerations={
                    "spelling": {"us": "american", "uk": "british"},
                    "literature": {"diverse": "multicultural_texts"},
                    "dialects": {"respect": "all_varieties"}
                },
                multilingual_support={
                    "en": "English Language Arts",
                    "es": "Artes del Lenguaje Inglés",
                    "fr": "Arts du Langage Anglais"
                }
            ),
            
            # ==================== WORLD LANGUAGES ====================
            "world_languages": SubjectDefinition(
                id="world_lang",
                name="World Languages",
                category=SubjectCategory.LANGUAGE,
                grade_levels=["K-12"],
                skills=[
                    "speaking", "listening", "reading", "writing",
                    "cultural_competence", "pronunciation", "grammar",
                    "vocabulary", "conversation"
                ],
                prerequisites=[],
                assessment_types=[
                    "oral_exams", "written_exams", "projects",
                    "presentations", "conversations", "cultural_projects"
                ],
                content_types=[
                    "dialogues", "texts", "audio", "video",
                    "cultural_content", "immersion_activities"
                ],
                regional_variations={
                    "us": {"popular": ["spanish", "french", "mandarin"]},
                    "europe": {"requirement": "two_foreign_languages"},
                    "china": {"primary": "english", "secondary": ["japanese", "russian"]},
                    "middle_east": {"primary": ["english", "french"], "classical": "arabic"},
                    "africa": {"colonial": ["english", "french", "portuguese"], "local": "varied"}
                },
                cultural_considerations={
                    "cultural_immersion": "essential",
                    "native_speakers": "preferred_teachers",
                    "dialects": "standard_and_regional"
                },
                multilingual_support={
                    "supported_languages": [
                        "spanish", "french", "mandarin", "arabic", "german",
                        "portuguese", "swahili", "japanese", "russian", "italian",
                        "korean", "hindi", "urdu", "farsi"
                    ]
                }
            ),
            
            # ==================== SOCIAL STUDIES ====================
            "history": SubjectDefinition(
                id="history",
                name="History",
                category=SubjectCategory.SOCIAL_STUDIES,
                grade_levels=["K-12"],
                skills=[
                    "chronology", "cause_effect", "source_analysis",
                    "historical_thinking", "research", "interpretation",
                    "perspective_taking", "bias_detection"
                ],
                prerequisites=[],
                assessment_types=[
                    "essays", "document_analysis", "research_papers",
                    "presentations", "debates", "timelines"
                ],
                content_types=[
                    "narratives", "primary_sources", "timelines",
                    "maps", "videos", "virtual_tours"
                ],
                regional_variations={
                    "us": {
                        "focus": "us_history",
                        "world_history": "western_emphasis",
                        "ap_available": True
                    },
                    "europe": {
                        "focus": "european_history",
                        "approach": "multi_perspective"
                    },
                    "china": {
                        "focus": "chinese_history",
                        "dynasties": "detailed",
                        "modern": "ccp_perspective"
                    },
                    "middle_east": {
                        "focus": "islamic_history",
                        "regional": "emphasis",
                        "crusades": "different_perspective"
                    },
                    "africa": {
                        "focus": "african_history",
                        "precolonial": "emphasis",
                        "colonial": "critical_analysis",
                        "independence": "movements"
                    }
                },
                cultural_considerations={
                    "multiple_perspectives": "essential",
                    "colonialism": "sensitive_treatment",
                    "religious_history": "balanced_approach",
                    "indigenous": "voices_included"
                },
                multilingual_support={
                    "en": "History",
                    "es": "Historia",
                    "fr": "Histoire",
                    "zh": "历史",
                    "ar": "التاريخ"
                }
            ),
            
            "geography": SubjectDefinition(
                id="geography",
                name="Geography",
                category=SubjectCategory.SOCIAL_STUDIES,
                grade_levels=["K-12"],
                skills=[
                    "map_reading", "spatial_thinking", "human_geography",
                    "physical_geography", "GIS", "climate", "demographics"
                ],
                prerequisites=[],
                assessment_types=[
                    "map_work", "case_studies", "fieldwork",
                    "data_analysis", "presentations"
                ],
                content_types=[
                    "maps", "case_studies", "data_sets",
                    "virtual_fieldtrips", "satellite_imagery"
                ],
                regional_variations={
                    "us": {"standards": "National Geography Standards"},
                    "uk": {"standards": "GCSE Geography", "fieldwork": "required"},
                    "africa": {"focus": "african_geography", "development": "emphasis"}
                },
                cultural_considerations={
                    "map_projections": "various_perspectives",
                    "place_names": "local_respect",
                    "borders": "disputed_territories_sensitive"
                },
                multilingual_support={
                    "en": "Geography",
                    "es": "Geografía",
                    "fr": "Géographie",
                    "zh": "地理",
                    "ar": "الجغرافيا"
                }
            ),
            
            # ==================== ARTS ====================
            "visual_arts": SubjectDefinition(
                id="visual_arts",
                name="Visual Arts",
                category=SubjectCategory.ARTS,
                grade_levels=["K-12"],
                skills=[
                    "drawing", "painting", "sculpture", "digital_art",
                    "art_history", "criticism", "aesthetics", "design"
                ],
                prerequisites=[],
                assessment_types=[
                    "portfolio", "critique", "art_history_essays",
                    "projects", "exhibitions"
                ],
                content_types=[
                    "techniques", "projects", "art_history",
                    "criticism", "studio_work"
                ],
                regional_variations={
                    "us": {"standards": "National Core Arts Standards"},
                    "china": {
                        "emphasis": "traditional_techniques",
                        "calligraphy": True,
                        "ink_painting": True
                    },
                    "africa": {
                        "emphasis": "traditional_contemporary",
                        "crafts": True,
                        "cultural_art": "central"
                    }
                },
                cultural_considerations={
                    "representation": "diverse_artists",
                    "techniques": "global_traditions",
                    "religious_art": "respectful"
                },
                multilingual_support={
                    "en": "Visual Arts",
                    "es": "Artes Visuales",
                    "fr": "Arts Visuels",
                    "zh": "视觉艺术",
                    "ar": "الفنون البصرية"
                }
            ),
            
            "music": SubjectDefinition(
                id="music",
                name="Music",
                category=SubjectCategory.ARTS,
                grade_levels=["K-12"],
                skills=[
                    "performance", "theory", "composition", "music_history",
                    "listening", "sight_reading", "ear_training"
                ],
                prerequisites=[],
                assessment_types=[
                    "performance", "theory_exams", "composition",
                    "listening_tests", "concerts"
                ],
                content_types=[
                    "sheet_music", "theory_lessons", "listening_examples",
                    "history", "videos", "interactive_lessons"
                ],
                regional_variations={
                    "us": {"emphasis": "band_orchestra_choir"},
                    "europe": {
                        "emphasis": "classical_tradition",
                        "solfege": True,
                        "conservatory": "pathway"
                    },
                    "china": {
                        "blend": "western_traditional",
                        "instruments": ["guzheng", "erhu", "piano"],
                        "exams": "graded_system"
                    },
                    "africa": {
                        "emphasis": "traditional_modern",
                        "drumming": True,
                        "oral_tradition": True
                    },
                    "middle_east": {
                        "instruments": ["oud", "qanun"],
                        "scales": "maqam_system",
                        "cultural_music": "rich_tradition"
                    }
                },
                cultural_considerations={
                    "world_music": "inclusive",
                    "instruments": "diverse_global",
                    "notation": "western_and_other"
                },
                multilingual_support={
                    "en": "Music",
                    "es": "Música",
                    "fr": "Musique",
                    "zh": "音乐",
                    "ar": "الموسيقى"
                }
            ),
            
            # ==================== PHYSICAL EDUCATION ====================
            "physical_education": SubjectDefinition(
                id="pe",
                name="Physical Education",
                category=SubjectCategory.WELLNESS,
                grade_levels=["K-12"],
                skills=[
                    "fitness", "sports", "health", "teamwork",
                    "motor_skills", "coordination", "strategy"
                ],
                prerequisites=[],
                assessment_types=[
                    "performance", "fitness_tests", "knowledge_tests",
                    "participation", "sportsmanship"
                ],
                content_types=[
                    "activities", "rules", "health_concepts",
                    "fitness_plans", "videos", "demonstrations"
                ],
                regional_variations={
                    "us": {"standards": "SHAPE America", "sports": "american_football"},
                    "china": {
                        "emphasis": "collective_exercises",
                        "martial_arts": True,
                        "exams": "fitness_required"
                    },
                    "europe": {"emphasis": "lifetime_sports", "football": "soccer"},
                    "africa": {"sports": ["football", "athletics"], "facilities": "variable"}
                },
                cultural_considerations={
                    "gender": "inclusive_activities",
                    "religious": "modest_dress_options",
                    "sports": "culturally_relevant"
                },
                multilingual_support={
                    "en": "Physical Education",
                    "es": "Educación Física",
                    "fr": "Éducation Physique",
                    "zh": "体育",
                    "ar": "التربية البدنية"
                }
            ),
            
            # ==================== TECHNOLOGY ====================
            "computer_science": SubjectDefinition(
                id="cs",
                name="Computer Science",
                category=SubjectCategory.TECHNOLOGY,
                grade_levels=["K-12"],
                skills=[
                    "programming", "algorithms", "data_structures",
                    "web_development", "AI_basics", "cybersecurity",
                    "computational_thinking", "debugging"
                ],
                prerequisites=["algebra"],
                assessment_types=[
                    "coding_projects", "problem_solving", "portfolio",
                    "exams", "hackathons", "presentations"
                ],
                content_types=[
                    "tutorials", "coding_challenges", "projects",
                    "concepts", "videos", "interactive_coding"
                ],
                regional_variations={
                    "us": {
                        "standards": "CSTA K-12 Standards",
                        "languages": ["python", "javascript"],
                        "ap_available": True
                    },
                    "uk": {
                        "standards": "Computing Curriculum",
                        "emphasis": "computational_thinking",
                        "mandatory": "ages_5-16"
                    },
                    "china": {
                        "emphasis": "competitive_programming",
                        "languages": ["c++", "python"],
                        "olympiad": "focus"
                    },
                    "africa": {
                        "focus": "practical_skills",
                        "mobile": "development_emphasis",
                        "challenges": "connectivity"
                    }
                },
                cultural_considerations={
                    "access": "digital_divide",
                    "languages": "programming_english_based",
                    "applications": "locally_relevant"
                },
                multilingual_support={
                    "en": "Computer Science",
                    "es": "Ciencias de la Computación",
                    "fr": "Informatique",
                    "zh": "计算机科学",
                    "ar": "علوم الحاسوب"
                }
            ),
            
            # ==================== HEALTH & WELLNESS ====================
            "health_education": SubjectDefinition(
                id="health",
                name="Health Education",
                category=SubjectCategory.WELLNESS,
                grade_levels=["K-12"],
                skills=[
                    "nutrition", "mental_health", "safety", "relationships",
                    "substance_prevention", "hygiene", "disease_prevention"
                ],
                prerequisites=[],
                assessment_types=[
                    "projects", "presentations", "knowledge_tests",
                    "journals", "discussions"
                ],
                content_types=[
                    "information", "scenarios", "decision_making",
                    "resources", "videos", "guest_speakers"
                ],
                regional_variations={
                    "us": {"standards": "National Health Education Standards"},
                    "europe": {"emphasis": "holistic_health"},
                    "middle_east": {
                        "cultural": "sensitivity_required",
                        "topics": "adapted"
                    },
                    "africa": {
                        "focus": "disease_prevention",
                        "hiv_aids": "emphasis",
                        "malaria": "prevention",
                        "community_health": True
                    }
                },
                cultural_considerations={
                    "sex_education": "culturally_appropriate",
                    "mental_health": "stigma_awareness",
                    "diet": "cultural_foods",
                    "gender": "sensitive_topics"
                },
                multilingual_support={
                    "en": "Health Education",
                    "es": "Educación para la Salud",
                    "fr": "Éducation à la Santé",
                    "zh": "健康教育",
                    "ar": "التربية الصحية"
                }
            )
        }
    
    def get_subject(self, subject_id: str) -> Optional[SubjectDefinition]:
        """Get subject definition"""
        return self.subjects.get(subject_id)
    
    def get_subjects_by_category(self, category: SubjectCategory) -> List[SubjectDefinition]:
        """Get all subjects in a category"""
        return [s for s in self.subjects.values() if s.category == category]
    
    def get_subjects_by_grade(self, grade: str) -> List[SubjectDefinition]:
        """Get all subjects for a grade level"""
        return [
            s for s in self.subjects.values()
            if grade in s.grade_levels or "K-12" in s.grade_levels
        ]
    
    def get_regional_adaptation(
        self, 
        subject_id: str, 
        region: str
    ) -> Optional[Dict[str, Any]]:
        """Get regional adaptations for a subject"""
        subject = self.get_subject(subject_id)
        if subject:
            return subject.regional_variations.get(region)
        return None


# Global registry instance
global_subject_registry = GlobalSubjectRegistry()
