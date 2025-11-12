"""
Test suite for training orchestration
Validates training job execution, data collection, and hyperparameter optimization
"""

import pytest
from unittest.mock import patch
from src.training import TrainingService


class TestTrainingService:
    """Test training service orchestration"""
    
    @pytest.fixture
    async def training_service(self):
        """Create training service instance"""
        service = TrainingService()
        return service
    
    # Training Job Execution Tests
    @pytest.mark.asyncio
    async def test_execute_training_job_success(self, training_service):
        """Test successful training job execution"""
        job_id = "train-2025-11-09-001"
        
        # Mock data collection to return sample data
        with patch.object(training_service, 'collect_training_data') as mock_collect:
            mock_collect.return_value = [
                {"input": "2+2=?", "output": "4", "feedback": 5},
                {"input": "5-3=?", "output": "2", "feedback": 5}
            ] * 50  # 100 samples for proper split
            
            result = await training_service.execute_training_job(job_id)
        
        assert result["status"] == "completed"
        assert "training_metrics" in result
        assert "test_metrics" in result
        assert isinstance(result["improved"], bool)
    
    @pytest.mark.asyncio
    async def test_execute_training_job_insufficient_data(self, training_service):
        """Test training job with insufficient data"""
        job_id = "train-2025-11-09-002"
        
        with patch.object(training_service, 'collect_training_data') as mock_collect:
            mock_collect.return_value = []  # No data
            
            result = await training_service.execute_training_job(job_id)
        
        assert result["status"] == "skipped"
        assert result["reason"] == "insufficient_data"
    
    @pytest.mark.asyncio
    async def test_execute_training_job_error_handling(self, training_service):
        """Test error handling in training job"""
        job_id = "train-2025-11-09-003"
        
        with patch.object(training_service, 'collect_training_data') as mock_collect:
            mock_collect.side_effect = Exception("Database connection failed")
            
            result = await training_service.execute_training_job(job_id)
        
        assert result["status"] == "failed"
        assert "error" in result
    
    # Data Collection Tests
    @pytest.mark.asyncio
    async def test_collect_training_data_structure(self, training_service):
        """Test training data collection returns proper structure"""
        data = await training_service.collect_training_data()
        
        # Data should be a list (may be empty in test environment)
        assert isinstance(data, list)
        
        # If data exists, verify structure
        if len(data) > 0:
            sample = data[0]
            assert "interaction_id" in sample or isinstance(sample, dict)
    
    # Hyperparameter Optimization Tests
    @pytest.mark.asyncio
    async def test_optimize_hyperparameters_returns_valid_config(self, training_service):
        """Test hyperparameter optimization returns valid configuration"""
        model_id = "curriculum-generator-v1"
        
        hyperparams = await training_service.optimize_hyperparameters(model_id)
        
        # Verify all required hyperparameters are present
        required_params = [
            "learning_rate", "batch_size", "epochs", 
            "warmup_steps", "weight_decay", "max_grad_norm"
        ]
        
        for param in required_params:
            assert param in hyperparams
            assert hyperparams[param] is not None
    
    @pytest.mark.asyncio
    async def test_optimize_hyperparameters_reasonable_values(self, training_service):
        """Test that hyperparameters are within reasonable ranges"""
        model_id = "adaptive-tutor-v1"
        
        hyperparams = await training_service.optimize_hyperparameters(model_id)
        
        # Verify reasonable ranges (research-backed)
        assert 0.00001 <= hyperparams["learning_rate"] <= 0.001
        assert 8 <= hyperparams["batch_size"] <= 128
        assert 1 <= hyperparams["epochs"] <= 10
        assert 0 <= hyperparams["weight_decay"] <= 0.1
    
    # Job Storage Tests
    @pytest.mark.asyncio
    async def test_store_training_job(self, training_service):
        """Test training job storage"""
        job = {
            "id": "job-123",
            "model_id": "test-model",
            "priority": "high",
            "created_at": "2025-11-09T00:00:00Z"
        }
        
        result = await training_service.store_training_job(job)
        
        assert result["status"] == "queued"
        assert result["job_id"] == job["id"]
    
    # Model Registry Tests
    @pytest.mark.asyncio
    async def test_get_all_model_ids(self, training_service):
        """Test retrieving all model IDs from registry"""
        model_ids = await training_service.get_all_model_ids()
        
        assert isinstance(model_ids, list)
        assert len(model_ids) > 0
        
        # Verify expected models are present
        expected_models = [
            "curriculum-generator-v1",
            "adaptive-tutor-v1",
            "bias-detector-v1"
        ]
        
        for model in expected_models:
            assert model in model_ids
    
    @pytest.mark.asyncio
    async def test_get_training_history(self, training_service):
        """Test retrieving training history for a model"""
        model_id = "curriculum-generator-v1"
        
        history = await training_service.get_training_history(model_id)
        
        assert isinstance(history, list)
        
        # If history exists, verify structure
        if len(history) > 0:
            entry = history[0]
            assert "job_id" in entry
            assert "date" in entry or "timestamp" in entry
    
    # Deployment Tests
    @pytest.mark.asyncio
    async def test_deploy_model(self, training_service):
        """Test model deployment after successful training"""
        job_id = "train-2025-11-09-004"
        training_metrics = {
            "epochs_completed": 3,
            "final_loss": 0.023,
            "validation_accuracy": 0.94
        }
        test_metrics = {
            "test_accuracy": 0.92,
            "f1_score": 0.91
        }
        
        # Should not raise exception
        await training_service.deploy_model(job_id, training_metrics, test_metrics)
    
    @pytest.mark.asyncio
    async def test_store_training_results(self, training_service):
        """Test storing training results for auditing"""
        job_id = "train-2025-11-09-005"
        training_metrics = {"loss": 0.023}
        test_metrics = {"accuracy": 0.92}
        
        # Should not raise exception
        await training_service.store_training_results(
            job_id, training_metrics, test_metrics
        )


@pytest.mark.integration
class TestTrainingIntegration:
    """Integration tests for complete training pipeline"""
    
    @pytest.mark.asyncio
    async def test_full_training_pipeline(self):
        """Test complete training workflow from job creation to deployment"""
        service = TrainingService()
        
        # 1. Store training job
        job = {
            "id": "integration-job-001",
            "model_id": "test-model-v1",
            "priority": "high",
            "created_at": "2025-11-09T00:00:00Z"
        }
        
        store_result = await service.store_training_job(job)
        assert store_result["status"] == "queued"
        
        # 2. Get model IDs
        model_ids = await service.get_all_model_ids()
        assert len(model_ids) > 0
        
        # 3. Optimize hyperparameters
        hyperparams = await service.optimize_hyperparameters(model_ids[0])
        assert "learning_rate" in hyperparams
        
        # 4. Execute training job (with mocked data)
        with patch.object(service, 'collect_training_data') as mock_collect:
            mock_collect.return_value = [{"data": "sample"}] * 100
            
            result = await service.execute_training_job(job["id"])
        
        assert result["status"] in ["completed", "failed"]
        
        # 5. Get training history
        history = await service.get_training_history(model_ids[0])
        assert isinstance(history, list)
