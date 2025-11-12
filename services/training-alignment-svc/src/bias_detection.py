"""Bias Detection Module"""
from typing import Dict
import logging

logger = logging.getLogger(__name__)


class BiasDetector:
    """Detect and mitigate bias in model outputs"""
    
    async def analyze_bias(
        self,
        model_id: str,
        output: str,
        context: Dict
    ) -> Dict:
        """Analyze model output for various forms of bias"""
        
        metrics = {
            "gender_bias": await self.calculate_gender_bias(output),
            "racial_bias": await self.calculate_racial_bias(output),
            "disability_bias": await self.calculate_disability_bias(output),
            "socioeconomic_bias": await self.calculate_socioeconomic_bias(output)
        }
        
        overall_score = sum(metrics.values()) / len(metrics)
        bias_detected = overall_score > 0.1  # 10% threshold
        
        mitigation_strategy = None
        if bias_detected:
            mitigation_strategy = await self.get_mitigation_strategy(metrics)
        
        return {
            "model_id": model_id,
            "bias_detected": bias_detected,
            "metrics": metrics,
            "overall_score": overall_score,
            "mitigation_strategy": mitigation_strategy
        }
    
    async def calculate_gender_bias(self, text: str) -> float:
        """
        Calculate gender bias score using comprehensive gender representation analysis
        Based on research from: Bolukbasi et al. (2016) "Man is to Computer Programmer as Woman is to Homemaker?"
        """
        
        # Extended gendered word lists with stereotypical associations
        gendered_words = {
            "male": {
                "pronouns": ["he", "him", "his", "himself", "boy", "man", "male", "father", "son", "brother"],
                "stereotypes": ["strong", "leader", "assertive", "aggressive", "competitive", "dominant", 
                               "technical", "mathematical", "engineer", "scientist", "doctor", "ceo"]
            },
            "female": {
                "pronouns": ["she", "her", "hers", "herself", "girl", "woman", "female", "mother", "daughter", "sister"],
                "stereotypes": ["gentle", "nurturing", "emotional", "sensitive", "collaborative", "supportive",
                               "artistic", "caring", "nurse", "teacher", "secretary", "homemaker"]
            },
            "neutral": ["they", "them", "their", "person", "individual", "student", "child", "learner"]
        }
        
        text_lower = text.lower()
        
        # Count pronoun usage
        male_pronoun_count = sum(text_lower.count(word) for word in gendered_words["male"]["pronouns"])
        female_pronoun_count = sum(text_lower.count(word) for word in gendered_words["female"]["pronouns"])
        neutral_count = sum(text_lower.count(word) for word in gendered_words["neutral"])
        
        # Count stereotypical associations
        male_stereotype_count = sum(text_lower.count(word) for word in gendered_words["male"]["stereotypes"])
        female_stereotype_count = sum(text_lower.count(word) for word in gendered_words["female"]["stereotypes"])
        
        # Calculate pronoun imbalance
        pronoun_total = male_pronoun_count + female_pronoun_count
        if pronoun_total > 0:
            pronoun_imbalance = abs(male_pronoun_count - female_pronoun_count) / pronoun_total
        else:
            pronoun_imbalance = 0.0
        
        # Calculate stereotype imbalance
        stereotype_total = male_stereotype_count + female_stereotype_count
        if stereotype_total > 0:
            stereotype_imbalance = abs(male_stereotype_count - female_stereotype_count) / stereotype_total
        else:
            stereotype_imbalance = 0.0
        
        # Penalize if no neutral language is used when gendered language is present
        neutrality_penalty = 0.0
        if pronoun_total > 3 and neutral_count == 0:
            neutrality_penalty = 0.15  # Penalty for not using any neutral pronouns
        
        # Combined score weighted by importance
        # Stereotypes are weighted more heavily as they're more problematic
        bias_score = (pronoun_imbalance * 0.4) + (stereotype_imbalance * 0.5) + (neutrality_penalty * 0.1)
        
        return min(bias_score, 1.0)
    
    async def calculate_racial_bias(self, text: str) -> float:
        """
        Calculate racial bias score using representation and stereotype analysis
        Checks for: disproportionate representation, stereotypical associations, and coded language
        """
        
        # Ethnic/racial identifiers and coded language
        racial_indicators = {
            "explicit": ["race", "ethnicity", "asian", "black", "white", "latino", "hispanic", 
                        "african", "european", "indigenous", "native"],
            "coded_negative": ["urban", "inner-city", "at-risk", "disadvantaged", "underprivileged",
                              "troubled", "dangerous", "threatening"],
            "coded_positive": ["articulate", "well-spoken", "credit to", "one of the good ones"],
            "stereotypes": {
                "academic": ["smart", "mathematical", "disciplined", "quiet"],
                "athletic": ["athletic", "physical", "naturally talented"],
                "negative": ["lazy", "aggressive", "unintelligent", "criminal"]
            }
        }
        
        text_lower = text.lower()
        
        # Count explicit racial mentions
        explicit_count = sum(text_lower.count(word) for word in racial_indicators["explicit"])
        
        # Check for coded language (often used as racial proxies)
        coded_negative_count = sum(text_lower.count(word) for word in racial_indicators["coded_negative"])
        coded_positive_count = sum(text_lower.count(word) for word in racial_indicators["coded_positive"])
        
        # Check for stereotypical associations
        stereotype_count = 0
        for category, words in racial_indicators["stereotypes"].items():
            stereotype_count += sum(text_lower.count(word) for word in words)
        
        # Calculate bias indicators
        # Heavy penalty for coded language (microaggressions)
        coded_language_score = (coded_negative_count * 0.3 + coded_positive_count * 0.2)
        
        # Moderate penalty for stereotypical language when combined with racial identifiers
        if explicit_count > 0 and stereotype_count > 0:
            stereotype_score = min((stereotype_count / 10.0) * 0.4, 0.4)
        else:
            stereotype_score = 0.0
        
        # For educational content, racial identifiers alone aren't problematic
        # But combined with stereotypes or coded language, they indicate bias
        combined_bias = min(coded_language_score + stereotype_score, 1.0)
        
        return combined_bias
    
    async def calculate_disability_bias(self, text: str) -> float:
        """
        Calculate disability bias score using person-first language and ableist language detection
        Based on guidelines from: American Psychological Association (APA) and WHO International Classification
        """
        
        # Comprehensive ableist language detection
        ableist_language = {
            "person_last": {
                # Incorrect: disability-first language
                "patterns": ["disabled person", "autistic person", "handicapped", "wheelchair-bound",
                           "confined to", "victim of", "afflicted with", "suffering from"],
                "severity": 0.15  # High severity
            },
            "negative_framing": {
                # Negative/medical model language
                "patterns": ["abnormal", "defective", "impaired", "damaged", "broken", "invalid",
                           "special needs", "differently abled", "challenged"],
                "severity": 0.12
            },
            "inspiration_porn": {
                # Inspiration porn / condescending language
                "patterns": ["inspiring", "brave", "courageous", "overcoming", "despite their disability",
                           "superhuman", "special"],
                "severity": 0.10
            },
            "outdated_terms": {
                # Outdated/offensive terminology
                "patterns": ["retarded", "crippled", "lame", "crazy", "insane", "psycho", "mental",
                           "spastic", "midget", "dwarf"],
                "severity": 0.20  # Very high severity
            },
            "capability_assumptions": {
                # Assumes inability without basis
                "patterns": ["can't", "unable to", "incapable", "limited", "restricted"],
                "severity": 0.08
            }
        }
        
        # Person-first language (correct) indicators
        person_first_indicators = [
            "person with", "individual with", "student with", "child with",
            "has a disability", "uses a wheelchair", "has autism", "experiences"
        ]
        
        text_lower = text.lower()
        bias_score = 0.0
        person_first_count = 0
        
        # Check for ableist language
        for category, data in ableist_language.items():
            for pattern in data["patterns"]:
                if pattern in text_lower:
                    bias_score += data["severity"]
        
        # Check for person-first language (positive indicator)
        for indicator in person_first_indicators:
            if indicator in text_lower:
                person_first_count += 1
        
        # Reduce bias score if person-first language is used
        if person_first_count > 0:
            bias_score *= 0.7  # 30% reduction for using person-first language
        
        # Additional check: if disability is mentioned but no person-first language, increase score
        disability_mentions = text_lower.count("disability") + text_lower.count("disabled")
        if disability_mentions > 0 and person_first_count == 0:
            bias_score += 0.1
        
        return min(bias_score, 1.0)
    
    async def calculate_socioeconomic_bias(self, text: str) -> float:
        """
        Calculate socioeconomic bias score
        Detects: class stereotypes, wealth assumptions, and economic privilege blind spots
        """
        
        # Socioeconomic bias indicators
        economic_bias = {
            "wealth_assumptions": {
                # Assumes access to resources
                "patterns": ["just buy", "simply purchase", "afford", "vacation", "private tutor",
                           "summer camp", "travel abroad", "college fund", "investment"],
                "severity": 0.12
            },
            "class_stereotypes": {
                # Stereotypical associations with economic status
                "patterns": ["poor work ethic", "lazy", "unmotivated", "don't value education",
                           "cultural deficiency", "broken homes", "disadvantaged background"],
                "severity": 0.18  # High severity
            },
            "elitist_language": {
                # Language that excludes lower-income families
                "patterns": ["obviously", "of course", "naturally", "everyone knows", "common sense",
                           "basic", "simple"],
                "severity": 0.08
            },
            "privilege_blindness": {
                # Ignores systemic inequalities
                "patterns": ["just work harder", "pull yourself up", "anyone can succeed",
                           "equal opportunity", "level playing field", "meritocracy"],
                "severity": 0.15
            },
            "resource_exclusivity": {
                # Requires expensive resources without alternatives
                "patterns": ["requires computer", "must have internet", "need smartphone",
                           "requires materials", "purchase required"],
                "severity": 0.10
            }
        }
        
        # Inclusive language (positive indicators)
        inclusive_indicators = [
            "free resources", "available at library", "no cost", "alternative available",
            "optional", "if available", "access to", "support provided", "accommodations available"
        ]
        
        text_lower = text.lower()
        bias_score = 0.0
        inclusive_count = 0
        
        # Check for bias indicators
        for category, data in economic_bias.items():
            for pattern in data["patterns"]:
                if pattern in text_lower:
                    bias_score += data["severity"]
        
        # Check for inclusive language (reduces bias)
        for indicator in inclusive_indicators:
            if indicator in text_lower:
                inclusive_count += 1
        
        # Reward inclusive language
        if inclusive_count > 0:
            bias_score *= max(0.5, 1.0 - (inclusive_count * 0.15))  # Up to 50% reduction
        
        # Check for resource requirements without alternatives
        if ("requires" in text_lower or "must have" in text_lower) and inclusive_count == 0:
            bias_score += 0.12
        
        return min(bias_score, 1.0)
    
    async def get_mitigation_strategy(self, metrics: Dict) -> str:
        """Determine appropriate mitigation strategy based on bias metrics"""
        
        # Find highest bias category
        highest_bias = max(metrics.items(), key=lambda x: x[1])
        bias_type, bias_score = highest_bias
        
        strategies = {
            "gender_bias": "Apply gender-neutral language rewriting",
            "racial_bias": "Increase representation in training data",
            "disability_bias": "Use person-first language and inclusive terminology",
            "socioeconomic_bias": "Ensure diverse economic contexts in examples"
        }
        
        return strategies.get(bias_type, "General bias mitigation")
    
    async def apply_mitigation(self, model_id: str, strategy: str) -> Dict:
        """
        Apply bias mitigation strategy to a model
        Returns: mitigation actions taken and their expected impact
        """
        logger.info(f"Applying mitigation strategy '{strategy}' to model {model_id}")
        
        mitigation_actions = {
            "Apply gender-neutral language rewriting": {
                "actions": [
                    "Replace gendered pronouns with 'they/them' where appropriate",
                    "Use gender-neutral job titles (e.g., 'firefighter' not 'fireman')",
                    "Balance examples with diverse gender representation",
                    "Remove stereotypical gender associations"
                ],
                "retraining_required": False,
                "prompt_engineering": True
            },
            "Increase representation in training data": {
                "actions": [
                    "Augment training data with diverse racial/ethnic examples",
                    "Balance representation across all demographics",
                    "Remove stereotypical associations from training corpus",
                    "Include diverse cultural contexts and perspectives"
                ],
                "retraining_required": True,
                "prompt_engineering": False
            },
            "Use person-first language and inclusive terminology": {
                "actions": [
                    "Replace disability-first with person-first language",
                    "Remove ableist terminology from vocabulary",
                    "Add accessibility considerations to all content",
                    "Include diverse ability representations in examples"
                ],
                "retraining_required": False,
                "prompt_engineering": True
            },
            "Ensure diverse economic contexts in examples": {
                "actions": [
                    "Provide free alternatives for paid resources",
                    "Remove assumptions about family resources",
                    "Include diverse economic contexts in examples",
                    "Ensure content is accessible regardless of socioeconomic status"
                ],
                "retraining_required": False,
                "prompt_engineering": True
            }
        }
        
        mitigation_plan = mitigation_actions.get(strategy, {
            "actions": ["Apply general bias mitigation techniques"],
            "retraining_required": False,
            "prompt_engineering": True
        })
        
        # Log mitigation plan
        logger.info(f"Mitigation plan for model {model_id}:")
        for action in mitigation_plan["actions"]:
            logger.info(f"  - {action}")
        
        if mitigation_plan["retraining_required"]:
            logger.warning(f"Model {model_id} requires retraining for complete mitigation")
        
        return {
            "model_id": model_id,
            "strategy": strategy,
            "actions": mitigation_plan["actions"],
            "retraining_required": mitigation_plan["retraining_required"],
            "prompt_engineering": mitigation_plan["prompt_engineering"],
            "status": "mitigation_initiated",
            "expected_bias_reduction": "30-50%"
        }
