"""
Revenue Analytics Engine
SaaS metrics following Stripe Atlas and ChartMogul best practices
"""

from typing import Dict, List
from datetime import datetime, timedelta
from decimal import Decimal
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import pandas as pd


class RevenueAnalytics:
    """
    Comprehensive SaaS revenue analytics
    MRR components, LTV, churn, cohort analysis
    """
    
    def __init__(self, db):
        self.db = db
        self.ltv_model = None
        self.scaler = StandardScaler()
    
    async def calculate_mrr_components(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """
        Calculate MRR with full breakdown:
        - New MRR: From new subscriptions
        - Expansion MRR: From upgrades
        - Contraction MRR: From downgrades
        - Churn MRR: From cancellations
        - Reactivation MRR: From reactivated subscriptions
        """
        
        # Get all subscription events in period
        query = """
            SELECT 
                id,
                customer_id,
                stripe_subscription_id,
                tier,
                status,
                price_cents,
                billing_period_months,
                created_at,
                updated_at,
                canceled_at,
                trial_end
            FROM subscriptions
            WHERE created_at >= $1 OR updated_at >= $1
            ORDER BY created_at
        """
        
        subscriptions = await self.db.fetch(query, start_date)
        
        # Initialize MRR components
        new_mrr = 0
        expansion_mrr = 0
        contraction_mrr = 0
        churn_mrr = 0
        reactivation_mrr = 0
        
        # Track previous state per customer
        customer_states = {}
        
        for sub in subscriptions:
            customer_id = sub['customer_id']
            monthly_value = self._normalize_to_monthly(
                sub['price_cents'],
                sub['billing_period_months']
            )
            
            # Get previous state
            prev_state = customer_states.get(customer_id)
            
            if sub['status'] == 'active':
                if not prev_state:
                    # New subscription
                    new_mrr += monthly_value
                elif prev_state['status'] == 'canceled':
                    # Reactivation
                    reactivation_mrr += monthly_value
                elif prev_state['monthly_value'] < monthly_value:
                    # Expansion (upgrade)
                    expansion_mrr += (monthly_value - prev_state['monthly_value'])
                elif prev_state['monthly_value'] > monthly_value:
                    # Contraction (downgrade)
                    contraction_mrr += (prev_state['monthly_value'] - monthly_value)
            
            elif sub['status'] == 'canceled' and prev_state:
                # Churn
                churn_mrr += prev_state.get('monthly_value', 0)
            
            # Update state
            customer_states[customer_id] = {
                'status': sub['status'],
                'monthly_value': monthly_value
            }
        
        # Calculate net new MRR
        net_new_mrr = (
            new_mrr +
            expansion_mrr +
            reactivation_mrr -
            contraction_mrr -
            churn_mrr
        )
        
        # Get current total MRR
        total_mrr = await self._calculate_total_mrr()
        
        return {
            "period_start": start_date.isoformat(),
            "period_end": end_date.isoformat(),
            "new_mrr": new_mrr / 100,  # Convert to dollars
            "expansion_mrr": expansion_mrr / 100,
            "reactivation_mrr": reactivation_mrr / 100,
            "contraction_mrr": contraction_mrr / 100,
            "churn_mrr": churn_mrr / 100,
            "net_new_mrr": net_new_mrr / 100,
            "total_mrr": total_mrr / 100,
            "growth_rate": (net_new_mrr / total_mrr) if total_mrr > 0 else 0
        }
    
    def _normalize_to_monthly(self, price_cents: int, billing_months: int) -> int:
        """Convert any billing period to monthly value"""
        return price_cents // billing_months
    
    async def _calculate_total_mrr(self) -> int:
        """Calculate current total MRR"""
        query = """
            SELECT 
                SUM(price_cents / billing_period_months) as total_mrr
            FROM subscriptions
            WHERE status = 'active'
        """
        result = await self.db.fetchrow(query)
        return result['total_mrr'] or 0
    
    async def predict_ltv(
        self,
        customer_id: str,
        features: Dict
    ) -> float:
        """
        Predict Customer Lifetime Value using ML
        Features: tenure, engagement, payment history, etc.
        """
        
        # Prepare features
        feature_vector = self._prepare_ltv_features(features)
        
        # If model not trained, use rule-based estimation
        if not self.ltv_model:
            return self._estimate_ltv_rule_based(features)
        
        # Use ML model
        scaled_features = self.scaler.transform([feature_vector])
        predicted_ltv = self.ltv_model.predict(scaled_features)[0]
        
        return max(predicted_ltv, 0)  # LTV can't be negative
    
    def _prepare_ltv_features(self, features: Dict) -> List[float]:
        """Prepare feature vector for LTV prediction"""
        return [
            features.get('account_age_months', 0),
            features.get('monthly_revenue', 0),
            features.get('engagement_score', 0),
            features.get('payment_success_rate', 1.0),
            features.get('support_tickets', 0),
            features.get('referrals_made', 0),
            features.get('feature_adoption_score', 0),
            1 if features.get('has_family_plan') else 0,
        ]
    
    def _estimate_ltv_rule_based(self, features: Dict) -> float:
        """
        Rule-based LTV estimation
        LTV = Monthly Revenue × Avg Lifetime (months)
        """
        monthly_revenue = features.get('monthly_revenue', 0)
        
        # Estimate lifetime based on engagement
        engagement_score = features.get('engagement_score', 0.5)
        
        # Base lifetime: 12 months
        # Adjust by engagement: 6-24 months range
        estimated_lifetime_months = 12 + (engagement_score - 0.5) * 24
        estimated_lifetime_months = max(6, min(24, estimated_lifetime_months))
        
        ltv = monthly_revenue * estimated_lifetime_months
        
        return ltv
    
    async def train_ltv_model(self, historical_data: pd.DataFrame):
        """
        Train LTV prediction model
        Requires historical customer data with actual LTV
        """
        if len(historical_data) < 100:
            # Not enough data for training
            return
        
        # Prepare features and target
        X = historical_data[[
            'account_age_months',
            'monthly_revenue',
            'engagement_score',
            'payment_success_rate',
            'support_tickets',
            'referrals_made',
            'feature_adoption_score',
            'has_family_plan'
        ]].values
        
        y = historical_data['actual_ltv'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.ltv_model = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        
        self.ltv_model.fit(X_scaled, y)
    
    async def calculate_churn_risk(
        self,
        customer_id: str,
        features: Dict
    ) -> Dict:
        """
        Calculate churn risk score (0-1)
        Returns score and contributing factors
        """
        
        risk_score = 0.0
        risk_factors = []
        
        # Low engagement
        engagement = features.get('engagement_score', 0.5)
        if engagement < 0.3:
            risk_score += 0.3
            risk_factors.append({
                "factor": "low_engagement",
                "weight": 0.3,
                "detail": f"Engagement score {engagement:.2f} is below threshold"
            })
        
        # Failed payments
        failed_payments = features.get('failed_payment_count', 0)
        if failed_payments > 0:
            payment_risk = min(failed_payments * 0.2, 0.4)
            risk_score += payment_risk
            risk_factors.append({
                "factor": "payment_failures",
                "weight": payment_risk,
                "detail": f"{failed_payments} failed payment(s)"
            })
        
        # Low feature usage
        feature_adoption = features.get('feature_adoption_score', 0.5)
        if feature_adoption < 0.4:
            risk_score += 0.2
            risk_factors.append({
                "factor": "low_feature_usage",
                "weight": 0.2,
                "detail": f"Using {feature_adoption*100:.0f}% of features"
            })
        
        # Support issues
        support_tickets = features.get('support_tickets', 0)
        if support_tickets > 3:
            risk_score += 0.15
            risk_factors.append({
                "factor": "support_issues",
                "weight": 0.15,
                "detail": f"{support_tickets} support tickets"
            })
        
        # Trial ending soon
        days_until_trial_end = features.get('days_until_trial_end')
        if days_until_trial_end is not None and days_until_trial_end < 3:
            risk_score += 0.25
            risk_factors.append({
                "factor": "trial_ending",
                "weight": 0.25,
                "detail": f"Trial ends in {days_until_trial_end} days"
            })
        
        # Cap at 1.0
        risk_score = min(risk_score, 1.0)
        
        # Determine risk level
        if risk_score > 0.7:
            risk_level = "critical"
            recommended_action = "immediate_intervention"
        elif risk_score > 0.5:
            risk_level = "high"
            recommended_action = "proactive_outreach"
        elif risk_score > 0.3:
            risk_level = "medium"
            recommended_action = "monitor_closely"
        else:
            risk_level = "low"
            recommended_action = "continue_monitoring"
        
        return {
            "customer_id": customer_id,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommended_action": recommended_action
        }
    
    async def cohort_analysis(
        self,
        start_date: datetime,
        months: int = 12
    ) -> Dict:
        """
        Cohort analysis by signup month
        Track revenue retention over time
        """
        
        cohorts = {}
        
        for month_offset in range(months):
            cohort_start = start_date + timedelta(days=30 * month_offset)
            cohort_end = cohort_start + timedelta(days=30)
            
            # Get customers who signed up in this cohort
            query = """
                SELECT id, customer_id, price_cents, billing_period_months
                FROM subscriptions
                WHERE created_at >= $1 AND created_at < $2
                AND status = 'active'
            """
            
            cohort_subs = await self.db.fetch(query, cohort_start, cohort_end)
            
            if not cohort_subs:
                continue
            
            # Calculate initial MRR
            initial_mrr = sum(
                self._normalize_to_monthly(
                    sub['price_cents'],
                    sub['billing_period_months']
                )
                for sub in cohort_subs
            )
            
            # Track retention for each month
            retention_data = []
            
            for retention_month in range(months - month_offset):
                check_date = cohort_start + timedelta(days=30 * retention_month)
                
                # Count still-active subscriptions
                active_query = """
                    SELECT COUNT(*), SUM(price_cents / billing_period_months)
                    FROM subscriptions
                    WHERE customer_id = ANY($1)
                    AND status = 'active'
                    AND created_at <= $2
                """
                
                customer_ids = [sub['customer_id'] for sub in cohort_subs]
                result = await self.db.fetchrow(active_query, customer_ids, check_date)
                
                active_count = result[0] or 0
                retained_mrr = result[1] or 0
                
                retention_data.append({
                    "month": retention_month,
                    "active_customers": active_count,
                    "retained_mrr": retained_mrr / 100,
                    "retention_rate": active_count / len(cohort_subs),
                    "mrr_retention": retained_mrr / initial_mrr if initial_mrr > 0 else 0
                })
            
            cohorts[cohort_start.strftime('%Y-%m')] = {
                "cohort_size": len(cohort_subs),
                "initial_mrr": initial_mrr / 100,
                "retention": retention_data
            }
        
        return cohorts
    
    async def calculate_arpu(self, segment: str = None) -> float:
        """
        Calculate Average Revenue Per User
        Optionally filtered by segment
        """
        
        query = """
            SELECT AVG(price_cents / billing_period_months) as arpu
            FROM subscriptions
            WHERE status = 'active'
        """
        
        if segment:
            query += f" AND tier = '{segment}'"
        
        result = await self.db.fetchrow(query)
        arpu_cents = result['arpu'] or 0
        
        return arpu_cents / 100  # Convert to dollars
    
    async def calculate_quick_ratio(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> float:
        """
        Calculate SaaS Quick Ratio
        (New MRR + Expansion MRR) / (Contraction MRR + Churn MRR)
        
        > 4.0 is excellent growth
        1.0-4.0 is healthy
        < 1.0 is concerning
        """
        
        components = await self.calculate_mrr_components(start_date, end_date)
        
        new_and_expansion = (
            components['new_mrr'] +
            components['expansion_mrr']
        )
        
        contraction_and_churn = (
            components['contraction_mrr'] +
            components['churn_mrr']
        )
        
        if contraction_and_churn == 0:
            return float('inf')  # Infinite growth
        
        quick_ratio = new_and_expansion / contraction_and_churn
        
        return quick_ratio
