"""
Fraud Detection System
Following Stripe Radar best practices
"""

from typing import Dict, List
from datetime import datetime, timedelta
from dataclasses import dataclass
import re


@dataclass
class FraudCheckResult:
    """Result of fraud check"""
    risk_score: float  # 0-1
    risk_level: str  # low, medium, high, critical
    action: str  # allow, review, 3d_secure, block
    factors: List[Dict]
    requires_3ds: bool
    block_reason: str = None


class FraudDetector:
    """
    Payment fraud detection and prevention
    Risk-based authentication
    """
    
    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client
        
        # Risk thresholds
        self.thresholds = {
            "low": 0.3,
            "medium": 0.5,
            "high": 0.7,
            "critical": 0.85
        }
        
        # Velocity limits (per hour)
        self.velocity_limits = {
            "payment_attempts": 3,
            "card_changes": 2,
            "failed_payments": 2
        }
    
    async def validate_payment(
        self,
        customer_id: str,
        amount_cents: int,
        payment_method_id: str,
        metadata: Dict
    ) -> FraudCheckResult:
        """
        Comprehensive fraud validation
        Returns risk assessment and recommended action
        """
        
        risk_score = 0.0
        risk_factors = []
        requires_3ds = False
        
        # Check 1: New customer risk
        account_age = await self._get_account_age_days(customer_id)
        if account_age < 7:
            factor_weight = 0.15
            risk_score += factor_weight
            risk_factors.append({
                "type": "new_account",
                "weight": factor_weight,
                "detail": f"Account age: {account_age} days"
            })
        
        # Check 2: High amount for new customer
        if account_age < 30 and amount_cents > 50000:  # $500
            factor_weight = 0.25
            risk_score += factor_weight
            risk_factors.append({
                "type": "high_amount_new_customer",
                "weight": factor_weight,
                "detail": f"${amount_cents/100:.2f} for {account_age}-day account"
            })
        
        # Check 3: Payment velocity
        velocity_risk = await self._check_payment_velocity(customer_id)
        if velocity_risk["is_suspicious"]:
            risk_score += velocity_risk["weight"]
            risk_factors.append({
                "type": "payment_velocity",
                "weight": velocity_risk["weight"],
                "detail": velocity_risk["detail"]
            })
        
        # Check 4: Card testing detection
        card_testing = await self._detect_card_testing(customer_id)
        if card_testing["detected"]:
            factor_weight = 0.4
            risk_score += factor_weight
            risk_factors.append({
                "type": "card_testing",
                "weight": factor_weight,
                "detail": card_testing["detail"]
            })
        
        # Check 5: Geographic anomaly
        geo_risk = await self._check_geographic_anomaly(
            customer_id,
            metadata.get("ip_address"),
            metadata.get("country")
        )
        if geo_risk["is_anomaly"]:
            risk_score += geo_risk["weight"]
            risk_factors.append({
                "type": "geographic_anomaly",
                "weight": geo_risk["weight"],
                "detail": geo_risk["detail"]
            })
        
        # Check 6: Email domain reputation
        email = metadata.get("email", "")
        email_risk = self._check_email_risk(email)
        if email_risk["is_risky"]:
            risk_score += email_risk["weight"]
            risk_factors.append({
                "type": "email_risk",
                "weight": email_risk["weight"],
                "detail": email_risk["detail"]
            })
        
        # Check 7: Device fingerprint (if available)
        if metadata.get("device_fingerprint"):
            device_risk = await self._check_device_history(
                metadata["device_fingerprint"]
            )
            if device_risk["is_suspicious"]:
                risk_score += device_risk["weight"]
                risk_factors.append({
                    "type": "device_history",
                    "weight": device_risk["weight"],
                    "detail": device_risk["detail"]
                })
        
        # Cap risk score at 1.0
        risk_score = min(risk_score, 1.0)
        
        # Determine risk level and action
        if risk_score >= self.thresholds["critical"]:
            risk_level = "critical"
            action = "block"
            block_reason = "High fraud risk detected"
        elif risk_score >= self.thresholds["high"]:
            risk_level = "high"
            action = "3d_secure"
            requires_3ds = True
        elif risk_score >= self.thresholds["medium"]:
            risk_level = "medium"
            action = "review"
        else:
            risk_level = "low"
            action = "allow"
        
        # Always require 3DS for high amounts
        if amount_cents > 100000:  # $1000
            requires_3ds = True
            if action == "allow":
                action = "3d_secure"
        
        return FraudCheckResult(
            risk_score=risk_score,
            risk_level=risk_level,
            action=action,
            factors=risk_factors,
            requires_3ds=requires_3ds,
            block_reason=block_reason
        )
    
    async def _get_account_age_days(self, customer_id: str) -> int:
        """Get customer account age in days"""
        query = """
            SELECT created_at
            FROM customers
            WHERE id = $1
        """
        result = await self.db.fetchrow(query, customer_id)
        
        if not result:
            return 0
        
        account_age = datetime.utcnow() - result['created_at']
        return account_age.days
    
    async def _check_payment_velocity(
        self,
        customer_id: str
    ) -> Dict:
        """
        Check payment attempt velocity
        Multiple attempts in short time = suspicious
        """
        
        # Get attempt counts from Redis (last hour)
        key = f"fraud:velocity:{customer_id}"
        
        attempts = await self.redis.get(f"{key}:attempts") or 0
        failures = await self.redis.get(f"{key}:failures") or 0
        card_changes = await self.redis.get(f"{key}:card_changes") or 0
        
        attempts = int(attempts)
        failures = int(failures)
        card_changes = int(card_changes)
        
        # Check against limits
        violations = []
        
        if attempts > self.velocity_limits["payment_attempts"]:
            violations.append(
                f"{attempts} payment attempts in 1 hour"
            )
        
        if failures > self.velocity_limits["failed_payments"]:
            violations.append(
                f"{failures} failed payments in 1 hour"
            )
        
        if card_changes > self.velocity_limits["card_changes"]:
            violations.append(
                f"{card_changes} card changes in 1 hour"
            )
        
        if violations:
            # Calculate weight based on severity
            weight = min(len(violations) * 0.15, 0.4)
            
            return {
                "is_suspicious": True,
                "weight": weight,
                "detail": "; ".join(violations)
            }
        
        return {"is_suspicious": False}
    
    async def record_payment_attempt(
        self,
        customer_id: str,
        success: bool,
        card_changed: bool = False
    ):
        """Record payment attempt for velocity tracking"""
        
        key = f"fraud:velocity:{customer_id}"
        ttl = 3600  # 1 hour
        
        # Increment counters
        await self.redis.incr(f"{key}:attempts")
        await self.redis.expire(f"{key}:attempts", ttl)
        
        if not success:
            await self.redis.incr(f"{key}:failures")
            await self.redis.expire(f"{key}:failures", ttl)
        
        if card_changed:
            await self.redis.incr(f"{key}:card_changes")
            await self.redis.expire(f"{key}:card_changes", ttl)
    
    async def _detect_card_testing(self, customer_id: str) -> Dict:
        """
        Detect card testing attacks
        Pattern: Multiple small transactions to test stolen cards
        """
        
        # Look for small transactions in last hour
        query = """
            SELECT COUNT(*), SUM(amount_cents)
            FROM payment_intents
            WHERE customer_id = $1
            AND created_at > $2
            AND amount_cents < 100
        """
        
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        result = await self.db.fetchrow(query, customer_id, one_hour_ago)
        
        small_transaction_count = result[0] or 0
        
        # Card testing: 5+ small transactions in 1 hour
        if small_transaction_count >= 5:
            return {
                "detected": True,
                "detail": f"{small_transaction_count} small transactions in 1 hour"
            }
        
        return {"detected": False}
    
    async def _check_geographic_anomaly(
        self,
        customer_id: str,
        ip_address: str,
        country: str
    ) -> Dict:
        """
        Check for geographic anomalies
        Different country than usual = suspicious
        """
        
        if not country:
            return {"is_anomaly": False}
        
        # Get customer's usual countries
        query = """
            SELECT DISTINCT country
            FROM payment_intents
            WHERE customer_id = $1
            AND created_at > $2
            ORDER BY created_at DESC
            LIMIT 5
        """
        
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        results = await self.db.fetch(query, customer_id, thirty_days_ago)
        
        usual_countries = [r['country'] for r in results if r['country']]
        
        # If no history, not anomalous
        if not usual_countries:
            return {"is_anomaly": False}
        
        # Check if current country is unusual
        if country not in usual_countries:
            return {
                "is_anomaly": True,
                "weight": 0.2,
                "detail": f"Payment from {country}, usual: {', '.join(usual_countries)}"
            }
        
        return {"is_anomaly": False}
    
    def _check_email_risk(self, email: str) -> Dict:
        """
        Check email domain for fraud indicators
        """
        
        if not email:
            return {"is_risky": False}
        
        # Extract domain
        match = re.search(r'@(.+)$', email)
        if not match:
            return {"is_risky": False}
        
        domain = match.group(1).lower()
        
        # High-risk disposable email domains
        disposable_domains = [
            'tempmail.com',
            'guerrillamail.com',
            'mailinator.com',
            '10minutemail.com',
            'throwaway.email'
        ]
        
        if domain in disposable_domains:
            return {
                "is_risky": True,
                "weight": 0.3,
                "detail": f"Disposable email domain: {domain}"
            }
        
        # Check for suspicious patterns
        if re.search(r'\d{5,}', email):  # Long number sequences
            return {
                "is_risky": True,
                "weight": 0.15,
                "detail": "Suspicious email pattern"
            }
        
        return {"is_risky": False}
    
    async def _check_device_history(
        self,
        device_fingerprint: str
    ) -> Dict:
        """
        Check device fraud history
        Device used in multiple fraud attempts = suspicious
        """
        
        # Get fraud count for this device
        query = """
            SELECT COUNT(*)
            FROM fraud_events
            WHERE device_fingerprint = $1
            AND created_at > $2
        """
        
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        result = await self.db.fetchrow(query, device_fingerprint, seven_days_ago)
        
        fraud_count = result[0] or 0
        
        if fraud_count >= 3:
            return {
                "is_suspicious": True,
                "weight": 0.35,
                "detail": f"Device used in {fraud_count} fraud attempts"
            }
        
        return {"is_suspicious": False}
    
    async def record_fraud_event(
        self,
        customer_id: str,
        event_type: str,
        metadata: Dict
    ):
        """Record fraud event for future detection"""
        
        query = """
            INSERT INTO fraud_events (
                customer_id,
                event_type,
                device_fingerprint,
                ip_address,
                metadata,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
        """
        
        await self.db.execute(
            query,
            customer_id,
            event_type,
            metadata.get('device_fingerprint'),
            metadata.get('ip_address'),
            metadata,
            datetime.utcnow()
        )


class PaymentDecisionEngine:
    """
    Make final payment decisions based on fraud risk
    """
    
    def __init__(self, fraud_detector: FraudDetector):
        self.fraud_detector = fraud_detector
    
    async def should_allow_payment(
        self,
        customer_id: str,
        amount_cents: int,
        payment_method_id: str,
        metadata: Dict
    ) -> Dict:
        """
        Determine if payment should proceed
        Returns decision with reasoning
        """
        
        # Run fraud check
        fraud_result = await self.fraud_detector.validate_payment(
            customer_id,
            amount_cents,
            payment_method_id,
            metadata
        )
        
        # Make decision
        if fraud_result.action == "block":
            return {
                "allowed": False,
                "reason": fraud_result.block_reason,
                "requires_3ds": False,
                "risk_score": fraud_result.risk_score
            }
        elif fraud_result.action == "3d_secure":
            return {
                "allowed": True,
                "requires_3ds": True,
                "reason": "Additional authentication required",
                "risk_score": fraud_result.risk_score
            }
        elif fraud_result.action == "review":
            return {
                "allowed": True,
                "requires_3ds": fraud_result.requires_3ds,
                "requires_review": True,
                "reason": "Payment flagged for review",
                "risk_score": fraud_result.risk_score
            }
        else:  # allow
            return {
                "allowed": True,
                "requires_3ds": fraud_result.requires_3ds,
                "reason": "Payment approved",
                "risk_score": fraud_result.risk_score
            }
