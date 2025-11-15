"""
Test suite for bias detection algorithms
Validates all four bias detection methods and mitigation strategies
"""

import pytest
from src.bias_detection import BiasDetector


class TestBiasDetection:
    """Test bias detection across gender, racial, disability, and socioeconomic dimensions"""

    @pytest.fixture
    def detector(self):
        """Create bias detector instance"""
        return BiasDetector()

    # Gender Bias Tests
    def test_gender_bias_balanced_pronouns(self, detector):
        """Test content with balanced gender pronouns"""
        content = "The doctor examined his patient. The nurse checked her equipment."
        training_data = [
            {"text": content, "label": "neutral"}
        ]

        result = detector.calculate_gender_bias(training_data)

        assert result["bias_score"] <= 0.3  # Should be low bias
        assert "balanced" in result["details"]["representation"].lower()

    def test_gender_bias_stereotypical_roles(self, detector):
        """Test detection of gender stereotypes"""
        content = "The secretary answered the phone while her boss was in a meeting."
        training_data = [
            {"text": content, "label": "stereotypical"}
        ]

        result = detector.calculate_gender_bias(training_data)

        assert result["bias_score"] > 0.5  # Should detect bias
        assert len(result["examples"]) > 0

    def test_gender_bias_neutral_language(self, detector):
        """Test content with gender-neutral language"""
        content = "The engineer solved the problem. The teacher explained the concept."
        training_data = [
            {"text": content, "label": "neutral"}
        ]

        result = detector.calculate_gender_bias(training_data)

        assert result["bias_score"] <= 0.2  # Very low bias
        assert result["severity"] == "low"

    # Racial Bias Tests
    def test_racial_bias_coded_language(self, detector):
        """Test detection of racially coded language"""
        content = "The urban youth exhibited threatening behavior."
        training_data = [
            {"text": content, "label": "problematic"}
        ]

        result = detector.calculate_racial_bias(training_data)

        assert result["bias_score"] > 0.6
        assert "coded_language" in result["details"]

    def test_racial_bias_diverse_representation(self, detector):
        """Test content with diverse representation"""
        content = """
        Students from various backgrounds contributed unique perspectives.
        The class included Asian, African, European, and Latin American cultures.
        """
        training_data = [
            {"text": content, "label": "inclusive"}
        ]

        result = detector.calculate_racial_bias(training_data)

        assert result["bias_score"] <= 0.3
        assert result["severity"] == "low"

    # Disability Bias Tests
    def test_disability_bias_person_first_language(self, detector):
        """Test detection of person-first language violations"""
        content = "The autistic child struggled with the assignment."
        training_data = [
            {"text": content, "label": "identity_first"}
        ]

        result = detector.calculate_disability_bias(training_data)

        assert result["bias_score"] > 0.4
        assert "person_first" in result["details"]

    def test_disability_bias_ableist_language(self, detector):
        """Test detection of ableist language"""
        content = "That's a crazy idea. Don't be so lame."
        training_data = [
            {"text": content, "label": "ableist"}
        ]

        result = detector.calculate_disability_bias(training_data)

        assert result["bias_score"] > 0.7  # High bias
        assert result["severity"] == "high"

    def test_disability_bias_inclusive_language(self, detector):
        """Test inclusive disability language"""
        content = "The student who uses a wheelchair excelled in the science fair."
        training_data = [
            {"text": content, "label": "inclusive"}
        ]

        result = detector.calculate_disability_bias(training_data)

        assert result["bias_score"] <= 0.2
        assert result["severity"] == "low"

    # Socioeconomic Bias Tests
    def test_socioeconomic_bias_wealth_assumptions(self, detector):
        """Test detection of wealth assumptions"""
        content = "For homework, research vacation homes and discuss your family's yacht."
        training_data = [
            {"text": content, "label": "privileged"}
        ]

        result = detector.calculate_socioeconomic_bias(training_data)

        assert result["bias_score"] > 0.8  # Very high bias
        assert "wealth_assumptions" in result["details"]

    def test_socioeconomic_bias_class_neutral(self, detector):
        """Test class-neutral content"""
        content = "Students will work in groups to solve math problems using classroom materials."
        training_data = [
            {"text": content, "label": "neutral"}
        ]

        result = detector.calculate_socioeconomic_bias(training_data)

        assert result["bias_score"] <= 0.2
        assert result["severity"] == "low"

    # Mitigation Tests
    def test_mitigation_recommendations(self, detector):
        """Test that mitigation provides actionable recommendations"""
        bias_results = {
            "gender": {"bias_score": 0.7, "severity": "high"},
            "racial": {"bias_score": 0.5, "severity": "medium"},
            "disability": {"bias_score": 0.3, "severity": "low"},
            "socioeconomic": {"bias_score": 0.6, "severity": "medium"}
        }

        mitigation = detector.apply_mitigation(bias_results)

        assert "actions" in mitigation
        assert len(mitigation["actions"]) > 0
        assert "expected_impact" in mitigation
        assert mitigation["requires_retraining"] is True

    def test_mitigation_low_bias(self, detector):
        """Test mitigation for low bias content"""
        bias_results = {
            "gender": {"bias_score": 0.1, "severity": "low"},
            "racial": {"bias_score": 0.1, "severity": "low"},
            "disability": {"bias_score": 0.1, "severity": "low"},
            "socioeconomic": {"bias_score": 0.1, "severity": "low"}
        }

        mitigation = detector.apply_mitigation(bias_results)

        assert mitigation["requires_retraining"] is False
        assert len(mitigation["actions"]) >= 1  # Should still have monitoring


@pytest.mark.integration
class TestBiasDetectionIntegration:
    """Integration tests for complete bias detection pipeline"""

    def test_full_bias_analysis_pipeline(self):
        """Test complete bias detection workflow"""
        detector = BiasDetector()

        # Sample training data with various bias levels
        training_data = [
            {"text": "The engineer, who is a woman, designed the bridge.", "label": "inclusive"},
            {"text": "The doctor examined his patient carefully.", "label": "gendered"},
            {"text": "Students from diverse backgrounds collaborated.", "label": "inclusive"}
        ]

        # Run all bias checks
        gender_bias = detector.calculate_gender_bias(training_data)
        racial_bias = detector.calculate_racial_bias(training_data)
        disability_bias = detector.calculate_disability_bias(training_data)
        socioeconomic_bias = detector.calculate_socioeconomic_bias(training_data)

        # Aggregate results
        bias_results = {
            "gender": gender_bias,
            "racial": racial_bias,
            "disability": disability_bias,
            "socioeconomic": socioeconomic_bias
        }

        # Apply mitigation
        mitigation = detector.apply_mitigation(bias_results)

        # Verify complete analysis
        assert all(isinstance(v, dict) for v in bias_results.values())
        assert "actions" in mitigation
        assert "expected_impact" in mitigation
        assert isinstance(mitigation["requires_retraining"], bool)
