"""
Input Validator
Implements security validation following Microsoft SDL
"""

from typing import Any


class InputValidator:
    """
    Input validation and sanitization
    Following Microsoft Security Development Lifecycle
    """
    
    def validate(self, request: Any) -> Any:
        """
        Validate and sanitize input request
        """
        # Basic validation - request model already validates structure
        # Additional security checks can be added here
        
        # Check for injection attempts
        if self._contains_injection(request.prompt):
            raise ValueError("Invalid input detected")
        
        return request
    
    def _contains_injection(self, text: str) -> bool:
        """
        Check for potential injection attacks
        """
        # Simple checks - expand based on needs
        dangerous_patterns = [
            "<script>",
            "javascript:",
            "onerror=",
            "onload=",
            "eval(",
            "exec("
        ]
        
        text_lower = text.lower()
        return any(pattern in text_lower for pattern in dangerous_patterns)
