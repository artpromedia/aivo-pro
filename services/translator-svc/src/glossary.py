"""
Education and IEP terminology glossary
Preserves specialized terms during translation
"""

# IEP and education-specific terminology
IEP_TERMINOLOGY = {
    # IEP Document Terms
    "IEP": {
        "category": "iep",
        "preserve": True,
        "description": "Individualized Education Program"
    },
    "504 Plan": {
        "category": "iep",
        "preserve": True,
        "description": "Section 504 Plan"
    },
    "FAPE": {
        "category": "iep",
        "preserve": True,
        "description": "Free Appropriate Public Education"
    },
    "LRE": {
        "category": "iep",
        "preserve": True,
        "description": "Least Restrictive Environment"
    },
    "IDEA": {
        "category": "iep",
        "preserve": True,
        "description": "Individuals with Disabilities Education Act"
    },
    
    # Assessment Terms
    "Present Levels of Performance": {
        "category": "assessment",
        "preserve": False,
        "translations": {
            "es": "Niveles Actuales de Rendimiento",
            "fr": "Niveaux de Performance Actuels"
        }
    },
    "Measurable Annual Goals": {
        "category": "assessment",
        "preserve": False,
        "translations": {
            "es": "Metas Anuales Medibles",
            "fr": "Objectifs Annuels Mesurables"
        }
    },
    "Baseline Data": {
        "category": "assessment",
        "preserve": False,
        "translations": {
            "es": "Datos de Referencia",
            "fr": "Données de Base"
        }
    },
    "Progress Monitoring": {
        "category": "assessment",
        "preserve": False,
        "translations": {
            "es": "Monitoreo del Progreso",
            "fr": "Suivi des Progrès"
        }
    },
    
    # Service Types
    "Speech Therapy": {
        "category": "services",
        "preserve": False,
        "translations": {
            "es": "Terapia del Habla",
            "fr": "Orthophonie",
            "ar": "علاج النطق"
        }
    },
    "Occupational Therapy": {
        "category": "services",
        "preserve": False,
        "translations": {
            "es": "Terapia Ocupacional",
            "fr": "Ergothérapie",
            "ar": "العلاج الوظيفي"
        }
    },
    "Physical Therapy": {
        "category": "services",
        "preserve": False,
        "translations": {
            "es": "Fisioterapia",
            "fr": "Kinésithérapie",
            "ar": "العلاج الطبيعي"
        }
    },
    "Counseling Services": {
        "category": "services",
        "preserve": False,
        "translations": {
            "es": "Servicios de Consejería",
            "fr": "Services de Conseil"
        }
    },
    
    # Disability Categories
    "Autism Spectrum Disorder": {
        "category": "disability",
        "preserve": False,
        "translations": {
            "es": "Trastorno del Espectro Autista",
            "fr": "Trouble du Spectre de l'Autisme",
            "ar": "اضطراب طيف التوحد"
        }
    },
    "Specific Learning Disability": {
        "category": "disability",
        "preserve": False,
        "translations": {
            "es": "Discapacidad Específica del Aprendizaje",
            "fr": "Trouble Spécifique de l'Apprentissage"
        }
    },
    "ADHD": {
        "category": "disability",
        "preserve": True,
        "description": "Attention Deficit Hyperactivity Disorder"
    },
    "Dyslexia": {
        "category": "disability",
        "preserve": False,
        "translations": {
            "es": "Dislexia",
            "fr": "Dyslexie",
            "ar": "عسر القراءة"
        }
    },
    
    # Accommodations & Modifications
    "Extended Time": {
        "category": "accommodation",
        "preserve": False,
        "translations": {
            "es": "Tiempo Extendido",
            "fr": "Temps Supplémentaire"
        }
    },
    "Preferential Seating": {
        "category": "accommodation",
        "preserve": False,
        "translations": {
            "es": "Asientos Preferenciales",
            "fr": "Siège Préférentiel"
        }
    },
    "Assistive Technology": {
        "category": "accommodation",
        "preserve": False,
        "translations": {
            "es": "Tecnología de Asistencia",
            "fr": "Technologie d'Assistance",
            "ar": "التكنولوجيا المساعدة"
        }
    },
    "Visual Supports": {
        "category": "accommodation",
        "preserve": False,
        "translations": {
            "es": "Apoyos Visuales",
            "fr": "Supports Visuels"
        }
    },
    
    # Educational Settings
    "General Education Classroom": {
        "category": "setting",
        "preserve": False,
        "translations": {
            "es": "Aula de Educación General",
            "fr": "Classe d'Enseignement Général"
        }
    },
    "Special Education Classroom": {
        "category": "setting",
        "preserve": False,
        "translations": {
            "es": "Aula de Educación Especial",
            "fr": "Classe d'Enseignement Spécialisé"
        }
    },
    "Inclusion": {
        "category": "setting",
        "preserve": False,
        "translations": {
            "es": "Inclusión",
            "fr": "Inclusion",
            "ar": "الدمج"
        }
    },
    
    # Standardized Test Terms
    "Standardized Assessment": {
        "category": "testing",
        "preserve": False,
        "translations": {
            "es": "Evaluación Estandarizada",
            "fr": "Évaluation Standardisée"
        }
    },
    "Percentile Rank": {
        "category": "testing",
        "preserve": False,
        "translations": {
            "es": "Rango Percentil",
            "fr": "Rang Percentile"
        }
    },
    "Standard Score": {
        "category": "testing",
        "preserve": False,
        "translations": {
            "es": "Puntuación Estándar",
            "fr": "Score Standard"
        }
    },
}

# Math-specific terms (preserve during translation)
MATH_TERMS = {
    "addition", "subtraction", "multiplication", "division",
    "fraction", "decimal", "percentage", "ratio", "proportion",
    "equation", "variable", "constant", "coefficient",
    "algebra", "geometry", "trigonometry", "calculus",
    "theorem", "proof", "hypothesis"
}

# Programming terms (preserve during translation)
PROGRAMMING_TERMS = {
    "function", "variable", "loop", "conditional", "array",
    "object", "class", "method", "parameter", "argument",
    "return", "import", "export", "module", "package",
    "API", "JSON", "HTML", "CSS", "JavaScript", "Python"
}

# Interface elements (context-aware translation)
INTERFACE_TERMS = {
    "button": {
        "es": "botón",
        "fr": "bouton",
        "ar": "زر"
    },
    "menu": {
        "es": "menú",
        "fr": "menu",
        "ar": "قائمة"
    },
    "dashboard": {
        "es": "panel",
        "fr": "tableau de bord",
        "ar": "لوحة القيادة"
    },
    "settings": {
        "es": "configuración",
        "fr": "paramètres",
        "ar": "الإعدادات"
    },
    "profile": {
        "es": "perfil",
        "fr": "profil",
        "ar": "الملف الشخصي"
    },
    "notifications": {
        "es": "notificaciones",
        "fr": "notifications",
        "ar": "الإشعارات"
    }
}


def get_term_translation(
    term: str,
    target_lang: str,
    category: str = "general"
) -> str:
    """
    Get translation for a specialized term
    
    Args:
        term: Term to translate
        target_lang: Target language code
        category: Category (iep, math, programming, interface)
    
    Returns:
        Translated term or original if not found
    """
    # Check IEP terminology
    if term in IEP_TERMINOLOGY:
        term_data = IEP_TERMINOLOGY[term]
        
        # Preserve if marked
        if term_data.get("preserve", False):
            return term
        
        # Get translation if available
        translations_obj = term_data.get("translations", {})
        if isinstance(translations_obj, dict):
            if target_lang in translations_obj:
                return translations_obj[target_lang]
    
    # Check interface terms
    if category == "interface" and term.lower() in INTERFACE_TERMS:
        translations = INTERFACE_TERMS[term.lower()]
        return translations.get(target_lang, term)
    
    # Preserve math and programming terms
    if (category == "math" and term.lower() in MATH_TERMS) or \
       (category == "programming" and term.lower() in PROGRAMMING_TERMS):
        return term
    
    return term
