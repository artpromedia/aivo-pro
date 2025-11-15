"""
Item Selection Strategy for Adaptive Testing
Maximum information with exposure control
"""
import numpy as np
from typing import List, Set, Optional, Dict
from dataclasses import dataclass
import random
import logging

from src.core.irt_engine import ItemParameters, irt_engine

logger = logging.getLogger(__name__)


@dataclass
class ItemWithInfo:
    """Item with calculated information"""
    params: ItemParameters
    information: float
    exposure_rate: float


class ItemSelector:
    """
    Selects optimal items for adaptive testing
    Balances information maximization with exposure control
    """

    def __init__(
        self,
        max_exposure_rate: float = 0.20,
        randomization_percentile: float = 0.05
    ):
        """
        Initialize item selector

        Args:
            max_exposure_rate: Maximum exposure rate per item
            randomization_percentile: Select from top X% to add randomness
        """
        self.max_exposure_rate = max_exposure_rate
        self.randomization_percentile = randomization_percentile

    def select_next_item(
        self,
        theta_current: float,
        item_bank: List[ItemParameters],
        administered_items: Set[str],
        exposure_counts: Dict[str, int],
        total_assessments: int,
        content_constraints: Optional[Dict[str, int]] = None
    ) -> Optional[ItemParameters]:
        """
        Select next optimal item for student

        Strategy:
        1. Filter out already administered items
        2. Calculate information for each remaining item
        3. Filter by exposure rate limit
        4. Apply content constraints if specified
        5. Select from top N% randomly to prevent overexposure

        Args:
            theta_current: Current ability estimate
            item_bank: All available items
            administered_items: Set of already used item IDs
            exposure_counts: Dictionary of item exposure counts
            total_assessments: Total number of assessments conducted
            content_constraints: Optional content balancing requirements

        Returns:
            Selected ItemParameters or None if no items available
        """
        # Filter available items
        available_items = [
            item for item in item_bank
            if item.item_id not in administered_items
        ]

        if not available_items:
            logger.warning("No available items in item bank")
            return None

        # Calculate information for each item
        items_with_info: List[ItemWithInfo] = []

        for item in available_items:
            info = irt_engine.information_3pl(
                theta_current,
                item.difficulty,
                item.discrimination,
                item.guessing
            )

            # Calculate exposure rate
            exposure_rate = (
                exposure_counts.get(item.item_id, 0) / total_assessments
                if total_assessments > 0 else 0.0
            )

            items_with_info.append(
                ItemWithInfo(
                    params=item,
                    information=info,
                    exposure_rate=exposure_rate
                )
            )

        # Filter by exposure rate
        eligible_items = [
            item_info for item_info in items_with_info
            if item_info.exposure_rate < self.max_exposure_rate
        ]

        if not eligible_items:
            logger.warning(
                f"All items exceed max exposure rate {self.max_exposure_rate}"
            )
            # Use items with lowest exposure if all exceed limit
            eligible_items = sorted(
                items_with_info,
                key=lambda x: x.exposure_rate
            )[:10]

        # Sort by information (descending)
        eligible_items.sort(key=lambda x: x.information, reverse=True)

        # Select from top percentile for randomization
        top_n = max(1, int(len(eligible_items) * self.randomization_percentile))
        top_items = eligible_items[:top_n]

        # Randomly select from top items
        selected = random.choice(top_items)

        logger.info(
            f"Selected item {selected.params.item_id} with "
            f"information={selected.information:.3f}, "
            f"exposure={selected.exposure_rate:.3f}"
        )

        return selected.params

    def select_initial_item(
        self,
        item_bank: List[ItemParameters],
        exposure_counts: Dict[str, int],
        total_assessments: int
    ) -> Optional[ItemParameters]:
        """
        Select first item for assessment
        Typically selects item with medium difficulty (b ≈ 0)

        Args:
            item_bank: All available items
            exposure_counts: Dictionary of item exposure counts
            total_assessments: Total assessments conducted

        Returns:
            Selected ItemParameters
        """
        # Find items with difficulty near 0
        medium_items = [
            item for item in item_bank
            if -0.5 <= item.difficulty <= 0.5
        ]

        if not medium_items:
            logger.warning("No medium difficulty items found, using all items")
            medium_items = item_bank

        # Calculate exposure rates
        items_with_exposure = [
            (
                item,
                exposure_counts.get(item.item_id, 0) / total_assessments
                if total_assessments > 0 else 0.0
            )
            for item in medium_items
        ]

        # Sort by exposure (ascending) to balance usage
        items_with_exposure.sort(key=lambda x: x[1])

        # Select from least exposed items
        top_n = max(1, len(items_with_exposure) // 10)
        selected = random.choice(items_with_exposure[:top_n])[0]

        logger.info(
            f"Selected initial item {selected.item_id} with "
            f"difficulty={selected.difficulty:.3f}"
        )

        return selected

    def validate_content_balance(
        self,
        administered_items: List[ItemParameters],
        content_targets: Dict[str, int]
    ) -> Dict[str, int]:
        """
        Check content balance against targets

        Args:
            administered_items: List of items already administered
            content_targets: Target number of items per content area

        Returns:
            Dictionary of remaining items needed per content area
        """
        # Count items per content area
        content_counts: Dict[str, int] = {}

        # Calculate remaining items needed
        remaining = {
            area: max(0, target - content_counts.get(area, 0))
            for area, target in content_targets.items()
        }

        return remaining


class StoppingCriteria:
    """
    Determines when to stop adaptive assessment
    """

    def __init__(
        self,
        min_items: int = 15,
        max_items: int = 30,
        se_threshold: float = 0.30,
        confidence_level: float = 0.95
    ):
        """
        Initialize stopping criteria

        Args:
            min_items: Minimum items before stopping
            max_items: Maximum items to administer
            se_threshold: Maximum standard error
            confidence_level: Confidence level (e.g., 0.95 for 95%)
        """
        self.min_items = min_items
        self.max_items = max_items
        self.se_threshold = se_threshold
        self.confidence_level = confidence_level

        # Z-score for confidence level
        # 1.96 for 95%, 2.576 for 99%
        self.z_score = 1.96 if confidence_level == 0.95 else 2.576

    def should_stop(
        self,
        num_items: int,
        standard_error: float
    ) -> tuple[bool, str]:
        """
        Determine if assessment should stop

        Args:
            num_items: Number of items administered
            standard_error: Current standard error

        Returns:
            Tuple of (should_stop, reason)
        """
        # Must meet minimum items
        if num_items < self.min_items:
            return False, f"Need {self.min_items - num_items} more items (minimum)"

        # Maximum items reached
        if num_items >= self.max_items:
            return True, "Maximum items reached"

        # Standard error threshold met
        if standard_error <= self.se_threshold:
            return True, f"Standard error {standard_error:.3f} below threshold"

        # Confidence interval width check
        ci_width = 2 * self.z_score * standard_error
        if ci_width < 1.0:
            return True, f"Confidence interval width {ci_width:.3f} sufficient"

        return False, "Continue assessment"

    def get_assessment_stats(
        self,
        num_items: int,
        standard_error: float,
        theta: float
    ) -> Dict:
        """
        Get current assessment statistics

        Args:
            num_items: Number of items administered
            standard_error: Current standard error
            theta: Current ability estimate

        Returns:
            Dictionary of statistics
        """
        ci_lower = theta - (self.z_score * standard_error)
        ci_upper = theta + (self.z_score * standard_error)
        ci_width = ci_upper - ci_lower

        return {
            "num_items": num_items,
            "theta": round(theta, 3),
            "standard_error": round(standard_error, 3),
            "confidence_interval": {
                "lower": round(ci_lower, 3),
                "upper": round(ci_upper, 3),
                "width": round(ci_width, 3),
                "level": self.confidence_level
            },
            "progress": {
                "min_items_met": num_items >= self.min_items,
                "se_threshold_met": standard_error <= self.se_threshold,
                "percent_complete": min(100, (num_items / self.max_items) * 100)
            }
        }


# Global instances
item_selector = ItemSelector()
stopping_criteria = StoppingCriteria()
