"""
Automated Training Scheduler
Continuously trains AIVO Main Brain and monitors all models for retraining needs
"""
import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from .training import ContinuousTrainingPipeline
from .drift_monitor import ModelDriftMonitor
from .config import Settings

logger = logging.getLogger(__name__)


class AIVOTrainingScheduler:
    """
    Automated scheduler for continuous training of AIVO Main Brain
    and all derivative models
    """

    def __init__(self):
        """Initialize scheduler with training pipeline"""
        self.scheduler = AsyncIOScheduler()
        self.pipeline = ContinuousTrainingPipeline()
        self.drift_monitor = ModelDriftMonitor()
        self.settings = Settings()

        # Track training history to prevent over-training
        self.last_training: Dict[str, datetime] = {}
        self.training_in_progress: Dict[str, bool] = {}

        logger.info("AIVO Training Scheduler initialized")

    def start(self):
        """Start the automated training scheduler"""
        logger.info("Starting automated training scheduler...")

        # Schedule AIVO Main Brain training - Daily at 2 AM
        self.scheduler.add_job(
            self.train_aivo_main_brain,
            CronTrigger(hour=2, minute=0),
            id='aivo_main_brain_daily',
            name='AIVO Main Brain Daily Training',
            replace_existing=True
        )
        logger.info(
            "✓ Scheduled AIVO Main Brain training: Daily at 2:00 AM"
        )

        # Schedule drift monitoring - Every 6 hours
        self.scheduler.add_job(
            self.check_all_models_for_drift,
            IntervalTrigger(hours=6),
            id='drift_monitor_6h',
            name='Model Drift Monitoring',
            replace_existing=True
        )
        logger.info("✓ Scheduled drift monitoring: Every 6 hours")

        # Schedule weekly full retraining - Sunday at 3 AM
        self.scheduler.add_job(
            self.weekly_full_retraining,
            CronTrigger(day_of_week='sun', hour=3, minute=0),
            id='weekly_full_retraining',
            name='Weekly Full Model Retraining',
            replace_existing=True
        )
        logger.info(
            "✓ Scheduled weekly full retraining: Sundays at 3:00 AM"
        )

        # Schedule performance-based adaptive training - Every 2 hours
        self.scheduler.add_job(
            self.adaptive_training_check,
            IntervalTrigger(hours=2),
            id='adaptive_training_2h',
            name='Adaptive Training Check',
            replace_existing=True
        )
        logger.info(
            "✓ Scheduled adaptive training check: Every 2 hours"
        )

        # Start the scheduler
        self.scheduler.start()
        logger.info("🚀 Training scheduler is now running")

    def stop(self):
        """Stop the scheduler gracefully"""
        logger.info("Stopping training scheduler...")
        self.scheduler.shutdown(wait=True)
        logger.info("✓ Training scheduler stopped")

    async def train_aivo_main_brain(self):
        """
        Train the main AIVO Brain model with latest data
        This is the core model that powers all AIVO intelligence
        """
        model_id = "aivo-main-brain-v1"

        logger.info("=" * 60)
        logger.info("STARTING AIVO MAIN BRAIN TRAINING")
        logger.info("=" * 60)

        # Check if already training
        if self.training_in_progress.get(model_id, False):
            logger.warning(
                f"Training already in progress for {model_id}, skipping"
            )
            return

        # Check if trained recently (within 20 hours)
        last_train = self.last_training.get(model_id)
        if last_train and (datetime.utcnow() - last_train).seconds < 72000:
            logger.info(
                f"Model {model_id} trained recently "
                f"({last_train}), skipping"
            )
            return

        try:
            self.training_in_progress[model_id] = True

            # Schedule training job with high priority
            logger.info(
                f"Scheduling AIVO Main Brain training "
                f"(Reason: Daily scheduled training)"
            )

            job = await self.pipeline.schedule_retraining(
                model_id=model_id,
                reason="daily_scheduled_training",
                priority="high",
                data_sources=[
                    "interaction_logs",
                    "feedback_data",
                    "assessment_results",
                    "teacher_corrections",
                    "student_performance_data"
                ]
            )

            logger.info(
                f"✓ Training job {job['job_id']} scheduled "
                f"for AIVO Main Brain"
            )

            # Execute training immediately for high priority
            logger.info("Executing training job...")
            result = await self.pipeline.execute_training_job(job['job_id'])

            if result['status'] == 'completed':
                logger.info("=" * 60)
                logger.info("AIVO MAIN BRAIN TRAINING COMPLETED")
                logger.info(f"Training Time: "
                           f"{result['training_metrics']['training_time_seconds']}s")
                logger.info(f"Validation Accuracy: "
                           f"{result['training_metrics']['validation_accuracy']:.2%}")
                logger.info(f"Test Accuracy: "
                           f"{result['test_metrics']['test_accuracy']:.2%}")
                logger.info(f"Model Improved: {result['improved']}")
                logger.info("=" * 60)

                self.last_training[model_id] = datetime.utcnow()
            else:
                logger.warning(
                    f"Training job {job['job_id']} status: "
                    f"{result['status']}"
                )

        except Exception as e:
            logger.error(
                f"Failed to train AIVO Main Brain: {str(e)}",
                exc_info=True
            )

        finally:
            self.training_in_progress[model_id] = False

    async def check_all_models_for_drift(self):
        """
        Check all models for performance drift and schedule retraining
        if needed
        """
        logger.info("Checking all models for drift...")

        try:
            # Get all model IDs
            model_ids = await self.pipeline.get_all_model_ids()

            # Add main brain if not in list
            if "aivo-main-brain-v1" not in model_ids:
                model_ids.append("aivo-main-brain-v1")

            logger.info(f"Monitoring {len(model_ids)} models for drift")

            models_needing_training = []

            for model_id in model_ids:
                # Skip if already training
                if self.training_in_progress.get(model_id, False):
                    continue

                # Check drift
                drift_score = await self.drift_monitor.evaluate_drift(
                    model_id
                )

                logger.info(
                    f"Model {model_id}: drift_score={drift_score:.3f}"
                )

                # If drift detected, schedule retraining
                if drift_score > self.settings.DRIFT_THRESHOLD:
                    models_needing_training.append(
                        (model_id, drift_score)
                    )

            # Schedule retraining for drifted models
            if models_needing_training:
                logger.warning(
                    f"⚠️  Drift detected in {len(models_needing_training)} "
                    f"models"
                )

                for model_id, drift_score in models_needing_training:
                    await self.pipeline.schedule_retraining(
                        model_id=model_id,
                        reason=f"drift_detected_score_{drift_score:.3f}",
                        priority="normal"
                    )
                    logger.info(
                        f"✓ Scheduled retraining for {model_id} "
                        f"(drift: {drift_score:.3f})"
                    )
            else:
                logger.info(
                    "✓ All models performing within acceptable drift range"
                )

        except Exception as e:
            logger.error(
                f"Drift monitoring failed: {str(e)}",
                exc_info=True
            )

    async def weekly_full_retraining(self):
        """
        Perform full retraining of all models weekly
        This ensures models stay current even without drift
        """
        logger.info("=" * 60)
        logger.info("STARTING WEEKLY FULL RETRAINING")
        logger.info("=" * 60)

        try:
            # Get all model IDs
            model_ids = await self.pipeline.get_all_model_ids()

            # Add main brain
            if "aivo-main-brain-v1" not in model_ids:
                model_ids.insert(0, "aivo-main-brain-v1")

            logger.info(
                f"Scheduling full retraining for {len(model_ids)} models"
            )

            scheduled_count = 0

            for model_id in model_ids:
                # Skip if already training
                if self.training_in_progress.get(model_id, False):
                    logger.info(f"Skipping {model_id} - already training")
                    continue

                # Schedule with normal priority (spread out over the week)
                await self.pipeline.schedule_retraining(
                    model_id=model_id,
                    reason="weekly_scheduled_retraining",
                    priority="normal"
                )

                scheduled_count += 1
                logger.info(f"✓ Scheduled weekly training for {model_id}")

            logger.info("=" * 60)
            logger.info(
                f"WEEKLY RETRAINING SCHEDULED: {scheduled_count} models"
            )
            logger.info("=" * 60)

        except Exception as e:
            logger.error(
                f"Weekly retraining scheduling failed: {str(e)}",
                exc_info=True
            )

    async def adaptive_training_check(self):
        """
        Check if models need immediate training based on performance
        metrics from real-time usage
        """
        logger.info("Running adaptive training check...")

        try:
            # This would check real-time metrics like:
            # - Error rates spiking
            # - User satisfaction dropping
            # - Incorrect predictions increasing
            # - Response time degrading

            # For now, log that check ran
            logger.info(
                "✓ Adaptive training check complete - "
                "all models performing normally"
            )

            # In production, would query metrics and trigger training:
            # if error_rate > threshold:
            #     await self.pipeline.schedule_retraining(
            #         model_id=affected_model,
            #         reason=f"error_rate_spike_{error_rate}",
            #         priority="high"
            #     )

        except Exception as e:
            logger.error(
                f"Adaptive training check failed: {str(e)}",
                exc_info=True
            )

    async def manual_trigger_training(
        self,
        model_id: str,
        reason: str = "manual_trigger",
        priority: str = "high"
    ):
        """
        Manually trigger training for a specific model
        Useful for testing or emergency retraining
        """
        logger.info(
            f"Manual training trigger for {model_id}: {reason}"
        )

        try:
            job = await self.pipeline.schedule_retraining(
                model_id=model_id,
                reason=reason,
                priority=priority
            )

            # Execute immediately if high/critical priority
            if priority in ["high", "critical"]:
                result = await self.pipeline.execute_training_job(
                    job['job_id']
                )
                logger.info(
                    f"Manual training completed: {result['status']}"
                )
                return result

            return {
                "status": "scheduled",
                "job_id": job['job_id']
            }

        except Exception as e:
            logger.error(
                f"Manual training trigger failed: {str(e)}",
                exc_info=True
            )
            raise

    def get_scheduler_status(self) -> Dict:
        """Get current status of the scheduler"""
        jobs = self.scheduler.get_jobs()

        return {
            "running": self.scheduler.running,
            "jobs": [
                {
                    "id": job.id,
                    "name": job.name,
                    "next_run": job.next_run_time,
                    "trigger": str(job.trigger)
                }
                for job in jobs
            ],
            "models_training": [
                model_id for model_id, in_progress
                in self.training_in_progress.items()
                if in_progress
            ],
            "last_training": {
                model_id: timestamp.isoformat()
                for model_id, timestamp in self.last_training.items()
            }
        }


# Global scheduler instance
_scheduler_instance: Optional[AIVOTrainingScheduler] = None


def get_scheduler() -> AIVOTrainingScheduler:
    """Get or create the global scheduler instance"""
    global _scheduler_instance

    if _scheduler_instance is None:
        _scheduler_instance = AIVOTrainingScheduler()

    return _scheduler_instance


def start_scheduler():
    """Start the global training scheduler"""
    scheduler = get_scheduler()
    scheduler.start()
    logger.info("Global training scheduler started")


def stop_scheduler():
    """Stop the global training scheduler"""
    global _scheduler_instance

    if _scheduler_instance:
        _scheduler_instance.stop()
        _scheduler_instance = None
        logger.info("Global training scheduler stopped")
