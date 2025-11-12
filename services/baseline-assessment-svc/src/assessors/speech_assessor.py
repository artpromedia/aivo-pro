"""
Speech & Language Assessment Module
Comprehensive evaluation of speech and language development
Evidence-based approach following ASHA guidelines
"""
import logging
from typing import Dict, List
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import httpx

logger = logging.getLogger(__name__)


class ArticulationLevel(str, Enum):
    """Articulation assessment levels"""
    SEVERE = "severe"  # <70% intelligibility
    MODERATE = "moderate"  # 70-85% intelligibility
    MILD = "mild"  # 85-95% intelligibility
    AGE_APPROPRIATE = "age_appropriate"  # >95% intelligibility


class LanguageLevel(str, Enum):
    """Language development levels"""
    SIGNIFICANTLY_DELAYED = "significantly_delayed"  # >2 years below
    DELAYED = "delayed"  # 1-2 years below
    EMERGING = "emerging"  # 6-12 months below
    AGE_APPROPRIATE = "age_appropriate"  # Within normal range
    ADVANCED = "advanced"  # Above age level


class FluencyLevel(str, Enum):
    """Fluency assessment levels"""
    SEVERE_DISFLUENCY = "severe_disfluency"
    MODERATE_DISFLUENCY = "moderate_disfluency"
    MILD_DISFLUENCY = "mild_disfluency"
    AGE_APPROPRIATE = "age_appropriate"


@dataclass
class ArticulationAssessment:
    """Articulation and phonology assessment results"""
    intelligibility_percent: float
    error_sounds: List[str]
    substitutions: Dict[str, str]  # target -> produced
    omissions: List[str]
    distortions: List[str]
    phonological_processes: List[str]
    level: ArticulationLevel
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class LanguageAssessment:
    """Language development assessment"""
    # Expressive Language
    expressive_vocabulary_age: float
    mean_length_utterance: float
    sentence_complexity: str  # simple, compound, complex
    grammar_accuracy: float
    
    # Receptive Language
    receptive_vocabulary_age: float
    following_directions: str  # 1-step, 2-step, 3-step, multi-step
    comprehension_level: str  # literal, inferential, critical
    
    # Overall
    expressive_level: LanguageLevel
    receptive_level: LanguageLevel
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class FluencyAssessment:
    """Fluency and rhythm assessment"""
    words_per_minute: int
    disfluencies_per_100_words: float
    repetitions: int
    prolongations: int
    blocks: int
    secondary_behaviors: List[str]
    level: FluencyLevel
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class VoiceAssessment:
    """Voice quality assessment"""
    pitch_appropriate: bool
    volume_appropriate: bool
    quality_concerns: List[str]  # hoarseness, breathiness, etc.
    resonance_appropriate: bool
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class PragmaticsAssessment:
    """Social communication/pragmatics assessment"""
    turn_taking: str  # poor, emerging, adequate, strong
    topic_maintenance: str
    conversational_repair: str
    nonverbal_communication: str
    perspective_taking: str
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class OralMotorAssessment:
    """Oral motor structure and function"""
    structure_normal: bool
    structure_concerns: List[str]
    function_adequate: bool
    function_concerns: List[str]
    feeding_concerns: List[str]
    age_appropriate: bool
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ComprehensiveSpeechAssessment:
    """Complete speech and language evaluation"""
    child_id: str
    assessment_date: datetime
    chronological_age: float  # Years
    grade_level: str
    
    # Assessment domains
    articulation: ArticulationAssessment
    language: LanguageAssessment
    fluency: FluencyAssessment
    voice: VoiceAssessment
    pragmatics: PragmaticsAssessment
    oral_motor: OralMotorAssessment
    
    # Summary
    overall_severity: str  # mild, moderate, severe
    therapy_recommended: bool
    priority_areas: List[str]
    estimated_therapy_duration: str  # weeks/months
    recommendations: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "child_id": self.child_id,
            "assessment_date": self.assessment_date.isoformat(),
            "chronological_age": self.chronological_age,
            "grade_level": self.grade_level,
            "articulation": {
                "intelligibility_percent": self.articulation.intelligibility_percent,
                "error_sounds": self.articulation.error_sounds,
                "substitutions": self.articulation.substitutions,
                "omissions": self.articulation.omissions,
                "distortions": self.articulation.distortions,
                "phonological_processes": self.articulation.phonological_processes,
                "level": self.articulation.level.value,
                "age_appropriate": self.articulation.age_appropriate,
                "recommendations": self.articulation.recommendations
            },
            "language": {
                "expressive_vocabulary_age": self.language.expressive_vocabulary_age,
                "mean_length_utterance": self.language.mean_length_utterance,
                "sentence_complexity": self.language.sentence_complexity,
                "grammar_accuracy": self.language.grammar_accuracy,
                "receptive_vocabulary_age": self.language.receptive_vocabulary_age,
                "following_directions": self.language.following_directions,
                "comprehension_level": self.language.comprehension_level,
                "expressive_level": self.language.expressive_level.value,
                "receptive_level": self.language.receptive_level.value,
                "age_appropriate": self.language.age_appropriate,
                "recommendations": self.language.recommendations
            },
            "fluency": {
                "words_per_minute": self.fluency.words_per_minute,
                "disfluencies_per_100_words": self.fluency.disfluencies_per_100_words,
                "repetitions": self.fluency.repetitions,
                "prolongations": self.fluency.prolongations,
                "blocks": self.fluency.blocks,
                "secondary_behaviors": self.fluency.secondary_behaviors,
                "level": self.fluency.level.value,
                "age_appropriate": self.fluency.age_appropriate,
                "recommendations": self.fluency.recommendations
            },
            "voice": {
                "pitch_appropriate": self.voice.pitch_appropriate,
                "volume_appropriate": self.voice.volume_appropriate,
                "quality_concerns": self.voice.quality_concerns,
                "resonance_appropriate": self.voice.resonance_appropriate,
                "age_appropriate": self.voice.age_appropriate,
                "recommendations": self.voice.recommendations
            },
            "pragmatics": {
                "turn_taking": self.pragmatics.turn_taking,
                "topic_maintenance": self.pragmatics.topic_maintenance,
                "conversational_repair": self.pragmatics.conversational_repair,
                "nonverbal_communication": self.pragmatics.nonverbal_communication,
                "perspective_taking": self.pragmatics.perspective_taking,
                "age_appropriate": self.pragmatics.age_appropriate,
                "recommendations": self.pragmatics.recommendations
            },
            "oral_motor": {
                "structure_normal": self.oral_motor.structure_normal,
                "structure_concerns": self.oral_motor.structure_concerns,
                "function_adequate": self.oral_motor.function_adequate,
                "function_concerns": self.oral_motor.function_concerns,
                "feeding_concerns": self.oral_motor.feeding_concerns,
                "age_appropriate": self.oral_motor.age_appropriate,
                "recommendations": self.oral_motor.recommendations
            },
            "summary": {
                "overall_severity": self.overall_severity,
                "therapy_recommended": self.therapy_recommended,
                "priority_areas": self.priority_areas,
                "estimated_therapy_duration": self.estimated_therapy_duration,
                "recommendations": self.recommendations
            }
        }


class SpeechLanguageAssessor:
    """
    Comprehensive Speech and Language Assessor
    
    Conducts multi-domain speech/language evaluation following ASHA guidelines:
    - Articulation and Phonology
    - Expressive and Receptive Language
    - Fluency
    - Voice
    - Pragmatics (Social Communication)
    - Oral Motor Function
    """
    
    def __init__(self, speech_therapy_api_url: str = "http://speech-therapy-svc:8014"):
        self.speech_therapy_api_url = speech_therapy_api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def conduct_comprehensive_assessment(
        self,
        child_id: str,
        age: float,
        grade: str,
        assessment_data: Dict
    ) -> ComprehensiveSpeechAssessment:
        """
        Conduct comprehensive speech and language assessment
        
        Args:
            child_id: Child's unique identifier
            age: Chronological age in years
            grade: Grade level (K, 1-12)
            assessment_data: Dict with assessment responses and recordings
        
        Returns:
            ComprehensiveSpeechAssessment with all domain results
        """
        logger.info(f"Starting comprehensive speech assessment for child {child_id}")
        
        # Conduct domain-specific assessments
        articulation = await self._assess_articulation(child_id, age, assessment_data)
        language = await self._assess_language(child_id, age, assessment_data)
        fluency = await self._assess_fluency(child_id, age, assessment_data)
        voice = await self._assess_voice(child_id, age, assessment_data)
        pragmatics = await self._assess_pragmatics(child_id, age, assessment_data)
        oral_motor = await self._assess_oral_motor(child_id, age, assessment_data)
        
        # Determine overall severity and recommendations
        overall_severity = self._determine_overall_severity(
            articulation, language, fluency, voice, pragmatics, oral_motor
        )
        
        therapy_recommended = not all([
            articulation.age_appropriate,
            language.age_appropriate,
            fluency.age_appropriate,
            voice.age_appropriate,
            pragmatics.age_appropriate,
            oral_motor.age_appropriate
        ])
        
        priority_areas = self._identify_priority_areas(
            articulation, language, fluency, voice, pragmatics, oral_motor
        )
        
        duration = self._estimate_therapy_duration(overall_severity, priority_areas)
        
        recommendations = self._generate_overall_recommendations(
            articulation, language, fluency, voice, pragmatics, oral_motor,
            overall_severity, priority_areas
        )
        
        return ComprehensiveSpeechAssessment(
            child_id=child_id,
            assessment_date=datetime.now(),
            chronological_age=age,
            grade_level=grade,
            articulation=articulation,
            language=language,
            fluency=fluency,
            voice=voice,
            pragmatics=pragmatics,
            oral_motor=oral_motor,
            overall_severity=overall_severity,
            therapy_recommended=therapy_recommended,
            priority_areas=priority_areas,
            estimated_therapy_duration=duration,
            recommendations=recommendations
        )
    
    async def _assess_articulation(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> ArticulationAssessment:
        """Assess articulation and phonology"""
        
        # Extract articulation data from assessment
        artic_data = assessment_data.get("articulation", {})
        
        # Analyze speech sample if provided
        speech_sample = artic_data.get("speech_sample")
        if speech_sample:
            try:
                # Call speech therapy service for detailed analysis
                response = await self.client.post(
                    f"{self.speech_therapy_api_url}/v1/speech/analyze",
                    json={
                        "child_id": child_id,
                        "audio_data": speech_sample,
                        "age": age
                    }
                )
                analysis = response.json() if response.status_code == 200 else {}
            except Exception as e:
                logger.warning(f"Could not analyze speech sample: {e}")
                analysis = {}
        else:
            analysis = {}
        
        # Determine intelligibility
        intelligibility = analysis.get("intelligibility", artic_data.get("intelligibility", 95.0))
        
        # Identify errors
        error_sounds = artic_data.get("error_sounds", analysis.get("error_sounds", []))
        substitutions = artic_data.get("substitutions", analysis.get("substitutions", {}))
        omissions = artic_data.get("omissions", analysis.get("omissions", []))
        distortions = artic_data.get("distortions", analysis.get("distortions", []))
        phonological_processes = analysis.get("phonological_processes", [])
        
        # Determine level
        if intelligibility >= 95:
            level = ArticulationLevel.AGE_APPROPRIATE
        elif intelligibility >= 85:
            level = ArticulationLevel.MILD
        elif intelligibility >= 70:
            level = ArticulationLevel.MODERATE
        else:
            level = ArticulationLevel.SEVERE
        
        age_appropriate = level == ArticulationLevel.AGE_APPROPRIATE
        
        # Generate recommendations
        recommendations = []
        if not age_appropriate:
            if error_sounds:
                recommendations.append(
                    f"Target error sounds: {', '.join(error_sounds[:5])}"
                )
            if phonological_processes:
                recommendations.append(
                    f"Address phonological processes: {', '.join(phonological_processes[:3])}"
                )
            recommendations.append(
                "Weekly articulation therapy recommended (30-45 minutes)"
            )
        
        return ArticulationAssessment(
            intelligibility_percent=intelligibility,
            error_sounds=error_sounds,
            substitutions=substitutions,
            omissions=omissions,
            distortions=distortions,
            phonological_processes=phonological_processes,
            level=level,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    async def _assess_language(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> LanguageAssessment:
        """Assess expressive and receptive language"""
        
        lang_data = assessment_data.get("language", {})
        
        # Expressive language metrics
        exp_vocab_age = lang_data.get("expressive_vocabulary_age", age)
        mlu = lang_data.get("mean_length_utterance", self._expected_mlu(age))
        sentence_complexity = lang_data.get("sentence_complexity", "compound")
        grammar_accuracy = lang_data.get("grammar_accuracy", 90.0)
        
        # Receptive language metrics
        rec_vocab_age = lang_data.get("receptive_vocabulary_age", age)
        following_directions = lang_data.get("following_directions", "2-step")
        comprehension = lang_data.get("comprehension_level", "literal")
        
        # Determine levels
        exp_level = self._determine_language_level(exp_vocab_age, age)
        rec_level = self._determine_language_level(rec_vocab_age, age)
        
        age_appropriate = (
            exp_level in [LanguageLevel.AGE_APPROPRIATE, LanguageLevel.ADVANCED] and
            rec_level in [LanguageLevel.AGE_APPROPRIATE, LanguageLevel.ADVANCED]
        )
        
        # Recommendations
        recommendations = []
        if exp_level == LanguageLevel.SIGNIFICANTLY_DELAYED:
            recommendations.append(
                "Intensive expressive language therapy (2-3x weekly)"
            )
        elif exp_level == LanguageLevel.DELAYED:
            recommendations.append(
                "Weekly expressive language therapy with home practice"
            )
        
        if rec_level == LanguageLevel.SIGNIFICANTLY_DELAYED:
            recommendations.append(
                "Receptive language intervention with visual supports"
            )
        elif rec_level == LanguageLevel.DELAYED:
            recommendations.append(
                "Receptive language activities in daily routine"
            )
        
        if grammar_accuracy < 80:
            recommendations.append("Focus on grammatical morphemes and syntax")
        
        return LanguageAssessment(
            expressive_vocabulary_age=exp_vocab_age,
            mean_length_utterance=mlu,
            sentence_complexity=sentence_complexity,
            grammar_accuracy=grammar_accuracy,
            receptive_vocabulary_age=rec_vocab_age,
            following_directions=following_directions,
            comprehension_level=comprehension,
            expressive_level=exp_level,
            receptive_level=rec_level,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    async def _assess_fluency(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> FluencyAssessment:
        """Assess fluency and rhythm of speech"""
        
        fluency_data = assessment_data.get("fluency", {})
        
        wpm = fluency_data.get("words_per_minute", self._expected_wpm(age))
        disfluencies = fluency_data.get("disfluencies_per_100", 2.0)
        repetitions = fluency_data.get("repetitions", 0)
        prolongations = fluency_data.get("prolongations", 0)
        blocks = fluency_data.get("blocks", 0)
        secondary_behaviors = fluency_data.get("secondary_behaviors", [])
        
        # Determine level (typical is <3 disfluencies per 100 words)
        if disfluencies < 3 and not secondary_behaviors:
            level = FluencyLevel.AGE_APPROPRIATE
        elif disfluencies < 5 and len(secondary_behaviors) < 2:
            level = FluencyLevel.MILD_DISFLUENCY
        elif disfluencies < 10 or len(secondary_behaviors) < 3:
            level = FluencyLevel.MODERATE_DISFLUENCY
        else:
            level = FluencyLevel.SEVERE_DISFLUENCY
        
        age_appropriate = level == FluencyLevel.AGE_APPROPRIATE
        
        recommendations = []
        if level == FluencyLevel.SEVERE_DISFLUENCY:
            recommendations.append(
                "Intensive fluency therapy (Lidcombe Program or similar)"
            )
            recommendations.append("Parent training in fluency techniques")
        elif level == FluencyLevel.MODERATE_DISFLUENCY:
            recommendations.append("Weekly fluency therapy")
            recommendations.append("Classroom accommodations (extra time, reduced pressure)")
        elif level == FluencyLevel.MILD_DISFLUENCY:
            recommendations.append("Monitor and provide indirect strategies")
        
        return FluencyAssessment(
            words_per_minute=wpm,
            disfluencies_per_100_words=disfluencies,
            repetitions=repetitions,
            prolongations=prolongations,
            blocks=blocks,
            secondary_behaviors=secondary_behaviors,
            level=level,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    async def _assess_voice(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> VoiceAssessment:
        """Assess voice quality and characteristics"""
        
        voice_data = assessment_data.get("voice", {})
        
        pitch_appropriate = voice_data.get("pitch_appropriate", True)
        volume_appropriate = voice_data.get("volume_appropriate", True)
        quality_concerns = voice_data.get("quality_concerns", [])
        resonance_appropriate = voice_data.get("resonance_appropriate", True)
        
        age_appropriate = (
            pitch_appropriate and
            volume_appropriate and
            not quality_concerns and
            resonance_appropriate
        )
        
        recommendations = []
        if quality_concerns:
            recommendations.append("ENT referral for voice concerns")
            recommendations.append("Voice therapy focusing on vocal hygiene")
        if not volume_appropriate:
            recommendations.append("Volume regulation strategies")
        
        return VoiceAssessment(
            pitch_appropriate=pitch_appropriate,
            volume_appropriate=volume_appropriate,
            quality_concerns=quality_concerns,
            resonance_appropriate=resonance_appropriate,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    async def _assess_pragmatics(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> PragmaticsAssessment:
        """Assess social communication/pragmatics"""
        
        prag_data = assessment_data.get("pragmatics", {})
        
        turn_taking = prag_data.get("turn_taking", "adequate")
        topic_maintenance = prag_data.get("topic_maintenance", "adequate")
        conversational_repair = prag_data.get("conversational_repair", "adequate")
        nonverbal = prag_data.get("nonverbal_communication", "adequate")
        perspective = prag_data.get("perspective_taking", "adequate")
        
        age_appropriate = all(
            skill in ["adequate", "strong"]
            for skill in [turn_taking, topic_maintenance, conversational_repair,
                         nonverbal, perspective]
        )
        
        recommendations = []
        if not age_appropriate:
            if turn_taking == "poor":
                recommendations.append("Social skills groups for turn-taking practice")
            if perspective == "poor":
                recommendations.append("Theory of mind activities and perspective-taking exercises")
            recommendations.append("Pragmatic language intervention")
        
        return PragmaticsAssessment(
            turn_taking=turn_taking,
            topic_maintenance=topic_maintenance,
            conversational_repair=conversational_repair,
            nonverbal_communication=nonverbal,
            perspective_taking=perspective,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    async def _assess_oral_motor(
        self,
        child_id: str,
        age: float,
        assessment_data: Dict
    ) -> OralMotorAssessment:
        """Assess oral motor structure and function"""
        
        oral_data = assessment_data.get("oral_motor", {})
        
        structure_normal = oral_data.get("structure_normal", True)
        structure_concerns = oral_data.get("structure_concerns", [])
        function_adequate = oral_data.get("function_adequate", True)
        function_concerns = oral_data.get("function_concerns", [])
        feeding_concerns = oral_data.get("feeding_concerns", [])
        
        age_appropriate = (
            structure_normal and
            function_adequate and
            not feeding_concerns
        )
        
        recommendations = []
        if structure_concerns:
            recommendations.append(f"Medical evaluation for: {', '.join(structure_concerns)}")
        if feeding_concerns:
            recommendations.append("Feeding therapy/OT consultation")
        if function_concerns and not structure_concerns:
            recommendations.append("Oral motor exercises and therapy")
        
        return OralMotorAssessment(
            structure_normal=structure_normal,
            structure_concerns=structure_concerns,
            function_adequate=function_adequate,
            function_concerns=function_concerns,
            feeding_concerns=feeding_concerns,
            age_appropriate=age_appropriate,
            recommendations=recommendations
        )
    
    def _determine_overall_severity(
        self,
        articulation: ArticulationAssessment,
        language: LanguageAssessment,
        fluency: FluencyAssessment,
        voice: VoiceAssessment,
        pragmatics: PragmaticsAssessment,
        oral_motor: OralMotorAssessment
    ) -> str:
        """Determine overall severity level"""
        
        severity_scores = []
        
        # Articulation
        if articulation.level == ArticulationLevel.SEVERE:
            severity_scores.append(3)
        elif articulation.level == ArticulationLevel.MODERATE:
            severity_scores.append(2)
        elif articulation.level == ArticulationLevel.MILD:
            severity_scores.append(1)
        else:
            severity_scores.append(0)
        
        # Language
        if language.expressive_level == LanguageLevel.SIGNIFICANTLY_DELAYED:
            severity_scores.append(3)
        elif language.expressive_level == LanguageLevel.DELAYED:
            severity_scores.append(2)
        elif language.expressive_level == LanguageLevel.EMERGING:
            severity_scores.append(1)
        
        # Fluency
        if fluency.level == FluencyLevel.SEVERE_DISFLUENCY:
            severity_scores.append(3)
        elif fluency.level == FluencyLevel.MODERATE_DISFLUENCY:
            severity_scores.append(2)
        elif fluency.level == FluencyLevel.MILD_DISFLUENCY:
            severity_scores.append(1)
        
        # Voice, pragmatics, oral motor (binary)
        if not voice.age_appropriate:
            severity_scores.append(2)
        if not pragmatics.age_appropriate:
            severity_scores.append(2)
        if not oral_motor.age_appropriate:
            severity_scores.append(2)
        
        if not severity_scores:
            return "none"
        
        avg_severity = sum(severity_scores) / len(severity_scores)
        
        if avg_severity >= 2.5:
            return "severe"
        elif avg_severity >= 1.5:
            return "moderate"
        elif avg_severity >= 0.5:
            return "mild"
        else:
            return "minimal"
    
    def _identify_priority_areas(
        self,
        articulation: ArticulationAssessment,
        language: LanguageAssessment,
        fluency: FluencyAssessment,
        voice: VoiceAssessment,
        pragmatics: PragmaticsAssessment,
        oral_motor: OralMotorAssessment
    ) -> List[str]:
        """Identify priority treatment areas"""
        
        priorities = []
        
        if not articulation.age_appropriate:
            priorities.append("articulation")
        if not language.age_appropriate:
            priorities.append("language")
        if not fluency.age_appropriate:
            priorities.append("fluency")
        if not voice.age_appropriate:
            priorities.append("voice")
        if not pragmatics.age_appropriate:
            priorities.append("pragmatics")
        if not oral_motor.age_appropriate:
            priorities.append("oral_motor")
        
        return priorities
    
    def _estimate_therapy_duration(
        self,
        overall_severity: str,
        priority_areas: List[str]
    ) -> str:
        """Estimate therapy duration"""
        
        if overall_severity == "severe":
            return "12-24 months"
        elif overall_severity == "moderate":
            return "6-12 months"
        elif overall_severity == "mild":
            return "3-6 months"
        else:
            return "monitoring only"
    
    def _generate_overall_recommendations(
        self,
        articulation: ArticulationAssessment,
        language: LanguageAssessment,
        fluency: FluencyAssessment,
        voice: VoiceAssessment,
        pragmatics: PragmaticsAssessment,
        oral_motor: OralMotorAssessment,
        overall_severity: str,
        priority_areas: List[str]
    ) -> List[str]:
        """Generate overall recommendations"""
        
        recommendations = []
        
        if overall_severity == "severe":
            recommendations.append(
                "Recommend comprehensive speech-language evaluation by SLP"
            )
            recommendations.append(
                "Weekly individual therapy sessions (2-3x per week)"
            )
        elif overall_severity == "moderate":
            recommendations.append(
                "Speech-language therapy recommended (1-2x per week)"
            )
        elif overall_severity == "mild":
            recommendations.append(
                "Speech-language therapy or monitoring recommended"
            )
        
        if priority_areas:
            recommendations.append(
                f"Priority treatment areas: {', '.join(priority_areas)}"
            )
        
        # Add specific recommendations from each domain
        all_recs = (
            articulation.recommendations +
            language.recommendations +
            fluency.recommendations +
            voice.recommendations +
            pragmatics.recommendations +
            oral_motor.recommendations
        )
        
        # Get unique recommendations
        unique_recs = []
        for rec in all_recs:
            if rec not in unique_recs and rec not in recommendations:
                unique_recs.append(rec)
        
        recommendations.extend(unique_recs[:5])  # Top 5 specific recs
        
        return recommendations
    
    def _expected_mlu(self, age: float) -> float:
        """Expected Mean Length of Utterance by age"""
        # Brown's stages: MLU = age - 0.5 (approximate)
        return max(1.0, age - 0.5)
    
    def _expected_wpm(self, age: float) -> int:
        """Expected words per minute by age"""
        if age < 6:
            return 100
        elif age < 10:
            return 120
        elif age < 14:
            return 140
        else:
            return 150
    
    def _determine_language_level(self, language_age: float, chronological_age: float) -> LanguageLevel:
        """Determine language level based on age comparison"""
        difference = chronological_age - language_age
        
        if difference >= 2.0:
            return LanguageLevel.SIGNIFICANTLY_DELAYED
        elif difference >= 1.0:
            return LanguageLevel.DELAYED
        elif difference >= 0.5:
            return LanguageLevel.EMERGING
        elif difference <= -0.5:
            return LanguageLevel.ADVANCED
        else:
            return LanguageLevel.AGE_APPROPRIATE
