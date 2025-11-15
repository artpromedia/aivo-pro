"""
Customer churn prediction
"""
from typing import Dict, List
import logging

from .db import Database, database

logger = logging.getLogger(__name__)


class ChurnPredictor:
    """Predict customer churn risk using live platform metrics."""

    def __init__(self, db: Database | None = None):
        self._db = db or database

    async def predict_churn(self, customer_id: str) -> Dict:
        """
        Predict churn probability for customer

        Args:
            customer_id: Customer ID

        Returns:
            Churn prediction with probability and factors
        """
        data = await self._get_customer_metrics(customer_id)

        # Calculate churn probability based on factors
        probability = self._calculate_churn_probability(data)

        # Determine risk level
        if probability < 0.3:
            risk_level = "low"
        elif probability < 0.7:
            risk_level = "medium"
        else:
            risk_level = "high"

        # Identify contributing factors
        factors = self._identify_churn_factors(data)

        # Generate recommendations
        recommendations = self._generate_recommendations(
            risk_level,
            factors
        )

        return {
            "customer_id": customer_id,
            "churn_probability": probability,
            "risk_level": risk_level,
            "factors": factors,
            "recommended_actions": recommendations
        }

    async def get_high_risk_customers(
        self, threshold: float = 0.7
    ) -> List[Dict]:
        """
        Get list of high-risk customers

        Args:
            threshold: Probability threshold for high risk

        Returns:
            List of high-risk customers
        """
        high_risk = []

        rows = await self._db.fetch(
            """
            SELECT DISTINCT customer_id
            FROM subscriptions
            WHERE status IN ('active', 'trialing', 'past_due')
            LIMIT 200
            """
        )

        customer_ids = [row["customer_id"] for row in rows]

        for customer_id in customer_ids:
            prediction = await self.predict_churn(customer_id)

            if prediction["churn_probability"] >= threshold:
                high_risk.append(prediction)

        return high_risk

    async def _get_customer_metrics(self, customer_id: str) -> Dict:
        """Aggregate behavioral and billing signals for a customer."""
        query = """
            WITH engagement AS (
                SELECT
                    customer_id,
                    COALESCE(
                        EXTRACT(EPOCH FROM (NOW() - last_active_at)) / 86400,
                        999
                    ) AS days_since_login,
                    COALESCE(usage_hours_last_30d, 0)
                        AS usage_hours_last_month,
                    COALESCE(feature_adoption_rate, 0) AS feature_usage_rate,
                    COALESCE(avg_session_minutes, 0) AS session_length_avg,
                    COALESCE(completion_rate, 0) AS completion_rate
                FROM user_analytics
                WHERE customer_id = $1
            ),
            payments AS (
                SELECT
                    COALESCE(
                        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END),
                        0
                    ) AS payment_failures
                FROM invoice_payments
                WHERE customer_id = $1
                  AND occurred_at >= NOW() - INTERVAL '90 days'
            ),
            tickets AS (
                SELECT
                    COALESCE(
                        COUNT(*) FILTER (WHERE status != 'resolved'),
                        0
                    ) AS support_tickets
                FROM support_tickets
                WHERE customer_id = $1
                  AND created_at >= NOW() - INTERVAL '90 days'
            )
            SELECT
                COALESCE(engagement.days_since_login, 999) AS days_since_login,
                COALESCE(engagement.usage_hours_last_month, 0)
                    AS usage_hours_last_month,
                COALESCE(payments.payment_failures, 0) AS payment_failures,
                COALESCE(tickets.support_tickets, 0) AS support_tickets,
                COALESCE(engagement.feature_usage_rate, 0)
                    AS feature_usage_rate,
                COALESCE(engagement.session_length_avg, 0)
                    AS session_length_avg,
                COALESCE(engagement.completion_rate, 0) AS completion_rate
            FROM engagement
            FULL OUTER JOIN payments ON TRUE
            FULL OUTER JOIN tickets ON TRUE
        """

        record = await self._db.fetchrow(query, customer_id)

        if not record:
            return {
                "days_since_login": 999,
                "usage_hours_last_month": 0,
                "payment_failures": 0,
                "support_tickets": 0,
                "feature_usage_rate": 0.0,
                "session_length_avg": 0,
                "completion_rate": 0.0,
            }

        return {
            "days_since_login": float(record["days_since_login"]),
            "usage_hours_last_month": float(record["usage_hours_last_month"]),
            "payment_failures": int(record["payment_failures"]),
            "support_tickets": int(record["support_tickets"]),
            "feature_usage_rate": float(record["feature_usage_rate"]),
            "session_length_avg": float(record["session_length_avg"]),
            "completion_rate": float(record["completion_rate"]),
        }

    def _calculate_churn_probability(self, data: Dict) -> float:
        """
        Calculate churn probability from metrics

        Weighted scoring based on key indicators
        """
        score = 0.0

        # Inactivity (30% weight)
        if data["days_since_login"] > 30:
            score += 0.3
        elif data["days_since_login"] > 14:
            score += 0.15

        # Low usage (25% weight)
        if data["usage_hours_last_month"] < 5:
            score += 0.25
        elif data["usage_hours_last_month"] < 10:
            score += 0.125

        # Payment issues (20% weight)
        if data["payment_failures"] > 2:
            score += 0.2
        elif data["payment_failures"] > 0:
            score += 0.1

        # Support tickets (15% weight)
        if data["support_tickets"] > 3:
            score += 0.15
        elif data["support_tickets"] > 1:
            score += 0.075

        # Low feature adoption (10% weight)
        if data["feature_usage_rate"] < 0.3:
            score += 0.1

        return min(score, 1.0)

    def _identify_churn_factors(self, data: Dict) -> List[str]:
        """Identify contributing factors"""
        factors = []

        if data["days_since_login"] > 14:
            factors.append("Inactivity - No login in 2+ weeks")

        if data["usage_hours_last_month"] < 10:
            factors.append("Low usage - Under 10 hours last month")

        if data["payment_failures"] > 0:
            factors.append(
                f"Payment issues - {data['payment_failures']} failures"
            )

        if data["support_tickets"] > 1:
            factors.append(
                f"Multiple support tickets - {data['support_tickets']}"
            )

        if data["feature_usage_rate"] < 0.5:
            factors.append("Low feature adoption")

        if data["completion_rate"] < 0.7:
            factors.append("Low completion rate for activities")

        return factors

    def _generate_recommendations(
        self,
        risk_level: str,
        factors: List[str]
    ) -> List[str]:
        """Generate action recommendations"""
        recommendations = []

        if risk_level == "high":
            recommendations.append(
                "Urgent: Schedule personal outreach call"
            )
            recommendations.append(
                "Offer 1-month discount or extended trial"
            )

        if "Inactivity" in str(factors):
            recommendations.append(
                "Send re-engagement email with feature highlights"
            )
            recommendations.append(
                "Trigger personalized learning path suggestions"
            )

        if "Low usage" in str(factors):
            recommendations.append(
                "Provide onboarding assistance"
            )
            recommendations.append(
                "Share success stories and best practices"
            )

        if "Payment issues" in str(factors):
            recommendations.append(
                "Contact regarding payment method update"
            )

        if "support tickets" in str(factors):
            recommendations.append(
                "Follow up on support resolution"
            )
            recommendations.append(
                "Assign dedicated success manager"
            )

        if "Low feature adoption" in str(factors):
            recommendations.append(
                "Offer personalized training session"
            )
            recommendations.append(
                "Send feature education content"
            )

        return recommendations
