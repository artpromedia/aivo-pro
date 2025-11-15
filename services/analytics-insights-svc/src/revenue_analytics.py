"""Revenue analytics calculator backed by subscriptions data."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

from .db import Database, database
from .time_windows import resolve_time_window

logger = logging.getLogger(__name__)


class RevenueAnalyzer:
    """Calculate revenue metrics and forecasts."""

    def __init__(self, db: Optional[Database] = None) -> None:
        self.db = db or database

    async def calculate_metrics(self, time_range: str) -> Dict:
        """Calculate revenue metrics for the requested window."""

        start, end, _ = resolve_time_window(time_range)

        active_row = await self.db.fetchrow(
            """
            SELECT
                SUM(price_cents / billing_period_months) AS active_mrr,
                COUNT(*) AS active_subscriptions
            FROM subscriptions
            WHERE status = 'active'
            """
        )

        new_row = await self.db.fetchrow(
            """
            SELECT COUNT(*) AS new_subscriptions
            FROM subscriptions
            WHERE created_at >= $1 AND created_at < $2
            """,
            start,
            end,
        )

        canceled_row = await self.db.fetchrow(
            """
            SELECT COUNT(*) AS canceled_subscriptions
            FROM subscriptions
            WHERE status = 'canceled'
              AND canceled_at IS NOT NULL
              AND canceled_at >= $1
              AND canceled_at < $2
            """,
            start,
            end,
        )

        churn_row = await self.db.fetchrow(
            """
            SELECT
                SUM(price_cents / billing_period_months) AS churned_mrr,
                COUNT(*) AS churned_subscriptions
            FROM subscriptions
            WHERE status = 'canceled'
              AND canceled_at IS NOT NULL
              AND canceled_at >= $1
              AND canceled_at < $2
            """,
            start,
            end,
        )

        active_mrr_cents = (active_row or {}).get("active_mrr", 0) or 0
        active_subs = (active_row or {}).get("active_subscriptions", 0) or 0
        churned_subs = (
            (churn_row or {}).get("churned_subscriptions", 0) or 0
        )

        churn_rate = (
            (churned_subs / active_subs) * 100 if active_subs else 0.0
        )

        mrr = round(active_mrr_cents / 100, 2)
        arr = round(mrr * 12, 2)
        arpu = round(
            (mrr / active_subs) if active_subs else 0.0,
            2,
        )

        ltv = 0.0
        monthly_churn = churn_rate / 100 or 0
        if monthly_churn > 0 and arpu > 0:
            ltv = round(arpu / monthly_churn, 2)
        elif arpu:
            ltv = round(arpu * 12, 2)

        return {
            "mrr": mrr,
            "arr": arr,
            "arpu": arpu,
            "ltv": ltv,
            "churn_rate": round(churn_rate, 2),
            "new_subscriptions": int(
                (new_row or {}).get("new_subscriptions", 0)
            ),
            "canceled_subscriptions": int(
                (canceled_row or {}).get("canceled_subscriptions", 0)
            ),
        }

    async def generate_forecast(self, months: int) -> List[Dict]:
        """Generate a revenue forecast using recent MRR trends."""

        history_start = datetime.utcnow() - timedelta(days=180)
        history = await self.db.fetch(
            """
            SELECT
                date_trunc('month', created_at) AS month,
                SUM(price_cents / billing_period_months) AS mrr_cents
            FROM subscriptions
            WHERE created_at >= $1
            GROUP BY month
            ORDER BY month
            """,
            history_start,
        )

        if not history:
            # No history yet; project flat using current MRR
            current_metrics = await self.calculate_metrics("month")
            base_mrr = current_metrics["mrr"]
            growth = 0.0
        else:
            mrr_values = [row["mrr_cents"] / 100 for row in history]
            base_mrr = mrr_values[-1]
            growth_rates = []
            for idx in range(1, len(mrr_values)):
                prev = mrr_values[idx - 1]
                if prev > 0:
                    growth_rates.append(
                        (mrr_values[idx] - prev) / prev
                    )
            growth = (
                sum(growth_rates) / len(growth_rates)
                if growth_rates
                else 0.02
            )

        forecast = []
        projected_mrr = base_mrr

        for month in range(1, months + 1):
            projected_mrr *= (1 + growth)
            forecast.append({
                "month": month,
                "projected_mrr": round(projected_mrr, 2),
                "projected_arr": round(projected_mrr * 12, 2),
            })

        return forecast
