"""
JWT Token Management with RS256
Handles access and refresh tokens with rotation
"""
from datetime import datetime, timedelta
from typing import Dict, Optional
from jose import jwt, JWTError
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
from pathlib import Path
from src.config import settings
import uuid
import logging

logger = logging.getLogger(__name__)


class JWTManager:
    """JWT token creation and validation"""
    
    def __init__(self):
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire = timedelta(
            minutes=settings.jwt_access_token_expire_minutes
        )
        self.refresh_token_expire = timedelta(
            days=settings.jwt_refresh_token_expire_days
        )
        
        # Load or generate RSA keys for RS256
        if self.algorithm == "RS256":
            self.private_key, self.public_key = self._load_or_generate_keys()
        else:
            self.secret_key = settings.jwt_secret_key
    
    def _load_or_generate_keys(self):
        """Load existing RSA keys or generate new ones"""
        private_key_path = Path(settings.jwt_private_key_path or "keys/jwt_private.pem")
        public_key_path = Path(settings.jwt_public_key_path or "keys/jwt_public.pem")
        
        # Create keys directory if it doesn't exist
        private_key_path.parent.mkdir(parents=True, exist_ok=True)
        
        if private_key_path.exists() and public_key_path.exists():
            # Load existing keys
            logger.info("Loading existing RSA keys")
            with open(private_key_path, "rb") as f:
                private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None,
                    backend=default_backend()
                )
            with open(public_key_path, "rb") as f:
                public_key = serialization.load_pem_public_key(
                    f.read(),
                    backend=default_backend()
                )
        else:
            # Generate new keys
            logger.info("Generating new RSA keys")
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
                backend=default_backend()
            )
            public_key = private_key.public_key()
            
            # Save keys
            with open(private_key_path, "wb") as f:
                f.write(
                    private_key.private_bytes(
                        encoding=serialization.Encoding.PEM,
                        format=serialization.PrivateFormat.PKCS8,
                        encryption_algorithm=serialization.NoEncryption()
                    )
                )
            with open(public_key_path, "wb") as f:
                f.write(
                    public_key.public_bytes(
                        encoding=serialization.Encoding.PEM,
                        format=serialization.PublicFormat.SubjectPublicKeyInfo
                    )
                )
            logger.info(f"RSA keys saved to {private_key_path.parent}")
        
        return private_key, public_key
    
    def create_access_token(
        self,
        user_id: str,
        email: str,
        role: str,
        additional_claims: Optional[Dict] = None
    ) -> str:
        """
        Create JWT access token
        
        Args:
            user_id: User UUID
            email: User email
            role: User role (parent, teacher, admin)
            additional_claims: Extra claims to include
            
        Returns:
            Encoded JWT token
        """
        now = datetime.utcnow()
        expires = now + self.access_token_expire
        
        claims = {
            "sub": str(user_id),
            "email": email,
            "role": role,
            "type": "access",
            "iat": now,
            "exp": expires,
            "jti": str(uuid.uuid4()),  # Unique token ID
        }
        
        if additional_claims:
            claims.update(additional_claims)
        
        if self.algorithm == "RS256":
            # Serialize private key for jose
            private_pem = self.private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            return jwt.encode(claims, private_pem, algorithm=self.algorithm)
        else:
            return jwt.encode(claims, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(self, user_id: str, session_id: str) -> str:
        """
        Create JWT refresh token
        
        Args:
            user_id: User UUID
            session_id: Session UUID
            
        Returns:
            Encoded JWT token
        """
        now = datetime.utcnow()
        expires = now + self.refresh_token_expire
        
        claims = {
            "sub": str(user_id),
            "session_id": str(session_id),
            "type": "refresh",
            "iat": now,
            "exp": expires,
            "jti": str(uuid.uuid4()),
        }
        
        if self.algorithm == "RS256":
            private_pem = self.private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            return jwt.encode(claims, private_pem, algorithm=self.algorithm)
        else:
            return jwt.encode(claims, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str, token_type: str = "access") -> Dict:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token string
            token_type: Expected token type (access or refresh)
            
        Returns:
            Decoded token claims
            
        Raises:
            JWTError: If token is invalid
        """
        try:
            if self.algorithm == "RS256":
                # Serialize public key for jose
                public_pem = self.public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                )
                claims = jwt.decode(token, public_pem, algorithms=[self.algorithm])
            else:
                claims = jwt.decode(
                    token,
                    self.secret_key,
                    algorithms=[self.algorithm]
                )
            
            # Verify token type
            if claims.get("type") != token_type:
                raise JWTError(f"Invalid token type. Expected {token_type}")
            
            return claims
            
        except JWTError as e:
            logger.warning(f"JWT verification failed: {e}")
            raise
    
    def decode_token_unsafe(self, token: str) -> Dict:
        """
        Decode token without verification (for debugging)
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded token claims
        """
        return jwt.get_unverified_claims(token)
    
    def get_token_expiry(self, token: str) -> Optional[datetime]:
        """
        Get token expiration time
        
        Args:
            token: JWT token string
            
        Returns:
            Expiration datetime or None if invalid
        """
        try:
            claims = self.decode_token_unsafe(token)
            exp = claims.get("exp")
            if exp:
                return datetime.fromtimestamp(exp)
            return None
        except Exception:
            return None
    
    def is_token_expired(self, token: str) -> bool:
        """
        Check if token is expired
        
        Args:
            token: JWT token string
            
        Returns:
            True if expired, False otherwise
        """
        expiry = self.get_token_expiry(token)
        if not expiry:
            return True
        return datetime.utcnow() > expiry


# Global JWT manager instance
jwt_manager = JWTManager()
