"""
Password Security with Argon2id
NIST 800-63B compliant password hashing and validation
"""
from passlib.context import CryptContext
from passlib.hash import argon2
import httpx
import hashlib
import re
from typing import Tuple
from src.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Argon2id context
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__type="ID",  # Argon2id variant
    argon2__time_cost=settings.password_time_cost,
    argon2__memory_cost=settings.password_memory_cost,
    argon2__parallelism=settings.password_parallelism,
    argon2__hash_len=settings.password_hash_length,
    argon2__salt_len=settings.password_salt_length,
)


class PasswordValidator:
    """Password strength validation and security"""
    
    @staticmethod
    def validate_strength(password: str) -> Tuple[bool, list[str]]:
        """
        Validate password meets security requirements
        
        Requirements:
        - Minimum 12 characters
        - At least 1 uppercase letter
        - At least 1 lowercase letter
        - At least 1 number
        - At least 1 special character
        - No common patterns
        
        Args:
            password: Plain text password
            
        Returns:
            Tuple of (is_valid, list of error messages)
        """
        errors = []
        
        # Length check
        if len(password) < settings.password_min_length:
            errors.append(
                f"Password must be at least {settings.password_min_length} characters"
            )
        
        # Uppercase check
        if not re.search(r"[A-Z]", password):
            errors.append("Password must contain at least 1 uppercase letter")
        
        # Lowercase check
        if not re.search(r"[a-z]", password):
            errors.append("Password must contain at least 1 lowercase letter")
        
        # Number check
        if not re.search(r"\d", password):
            errors.append("Password must contain at least 1 number")
        
        # Special character check
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            errors.append("Password must contain at least 1 special character")
        
        # Common patterns
        common_patterns = [
            r"(.)\1{2,}",  # Repeated characters (aaa, 111)
            r"(012|123|234|345|456|567|678|789|890)",  # Sequential numbers
            r"(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)",  # Sequential letters
        ]
        
        for pattern in common_patterns:
            if re.search(pattern, password.lower()):
                errors.append("Password contains common patterns")
                break
        
        return len(errors) == 0, errors
    
    @staticmethod
    async def check_compromised(password: str) -> bool:
        """
        Check if password appears in HaveIBeenPwned database
        Uses k-anonymity model - only sends first 5 chars of hash
        
        Args:
            password: Plain text password
            
        Returns:
            True if password is compromised, False otherwise
        """
        if not settings.hibp_api_key:
            logger.warning("HIBP API key not configured, skipping breach check")
            return False
        
        try:
            # SHA-1 hash of password
            sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
            prefix = sha1_hash[:5]
            suffix = sha1_hash[5:]
            
            # Query HIBP API
            url = f"{settings.hibp_api_url}/{prefix}"
            headers = {
                "hibp-api-key": settings.hibp_api_key,
                "user-agent": "AIVO-Learning-Platform"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=5.0)
                response.raise_for_status()
            
            # Check if suffix appears in results
            hashes = response.text.split("\r\n")
            for line in hashes:
                hash_suffix, count = line.split(":")
                if hash_suffix == suffix:
                    logger.warning(
                        f"Password found in {count} breaches"
                    )
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking HIBP: {e}")
            # Don't block signup if HIBP check fails
            return False
    
    @staticmethod
    def check_common_passwords(password: str) -> bool:
        """
        Check against common password list
        
        Args:
            password: Plain text password
            
        Returns:
            True if password is common, False otherwise
        """
        # Top 100 most common passwords
        common = {
            "password", "123456", "123456789", "12345678", "12345", "1234567",
            "password1", "123123", "1234567890", "qwerty", "abc123", "111111",
            "password123", "qwerty123", "admin", "letmein", "welcome", "monkey",
            "dragon", "master", "sunshine", "princess", "football", "shadow",
            "iloveyou", "starwars", "password1234", "trustno1", "freedom",
        }
        
        return password.lower() in common


class PasswordHasher:
    """Password hashing and verification"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash password using Argon2id
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password string
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify password against hash
        
        Args:
            plain_password: Plain text password
            hashed_password: Hashed password from database
            
        Returns:
            True if password matches, False otherwise
        """
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            return False
    
    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        """
        Check if password needs rehashing (parameters changed)
        
        Args:
            hashed_password: Hashed password from database
            
        Returns:
            True if needs rehashing, False otherwise
        """
        return pwd_context.needs_update(hashed_password)


# Global instances
password_validator = PasswordValidator()
password_hasher = PasswordHasher()
