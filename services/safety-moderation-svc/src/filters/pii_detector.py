"""PII (Personally Identifiable Information) detector"""

import re
from typing import Dict, List


class PIIDetector:
    """Detect and redact PII for COPPA/FERPA compliance"""
    
    def __init__(self):
        self.patterns = {}
        self.pii_categories = [
            "email", "phone", "ssn", "address",
            "credit_card", "name", "date_of_birth"
        ]
    
    async def load_patterns(self):
        """Load PII detection patterns"""
        self.patterns = {
            "email": re.compile(
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            ),
            "phone": re.compile(
                r'\b(\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b'
            ),
            "ssn": re.compile(
                r'\b\d{3}-\d{2}-\d{4}\b'
            ),
            "zip_code": re.compile(
                r'\b\d{5}(-\d{4})?\b'
            ),
            "credit_card": re.compile(
                r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
            ),
            "street_address": re.compile(
                r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|'
                r'Boulevard|Blvd|Lane|Ln|Drive|Dr)\b',
                re.IGNORECASE
            )
        }
        
        print("✅ PII detector loaded")
    
    async def scan(self, content: str) -> Dict:
        """Scan content for PII"""
        found_pii = {}
        redacted_content = content
        
        for pii_type, pattern in self.patterns.items():
            matches = pattern.findall(content)
            
            if matches:
                found_pii[pii_type] = len(matches)
                
                # Redact matches
                for match in set(matches):
                    if isinstance(match, tuple):
                        match = match[0] if match[0] else match[1]
                    
                    redaction = self._get_redaction_text(pii_type)
                    redacted_content = redacted_content.replace(
                        str(match),
                        redaction
                    )
        
        return {
            "contains_pii": len(found_pii) > 0,
            "pii_types": list(found_pii.keys()),
            "pii_counts": found_pii,
            "redacted_content": redacted_content,
            "original_content": content if len(found_pii) > 0 else None
        }
    
    def _get_redaction_text(self, pii_type: str) -> str:
        """Get redaction text for PII type"""
        redactions = {
            "email": "[EMAIL_REDACTED]",
            "phone": "[PHONE_REDACTED]",
            "ssn": "[SSN_REDACTED]",
            "zip_code": "[ZIP_REDACTED]",
            "credit_card": "[CARD_REDACTED]",
            "street_address": "[ADDRESS_REDACTED]"
        }
        return redactions.get(pii_type, "[REDACTED]")
    
    async def validate_consent_for_pii(
        self,
        user_id: str,
        pii_types: List[str]
    ) -> bool:
        """Check if user has consent to share PII"""
        # Check parental consent for minors
        # Implementation would check database
        return False  # Default to deny for safety
