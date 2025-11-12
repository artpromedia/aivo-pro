"""
Session Manager for Baseline Assessment
Handles assessment state and progression
"""
from datetime import datetime
from typing import Optional, Dict, List
from dataclasses import dataclass, field
import uuid
import logging

from src.core.irt_engine import ItemParameters, Response, irt_engine
from src.core.item_selector import stopping_criteria

logger = logging.getLogger(__name__)


@dataclass
class AssessmentSession:
    """Active assessment session state"""
    session_id: str
    child_id: str
    subject: str
    grade: str
    
    # Current state
    theta: float = 0.0
    standard_error: float = float('inf')
    responses: List[Response] = field(default_factory=list)
    administered_items: set = field(default_factory=set)
    
    # Metadata
    started_at: datetime = field(default_factory=datetime.utcnow)
    last_activity: datetime = field(default_factory=datetime.utcnow)
    status: str = "in_progress"  # in_progress, completed, expired
    
    def add_response(
        self,
        item_id: str,
        correct: bool,
        response_time_ms: int
    ):
        """Add a response and update ability estimate"""
        response = Response(
            item_id=item_id,
            correct=correct,
            response_time_ms=response_time_ms,
            theta_before=self.theta
        )
        
        self.responses.append(response)
        self.administered_items.add(item_id)
        self.last_activity = datetime.utcnow()
    
    def update_ability(self, theta: float, se: float):
        """Update ability estimate"""
        self.theta = theta
        self.standard_error = se
        if self.responses:
            self.responses[-1].theta_after = theta
    
    def get_stats(self) -> Dict:
        """Get session statistics"""
        return {
            "session_id": self.session_id,
            "num_items": len(self.responses),
            "theta": round(self.theta, 3),
            "standard_error": round(self.standard_error, 3),
            "percent_correct": self.get_percent_correct(),
            "duration_seconds": self.get_duration_seconds(),
            "status": self.status
        }
    
    def get_percent_correct(self) -> float:
        """Calculate percent correct"""
        if not self.responses:
            return 0.0
        correct_count = sum(1 for r in self.responses if r.correct)
        return (correct_count / len(self.responses)) * 100
    
    def get_duration_seconds(self) -> int:
        """Get assessment duration in seconds"""
        if self.status == "completed":
            return sum(r.response_time_ms for r in self.responses) // 1000
        delta = datetime.utcnow() - self.started_at
        return int(delta.total_seconds())


class SessionManager:
    """Manages multiple assessment sessions"""
    
    def __init__(self):
        self.sessions: Dict[str, AssessmentSession] = {}
    
    def create_session(
        self,
        child_id: str,
        subject: str,
        grade: str
    ) -> AssessmentSession:
        """
        Create new assessment session
        
        Args:
            child_id: Child UUID
            subject: Subject area (math, ela, science)
            grade: Grade level (K, 1-12)
            
        Returns:
            New AssessmentSession
        """
        session_id = str(uuid.uuid4())
        
        session = AssessmentSession(
            session_id=session_id,
            child_id=child_id,
            subject=subject,
            grade=grade
        )
        
        self.sessions[session_id] = session
        
        logger.info(
            f"Created session {session_id} for child {child_id}, "
            f"{subject} grade {grade}"
        )
        
        return session
    
    def get_session(self, session_id: str) -> Optional[AssessmentSession]:
        """Get session by ID"""
        return self.sessions.get(session_id)
    
    def submit_response(
        self,
        session_id: str,
        item_id: str,
        correct: bool,
        response_time_ms: int,
        item_params: Dict[str, ItemParameters]
    ) -> Dict:
        """
        Submit response and update ability estimate
        
        Args:
            session_id: Session UUID
            item_id: Item ID
            correct: Whether response was correct
            response_time_ms: Response time in milliseconds
            item_params: Dictionary of item parameters
            
        Returns:
            Updated session statistics
        """
        session = self.get_session(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        if session.status != "in_progress":
            raise ValueError(f"Session {session_id} is {session.status}")
        
        # Add response
        session.add_response(item_id, correct, response_time_ms)
        
        # Update ability estimate using MLE
        theta, se = irt_engine.estimate_ability_mle(
            session.responses,
            item_params,
            initial_theta=session.theta
        )
        
        session.update_ability(theta, se)
        
        logger.info(
            f"Session {session_id}: Response {len(session.responses)}, "
            f"correct={correct}, theta={theta:.3f}, SE={se:.3f}"
        )
        
        return session.get_stats()
    
    def check_stopping_criteria(
        self,
        session_id: str
    ) -> tuple[bool, str]:
        """
        Check if session should stop
        
        Args:
            session_id: Session UUID
            
        Returns:
            Tuple of (should_stop, reason)
        """
        session = self.get_session(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        return stopping_criteria.should_stop(
            len(session.responses),
            session.standard_error
        )
    
    def complete_session(self, session_id: str) -> Dict:
        """
        Complete assessment session
        
        Args:
            session_id: Session UUID
            
        Returns:
            Final session statistics with skill vector
        """
        session = self.get_session(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        session.status = "completed"
        session.last_activity = datetime.utcnow()
        
        logger.info(
            f"Completed session {session_id}: "
            f"{len(session.responses)} items, theta={session.theta:.3f}"
        )
        
        return session.get_stats()
    
    def cleanup_expired_sessions(self, timeout_minutes: int = 60):
        """
        Remove expired sessions
        
        Args:
            timeout_minutes: Session timeout in minutes
        """
        now = datetime.utcnow()
        expired_sessions = []
        
        for session_id, session in self.sessions.items():
            if session.status == "in_progress":
                delta = now - session.last_activity
                if delta.total_seconds() > (timeout_minutes * 60):
                    session.status = "expired"
                    expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.sessions[session_id]
            logger.info(f"Removed expired session {session_id}")


# Global session manager
session_manager = SessionManager()
