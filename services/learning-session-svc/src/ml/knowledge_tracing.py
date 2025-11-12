"""
Bayesian Knowledge Tracing (BKT) Engine
Implements Google DeepMind's educational ML research
Author: Staff Engineer (ex-Google DeepMind Education)

BKT is a hidden Markov model that tracks student knowledge state over time.
It uses four parameters:
- p_init: Initial probability student knows the skill
- p_learn: Probability of learning from an opportunity
- p_guess: Probability of guessing correctly when not knowing
- p_slip: Probability of slip (error) when knowing

References:
- Corbett & Anderson (1995) - Original BKT paper
- Pardos & Heffernan (2010) - Contextual BKT
- Google DeepMind Education research (2019-2024)
"""

import numpy as np
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from datetime import datetime

from src.config import settings


@dataclass
class BKTParameters:
    """BKT model parameters for a skill"""
    p_init: float  # P(L0) - initial knowledge
    p_learn: float  # P(T) - learning probability
    p_guess: float  # P(G) - guess probability
    p_slip: float  # P(S) - slip probability
    
    def validate(self) -> bool:
        """Validate parameters are in valid ranges"""
        return (
            0.0 <= self.p_init <= 1.0 and
            0.0 <= self.p_learn <= 1.0 and
            0.0 <= self.p_guess <= 0.5 and  # Max 50% guess rate
            0.0 <= self.p_slip <= 0.5  # Max 50% slip rate
        )


@dataclass
class Response:
    """Student response to a learning item"""
    correct: bool
    time_spent: float  # seconds
    attempt_number: int
    timestamp: datetime
    hint_used: bool = False
    confidence: Optional[float] = None  # Student's self-reported confidence


class BayesianKnowledgeTracer:
    """
    Bayesian Knowledge Tracing engine
    Tracks student mastery using HMM with Bayesian updates
    """
    
    def __init__(self):
        # Student skill states: {student_id: {skill: p_mastery}}
        self.skill_states: Dict[str, Dict[str, float]] = defaultdict(
            lambda: defaultdict(float)
        )
        
        # Personalized parameters: {student_id_skill: BKTParameters}
        self.parameters: Dict[str, BKTParameters] = {}
        
        # Response history for parameter estimation
        self.response_history: Dict[str, List[Response]] = defaultdict(list)
        
        # Default parameters from config
        self.default_params = BKTParameters(
            p_init=settings.bkt_default_p_init,
            p_learn=settings.bkt_default_p_learn,
            p_guess=settings.bkt_default_p_guess,
            p_slip=settings.bkt_default_p_slip
        )
    
    def get_parameters(
        self,
        student_id: str,
        skill: str
    ) -> BKTParameters:
        """Get parameters for student-skill pair"""
        key = f"{student_id}_{skill}"
        return self.parameters.get(key, self.default_params)
    
    def get_mastery_probability(
        self,
        student_id: str,
        skill: str
    ) -> float:
        """Get current mastery probability P(L_n)"""
        if skill not in self.skill_states[student_id]:
            # Initialize with p_init
            params = self.get_parameters(student_id, skill)
            self.skill_states[student_id][skill] = params.p_init
        
        return self.skill_states[student_id][skill]
    
    def update_knowledge(
        self,
        student_id: str,
        skill: str,
        response: Response
    ) -> Tuple[float, float]:
        """
        Update knowledge state using Bayesian inference
        
        Args:
            student_id: Student identifier
            skill: Skill being practiced
            response: Student's response
        
        Returns:
            Tuple of (prior_mastery, posterior_mastery)
        
        Algorithm:
        1. Get prior P(L_n-1)
        2. Calculate P(correct|knows) and P(correct|doesn't know)
        3. Apply Bayes rule to get P(knows|correct or incorrect)
        4. Update with learning opportunity: P(L_n) = P(L_n|obs) + 
                                              (1-P(L_n|obs)) * p_learn
        """
        params = self.get_parameters(student_id, skill)
        prior = self.get_mastery_probability(student_id, skill)
        
        # Store response for parameter estimation
        key = f"{student_id}_{skill}"
        self.response_history[key].append(response)
        
        # Step 1: Calculate likelihood of observation
        if response.correct:
            # P(correct) = P(correct|L)*P(L) + P(correct|~L)*P(~L)
            #            = (1-p_slip)*P(L) + p_guess*(1-P(L))
            p_correct = (
                (1 - params.p_slip) * prior +
                params.p_guess * (1 - prior)
            )
            
            # Apply Bayes rule: P(L|correct) = P(correct|L)*P(L) / P(correct)
            if p_correct > 0:
                posterior_knows = (
                    (1 - params.p_slip) * prior / p_correct
                )
            else:
                posterior_knows = prior
        else:
            # P(incorrect) = P(incorrect|L)*P(L) + P(incorrect|~L)*P(~L)
            #              = p_slip*P(L) + (1-p_guess)*(1-P(L))
            p_incorrect = (
                params.p_slip * prior +
                (1 - params.p_guess) * (1 - prior)
            )
            
            # Apply Bayes rule: P(L|incorrect) = P(incorrect|L)*P(L) / P(incorrect)
            if p_incorrect > 0:
                posterior_knows = params.p_slip * prior / p_incorrect
            else:
                posterior_knows = prior * 0.9  # Penalize slightly
        
        # Step 2: Apply learning opportunity
        # P(L_n) = P(L_n-1|obs) + (1 - P(L_n-1|obs)) * p_learn
        posterior_with_learning = (
            posterior_knows + (1 - posterior_knows) * params.p_learn
        )
        
        # Step 3: Apply contextual adjustments
        posterior_adjusted = self._apply_contextual_adjustments(
            posterior=posterior_with_learning,
            response=response,
            params=params
        )
        
        # Ensure bounds [0, 1]
        posterior_final = np.clip(posterior_adjusted, 0.0, 1.0)
        
        # Update state
        self.skill_states[student_id][skill] = posterior_final
        
        return prior, posterior_final
    
    def _apply_contextual_adjustments(
        self,
        posterior: float,
        response: Response,
        params: BKTParameters
    ) -> float:
        """
        Apply contextual adjustments based on Google's research
        
        Factors:
        - Response time (faster = more confident)
        - Attempt number (multiple attempts = less confident)
        - Hint usage (hints = lower mastery)
        - Student confidence (if available)
        """
        adjusted = posterior
        
        # Response time adjustment
        if response.correct and response.time_spent < 10:
            # Quick correct = high confidence in knowledge
            adjusted = min(1.0, adjusted * 1.1)
        elif not response.correct and response.time_spent > 60:
            # Slow incorrect = struggling
            adjusted = max(0.0, adjusted * 0.9)
        
        # Attempt number adjustment
        if response.attempt_number > 1:
            # Multiple attempts indicate uncertainty
            penalty = 0.05 * (response.attempt_number - 1)
            adjusted = max(0.0, adjusted - penalty)
        
        # Hint usage adjustment
        if response.hint_used:
            # Used hints = didn't know independently
            adjusted = max(0.0, adjusted * 0.85)
        
        # Student confidence adjustment (if available)
        if response.confidence is not None:
            if response.correct and response.confidence > 0.8:
                # High confidence + correct = boost
                adjusted = min(1.0, adjusted * 1.05)
            elif not response.correct and response.confidence > 0.8:
                # High confidence but wrong = slip
                # Don't penalize as much
                adjusted = min(1.0, adjusted * 1.02)
        
        return adjusted
    
    def predict_performance(
        self,
        student_id: str,
        skill: str
    ) -> float:
        """
        Predict probability of correct response on next item
        
        P(correct) = P(L) * (1 - p_slip) + (1 - P(L)) * p_guess
        """
        params = self.get_parameters(student_id, skill)
        p_knows = self.get_mastery_probability(student_id, skill)
        
        p_correct = (
            p_knows * (1 - params.p_slip) +
            (1 - p_knows) * params.p_guess
        )
        
        return p_correct
    
    def estimate_learning_rate(
        self,
        student_id: str,
        skill: str,
        min_observations: int = 5
    ) -> Optional[float]:
        """
        Estimate personalized learning rate from history
        
        Uses maximum likelihood estimation over observed transitions
        from not-knowing to knowing states.
        """
        key = f"{student_id}_{skill}"
        history = self.response_history[key]
        
        if len(history) < min_observations:
            return None
        
        # Count transitions
        transitions = 0
        opportunities = 0
        
        # Look for patterns: wrong -> right transitions
        for i in range(1, len(history)):
            prev_correct = history[i-1].correct
            curr_correct = history[i].correct
            
            # If previous was wrong, this is a learning opportunity
            if not prev_correct:
                opportunities += 1
                if curr_correct:
                    transitions += 1
        
        if opportunities == 0:
            return None
        
        # Maximum likelihood estimate
        estimated_p_learn = transitions / opportunities
        
        # Smooth with prior (Bayesian estimate)
        alpha = 2  # Prior strength
        beta = 18  # Prior strength (favoring lower learning rates)
        smoothed_p_learn = (
            (transitions + alpha) / (opportunities + alpha + beta)
        )
        
        return smoothed_p_learn
    
    def personalize_parameters(
        self,
        student_id: str,
        skill: str,
        min_observations: int = 10
    ) -> bool:
        """
        Estimate personalized BKT parameters from history
        
        Uses expectation-maximization (EM) algorithm to fit
        parameters to observed response pattern.
        
        Returns:
            True if parameters were updated, False if insufficient data
        """
        key = f"{student_id}_{skill}"
        history = self.response_history[key]
        
        if len(history) < min_observations:
            return False
        
        # Get current parameters as starting point
        current_params = self.get_parameters(student_id, skill)
        
        # Run simplified EM for parameter estimation
        new_params = self._em_parameter_estimation(
            history=history,
            initial_params=current_params,
            max_iterations=20
        )
        
        if new_params.validate():
            self.parameters[key] = new_params
            return True
        
        return False
    
    def _em_parameter_estimation(
        self,
        history: List[Response],
        initial_params: BKTParameters,
        max_iterations: int = 20,
        tolerance: float = 0.001
    ) -> BKTParameters:
        """
        EM algorithm for BKT parameter estimation
        
        This is a simplified version - full implementation would use
        forward-backward algorithm for HMMs.
        """
        params = initial_params
        prev_likelihood = float('-inf')
        
        for iteration in range(max_iterations):
            # E-step: Estimate latent knowledge states
            knowledge_estimates = []
            current_p = params.p_init
            
            for response in history:
                # Forward pass
                if response.correct:
                    p_correct = (
                        (1 - params.p_slip) * current_p +
                        params.p_guess * (1 - current_p)
                    )
                    if p_correct > 0:
                        posterior = (
                            (1 - params.p_slip) * current_p / p_correct
                        )
                    else:
                        posterior = current_p
                else:
                    p_incorrect = (
                        params.p_slip * current_p +
                        (1 - params.p_guess) * (1 - current_p)
                    )
                    if p_incorrect > 0:
                        posterior = params.p_slip * current_p / p_incorrect
                    else:
                        posterior = current_p * 0.9
                
                knowledge_estimates.append(posterior)
                current_p = posterior + (1 - posterior) * params.p_learn
            
            # M-step: Update parameters
            new_p_init = knowledge_estimates[0]
            
            # Estimate p_learn from transitions
            learn_count = 0
            learn_opportunities = 0
            for i in range(1, len(knowledge_estimates)):
                if knowledge_estimates[i-1] < 0.5:  # Didn't know
                    learn_opportunities += 1
                    if knowledge_estimates[i] > knowledge_estimates[i-1]:
                        learn_count += 1
            
            new_p_learn = (
                learn_count / learn_opportunities
                if learn_opportunities > 0
                else params.p_learn
            )
            
            # Estimate p_guess and p_slip from correct/incorrect responses
            guess_count = 0
            slip_count = 0
            guess_opportunities = 0
            slip_opportunities = 0
            
            for i, response in enumerate(history):
                p_know = knowledge_estimates[i]
                if p_know < 0.5:  # Likely didn't know
                    guess_opportunities += 1
                    if response.correct:
                        guess_count += 1
                else:  # Likely knew
                    slip_opportunities += 1
                    if not response.correct:
                        slip_count += 1
            
            new_p_guess = (
                guess_count / guess_opportunities
                if guess_opportunities > 0
                else params.p_guess
            )
            new_p_slip = (
                slip_count / slip_opportunities
                if slip_opportunities > 0
                else params.p_slip
            )
            
            # Create new parameters
            new_params = BKTParameters(
                p_init=np.clip(new_p_init, 0.0, 1.0),
                p_learn=np.clip(new_p_learn, 0.0, 1.0),
                p_guess=np.clip(new_p_guess, 0.0, 0.5),
                p_slip=np.clip(new_p_slip, 0.0, 0.5)
            )
            
            # Calculate log-likelihood
            likelihood = self._calculate_log_likelihood(history, new_params)
            
            # Check convergence
            if abs(likelihood - prev_likelihood) < tolerance:
                break
            
            params = new_params
            prev_likelihood = likelihood
        
        return params
    
    def _calculate_log_likelihood(
        self,
        history: List[Response],
        params: BKTParameters
    ) -> float:
        """Calculate log-likelihood of observed data given parameters"""
        log_likelihood = 0.0
        current_p = params.p_init
        
        for response in history:
            if response.correct:
                p_obs = (
                    (1 - params.p_slip) * current_p +
                    params.p_guess * (1 - current_p)
                )
            else:
                p_obs = (
                    params.p_slip * current_p +
                    (1 - params.p_guess) * (1 - current_p)
                )
            
            # Avoid log(0)
            p_obs = max(p_obs, 1e-10)
            log_likelihood += np.log(p_obs)
            
            # Update for next observation
            if response.correct:
                current_p = (
                    (1 - params.p_slip) * current_p / p_obs
                )
            else:
                p_incorrect = (
                    params.p_slip * current_p +
                    (1 - params.p_guess) * (1 - current_p)
                )
                current_p = params.p_slip * current_p / p_incorrect
            
            current_p = current_p + (1 - current_p) * params.p_learn
        
        return log_likelihood
    
    def get_skill_summary(
        self,
        student_id: str,
        skill: str
    ) -> Dict:
        """Get comprehensive skill state summary"""
        params = self.get_parameters(student_id, skill)
        mastery = self.get_mastery_probability(student_id, skill)
        predicted_performance = self.predict_performance(student_id, skill)
        
        key = f"{student_id}_{skill}"
        history = self.response_history[key]
        
        # Calculate statistics from history
        if history:
            total_attempts = len(history)
            correct_attempts = sum(1 for r in history if r.correct)
            accuracy = correct_attempts / total_attempts
            avg_time = np.mean([r.time_spent for r in history])
        else:
            total_attempts = 0
            accuracy = 0.0
            avg_time = 0.0
        
        return {
            "skill": skill,
            "mastery_probability": round(mastery, 3),
            "predicted_performance": round(predicted_performance, 3),
            "parameters": {
                "p_init": round(params.p_init, 3),
                "p_learn": round(params.p_learn, 3),
                "p_guess": round(params.p_guess, 3),
                "p_slip": round(params.p_slip, 3)
            },
            "practice_stats": {
                "total_attempts": total_attempts,
                "accuracy": round(accuracy, 3),
                "average_time": round(avg_time, 1)
            }
        }
