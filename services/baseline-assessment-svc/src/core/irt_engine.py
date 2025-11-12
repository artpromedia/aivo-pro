"""
Item Response Theory (IRT) Engine
Implements 2PL and 3PL models for adaptive testing
"""
import numpy as np
from typing import Tuple, Dict, List
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class ItemParameters:
    """IRT item parameters"""
    item_id: str
    difficulty: float  # b parameter (-3 to +3)
    discrimination: float  # a parameter (0.5 to 2.5)
    guessing: float = 0.25  # c parameter (0 to 0.5)
    upper_asymptote: float = 1.0  # d parameter (usually 1.0)


@dataclass
class Response:
    """Student response to an item"""
    item_id: str
    correct: bool
    response_time_ms: int
    theta_before: float
    theta_after: float = 0.0


class IRTEngine:
    """Core IRT calculations for adaptive testing"""
    
    def __init__(self):
        self.D = 1.7  # Scaling constant (logistic approximation to normal)
    
    def probability_2pl(
        self,
        theta: float,
        difficulty: float,
        discrimination: float
    ) -> float:
        """
        Calculate probability of correct response using 2PL model
        
        P(θ) = 1 / (1 + e^(-D*a*(θ - b)))
        
        Args:
            theta: Student ability
            difficulty: Item difficulty (b)
            discrimination: Item discrimination (a)
            
        Returns:
            Probability of correct response (0 to 1)
        """
        exponent = -self.D * discrimination * (theta - difficulty)
        probability = 1.0 / (1.0 + np.exp(exponent))
        return float(probability)
    
    def probability_3pl(
        self,
        theta: float,
        difficulty: float,
        discrimination: float,
        guessing: float
    ) -> float:
        """
        Calculate probability of correct response using 3PL model
        
        P(θ) = c + (1 - c) / (1 + e^(-D*a*(θ - b)))
        
        Args:
            theta: Student ability
            difficulty: Item difficulty (b)
            discrimination: Item discrimination (a)
            guessing: Pseudo-guessing parameter (c)
            
        Returns:
            Probability of correct response
        """
        p_2pl = self.probability_2pl(theta, difficulty, discrimination)
        probability = guessing + (1.0 - guessing) * p_2pl
        return float(probability)
    
    def information_2pl(
        self,
        theta: float,
        difficulty: float,
        discrimination: float
    ) -> float:
        """
        Calculate Fisher Information for 2PL model
        
        I(θ) = D² * a² * P(θ) * (1 - P(θ))
        
        Args:
            theta: Student ability
            difficulty: Item difficulty
            discrimination: Item discrimination
            
        Returns:
            Information value (higher = better measurement)
        """
        p = self.probability_2pl(theta, difficulty, discrimination)
        information = (self.D ** 2) * (discrimination ** 2) * p * (1.0 - p)
        return float(information)
    
    def information_3pl(
        self,
        theta: float,
        difficulty: float,
        discrimination: float,
        guessing: float
    ) -> float:
        """
        Calculate Fisher Information for 3PL model
        
        I(θ) = [D²*a²*(1-c)² / (c + e^(D*a*(θ-b)))] * [e^(D*a*(θ-b)) / (1 + e^(D*a*(θ-b)))²]
        
        Args:
            theta: Student ability
            difficulty: Item difficulty
            discrimination: Item discrimination
            guessing: Pseudo-guessing parameter
            
        Returns:
            Information value
        """
        p = self.probability_3pl(theta, difficulty, discrimination, guessing)
        q = 1.0 - p
        
        numerator = (self.D * discrimination * (p - guessing)) ** 2
        denominator = p * q
        
        # Avoid division by zero
        if denominator < 1e-10:
            return 0.0
        
        information = numerator / denominator
        return float(information)
    
    def estimate_ability_mle(
        self,
        responses: List[Response],
        item_params: Dict[str, ItemParameters],
        initial_theta: float = 0.0,
        max_iterations: int = 50,
        tolerance: float = 0.001
    ) -> Tuple[float, float]:
        """
        Estimate ability using Maximum Likelihood Estimation (MLE)
        Uses Newton-Raphson method
        
        Args:
            responses: List of student responses
            item_params: Dictionary mapping item_id to ItemParameters
            initial_theta: Starting ability estimate
            max_iterations: Maximum optimization iterations
            tolerance: Convergence tolerance
            
        Returns:
            Tuple of (theta estimate, standard error)
        """
        theta = initial_theta
        
        for iteration in range(max_iterations):
            # Calculate first derivative (slope)
            first_deriv = 0.0
            # Calculate second derivative (curvature)
            second_deriv = 0.0
            
            for response in responses:
                params = item_params.get(response.item_id)
                if not params:
                    continue
                
                # Calculate probability
                p = self.probability_3pl(
                    theta,
                    params.difficulty,
                    params.discrimination,
                    params.guessing
                )
                q = 1.0 - p
                
                # Weighted response indicator
                if response.correct:
                    weight = (1.0 - p) / (p * (1.0 - params.guessing))
                else:
                    weight = -p / (q * (1.0 - params.guessing))
                
                # First derivative contribution
                first_deriv += (
                    self.D * params.discrimination * (1.0 - params.guessing) * weight
                )
                
                # Second derivative contribution
                info = self.information_3pl(
                    theta,
                    params.difficulty,
                    params.discrimination,
                    params.guessing
                )
                second_deriv -= info
            
            # Newton-Raphson update
            if abs(second_deriv) < 1e-10:
                logger.warning("Second derivative too small, stopping iteration")
                break
            
            delta = first_deriv / abs(second_deriv)
            theta_new = theta - delta
            
            # Check convergence
            if abs(theta_new - theta) < tolerance:
                theta = theta_new
                break
            
            theta = theta_new
        
        # Calculate standard error
        total_info = sum(
            self.information_3pl(
                theta,
                item_params[r.item_id].difficulty,
                item_params[r.item_id].discrimination,
                item_params[r.item_id].guessing
            )
            for r in responses
            if r.item_id in item_params
        )
        
        standard_error = 1.0 / np.sqrt(total_info) if total_info > 0 else float('inf')
        
        return float(theta), float(standard_error)
    
    def estimate_ability_eap(
        self,
        responses: List[Response],
        item_params: Dict[str, ItemParameters],
        prior_mean: float = 0.0,
        prior_sd: float = 1.0,
        num_quadrature_points: int = 41
    ) -> Tuple[float, float]:
        """
        Estimate ability using Expected A Posteriori (EAP) method
        More stable than MLE for extreme scores
        
        Args:
            responses: List of student responses
            item_params: Dictionary mapping item_id to ItemParameters
            prior_mean: Prior distribution mean
            prior_sd: Prior distribution standard deviation
            num_quadrature_points: Number of quadrature points for integration
            
        Returns:
            Tuple of (theta estimate, standard error)
        """
        # Create quadrature points (-4 to +4 standard deviations)
        quad_points = np.linspace(-4, 4, num_quadrature_points)
        
        # Calculate prior density at each point
        prior_density = (
            (1.0 / (prior_sd * np.sqrt(2 * np.pi))) *
            np.exp(-0.5 * ((quad_points - prior_mean) / prior_sd) ** 2)
        )
        
        # Calculate likelihood at each quadrature point
        likelihood = np.ones(num_quadrature_points)
        
        for response in responses:
            params = item_params.get(response.item_id)
            if not params:
                continue
            
            for i, theta in enumerate(quad_points):
                p = self.probability_3pl(
                    theta,
                    params.difficulty,
                    params.discrimination,
                    params.guessing
                )
                
                if response.correct:
                    likelihood[i] *= p
                else:
                    likelihood[i] *= (1.0 - p)
        
        # Calculate posterior
        posterior = likelihood * prior_density
        posterior_sum = np.sum(posterior)
        
        if posterior_sum < 1e-10:
            logger.warning("Posterior sum too small, returning prior mean")
            return prior_mean, 1.0
        
        # Normalize posterior
        posterior = posterior / posterior_sum
        
        # Calculate EAP estimate (expected value)
        eap_estimate = np.sum(quad_points * posterior)
        
        # Calculate standard error (posterior standard deviation)
        variance = np.sum(((quad_points - eap_estimate) ** 2) * posterior)
        standard_error = np.sqrt(variance)
        
        return float(eap_estimate), float(standard_error)
    
    def calculate_test_information(
        self,
        theta: float,
        item_params: List[ItemParameters]
    ) -> float:
        """
        Calculate total test information at a given ability level
        
        Args:
            theta: Student ability
            item_params: List of item parameters
            
        Returns:
            Total information value
        """
        total_info = sum(
            self.information_3pl(
                theta,
                params.difficulty,
                params.discrimination,
                params.guessing
            )
            for params in item_params
        )
        
        return float(total_info)


# Global IRT engine instance
irt_engine = IRTEngine()
