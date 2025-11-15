"""
Dynamic Pricing Engine with ML
Revenue optimization following Stripe's pricing research
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from decimal import Decimal
import numpy as np
from scipy import stats
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler


class DynamicPricingEngine:
    """
    ML-powered dynamic pricing optimization
    Based on price elasticity and customer segments
    """

    def __init__(self):
        self.elasticity_model = None
        self.scaler = StandardScaler()

        # Pricing boundaries
        self.min_discount = 0.0  # 0%
        self.max_discount = 0.3  # 30%

        # Segment multipliers
        self.segment_factors = {
            "high_value": 1.15,      # Premium pricing
            "medium_value": 1.0,     # Standard pricing
            "low_value": 0.85,       # Discounted pricing
            "at_risk": 0.75,         # Retention pricing
            "new_customer": 0.90     # Acquisition pricing
        }

    async def calculate_price(
        self,
        base_price: int,
        customer_id: str,
        tier: str,
        metadata: Dict
    ) -> int:
        """
        Calculate optimized price for customer
        Returns price in cents
        """
        # Get customer segment
        segment = await self._determine_customer_segment(
            customer_id,
            metadata
        )

        # Apply segment factor
        segment_multiplier = self.segment_factors.get(segment, 1.0)
        adjusted_price = base_price * segment_multiplier

        # Check for promotional period
        if self._is_promotional_period():
            adjusted_price *= 0.95  # 5% promotional discount

        # Round to nearest dollar
        return int(round(adjusted_price / 100) * 100)

    async def _determine_customer_segment(
        self,
        customer_id: str,
        metadata: Dict
    ) -> str:
        """Determine customer value segment"""

        # New customer detection
        if metadata.get("account_age_days", 0) < 30:
            return "new_customer"

        # High value indicators
        high_value_score = 0
        if metadata.get("referrals", 0) > 3:
            high_value_score += 1
        if metadata.get("engagement_score", 0) > 0.8:
            high_value_score += 1
        if metadata.get("payment_history_score", 0) > 0.9:
            high_value_score += 1

        if high_value_score >= 2:
            return "high_value"

        # At-risk detection
        if metadata.get("churn_risk", 0) > 0.7:
            return "at_risk"

        # Default to medium
        return "medium_value"

    def _is_promotional_period(self) -> bool:
        """Check if in promotional period"""
        now = datetime.utcnow()

        # Back to school: August-September
        if now.month in [8, 9]:
            return True

        # Holiday season: November-December
        if now.month in [11, 12]:
            return True

        return False

    async def calculate_price_elasticity(
        self,
        historical_data: pd.DataFrame,
        segment: str
    ) -> float:
        """
        Calculate price elasticity of demand
        Using log-log regression
        """
        if len(historical_data) < 30:
            # Not enough data, return default
            return -1.5  # Typical SaaS elasticity

        # Prepare data
        historical_data['log_price'] = np.log(historical_data['price'])
        historical_data['log_quantity'] = np.log(historical_data['quantity'])

        # Linear regression on log-transformed data
        slope, intercept, r_value, p_value, std_err = stats.linregress(
            historical_data['log_price'],
            historical_data['log_quantity']
        )

        # Elasticity is the slope
        elasticity = slope

        return elasticity

    async def simulate_pricing_change(
        self,
        current_price: int,
        price_change: float,
        elasticity: float,
        current_customers: int
    ) -> Dict:
        """
        Simulate impact of price change on revenue
        """
        # Calculate new price
        new_price = current_price * (1 + price_change)

        # Calculate expected demand change
        quantity_change = elasticity * price_change
        new_customers = int(current_customers * (1 + quantity_change))

        # Calculate revenues
        current_revenue = current_price * current_customers
        projected_revenue = new_price * new_customers

        # Calculate lift
        revenue_lift = (projected_revenue - current_revenue) / current_revenue

        # Confidence based on elasticity reliability
        confidence = min(abs(elasticity) / 2.0, 0.95)

        return {
            "price": int(new_price),
            "projected_customers": new_customers,
            "projected_revenue": projected_revenue,
            "revenue_lift": revenue_lift,
            "confidence": confidence
        }

    def generate_pricing_recommendation(
        self,
        simulation_results: Dict
    ) -> str:
        """Generate human-readable recommendation"""

        lift = simulation_results["revenue_lift"]
        confidence = simulation_results["confidence"]

        if lift > 0.1 and confidence > 0.7:
            return f"Strong recommendation: Increase price by {abs(lift)*100:.1f}% (high confidence)"
        elif lift > 0.05 and confidence > 0.5:
            return f"Moderate recommendation: Increase price by {abs(lift)*100:.1f}% (medium confidence)"
        elif lift < -0.05:
            return f"Caution: Price increase may reduce revenue by {abs(lift)*100:.1f}%"
        else:
            return "Current pricing appears optimal"


class VolumeDiscountCalculator:
    """
    Calculate volume-based discounts for districts
    """

    def __init__(self):
        self.discount_tiers = {
            100: 0.10,    # 10% at 100+ seats
            500: 0.15,    # 15% at 500+ seats
            1000: 0.20,   # 20% at 1,000+ seats
            5000: 0.25,   # 25% at 5,000+ seats
            10000: 0.30   # 30% at 10,000+ seats
        }

    def calculate_discount(self, seat_count: int) -> float:
        """Calculate discount rate based on seat count"""

        discount = 0.0

        for tier_seats, tier_discount in sorted(
            self.discount_tiers.items(),
            reverse=True
        ):
            if seat_count >= tier_seats:
                discount = tier_discount
                break

        return discount

    def calculate_tiered_pricing(
        self,
        seat_count: int,
        base_price_per_seat: float
    ) -> Dict:
        """
        Calculate tiered pricing with breakdown
        """
        tiers = []
        remaining_seats = seat_count
        total_cost = 0

        sorted_tiers = sorted(self.discount_tiers.items())

        for i, (tier_size, discount_rate) in enumerate(sorted_tiers):
            if remaining_seats <= 0:
                break

            # Determine seats in this tier
            if i < len(sorted_tiers) - 1:
                next_tier_size = sorted_tiers[i + 1][0]
                tier_seats = min(
                    remaining_seats,
                    next_tier_size - tier_size
                )
            else:
                tier_seats = remaining_seats

            # Calculate cost for this tier
            discounted_price = base_price_per_seat * (1 - discount_rate)
            tier_cost = tier_seats * discounted_price

            tiers.append({
                "seats": tier_seats,
                "price_per_seat": discounted_price,
                "discount_rate": discount_rate,
                "tier_total": tier_cost
            })

            total_cost += tier_cost
            remaining_seats -= tier_seats

        return {
            "total_seats": seat_count,
            "total_cost": total_cost,
            "average_per_seat": total_cost / seat_count,
            "tiers": tiers
        }


class ABTestManager:
    """
    A/B testing for pricing experiments
    """

    def __init__(self):
        self.active_tests = {}

    async def create_test(
        self,
        test_name: str,
        control_price: int,
        variant_price: int,
        allocation: float = 0.5
    ) -> Dict:
        """Create new A/B test"""

        test_id = f"test_{test_name}_{datetime.utcnow().timestamp()}"

        test_config = {
            "test_id": test_id,
            "test_name": test_name,
            "control_price": control_price,
            "variant_price": variant_price,
            "allocation": allocation,
            "started_at": datetime.utcnow(),
            "status": "active",
            "results": {
                "control": {"conversions": 0, "revenue": 0, "visitors": 0},
                "variant": {"conversions": 0, "revenue": 0, "visitors": 0}
            }
        }

        self.active_tests[test_id] = test_config

        return test_config

    def assign_variant(
        self,
        test_id: str,
        user_id: str
    ) -> str:
        """Assign user to control or variant"""

        test = self.active_tests.get(test_id)
        if not test:
            return "control"

        # Consistent hashing for same user
        user_hash = hash(user_id) % 100

        if user_hash < test["allocation"] * 100:
            return "variant"
        else:
            return "control"

    def record_conversion(
        self,
        test_id: str,
        variant: str,
        revenue: int
    ):
        """Record conversion event"""

        test = self.active_tests.get(test_id)
        if not test:
            return

        test["results"][variant]["conversions"] += 1
        test["results"][variant]["revenue"] += revenue

    def calculate_significance(
        self,
        test_id: str
    ) -> Dict:
        """
        Calculate statistical significance using t-test
        """
        test = self.active_tests.get(test_id)
        if not test:
            return {}

        control = test["results"]["control"]
        variant = test["results"]["variant"]

        # Conversion rates
        control_rate = (
            control["conversions"] / control["visitors"]
            if control["visitors"] > 0 else 0
        )
        variant_rate = (
            variant["conversions"] / variant["visitors"]
            if variant["visitors"] > 0 else 0
        )

        # Revenue per visitor
        control_rpv = (
            control["revenue"] / control["visitors"]
            if control["visitors"] > 0 else 0
        )
        variant_rpv = (
            variant["revenue"] / variant["visitors"]
            if variant["visitors"] > 0 else 0
        )

        # Calculate lift
        conversion_lift = (
            (variant_rate - control_rate) / control_rate
            if control_rate > 0 else 0
        )
        revenue_lift = (
            (variant_rpv - control_rpv) / control_rpv
            if control_rpv > 0 else 0
        )

        # Simple significance check (needs more visitors for accurate p-value)
        min_sample_size = 100
        has_significance = (
            control["visitors"] >= min_sample_size and
            variant["visitors"] >= min_sample_size and
            abs(conversion_lift) > 0.05  # 5% minimum lift
        )

        return {
            "test_id": test_id,
            "control_conversion_rate": control_rate,
            "variant_conversion_rate": variant_rate,
            "conversion_lift": conversion_lift,
            "control_revenue_per_visitor": control_rpv,
            "variant_revenue_per_visitor": variant_rpv,
            "revenue_lift": revenue_lift,
            "is_significant": has_significance,
            "recommendation": self._generate_recommendation(
                conversion_lift,
                revenue_lift,
                has_significance
            )
        }

    def _generate_recommendation(
        self,
        conversion_lift: float,
        revenue_lift: float,
        is_significant: bool
    ) -> str:
        """Generate recommendation based on results"""

        if not is_significant:
            return "Continue test - need more data for significance"

        if revenue_lift > 0.1:
            return f"Winner: Variant increases revenue by {revenue_lift*100:.1f}%"
        elif revenue_lift < -0.05:
            return f"Keep control - Variant decreases revenue by {abs(revenue_lift)*100:.1f}%"
        else:
            return "No significant difference - keep control"
