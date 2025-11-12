#!/bin/bash

# Wait for LocalAI to start
echo "Waiting for LocalAI to start..."
sleep 30

# Install basic models for educational content generation
echo "Installing models for LocalAI..."

# Install a lightweight model for chat completion
curl -X POST http://localhost:8080/models/apply \
  -H "Content-Type: application/json" \
  -d '{
    "id": "gpt-3.5-turbo",
    "object": "model",
    "name": "microsoft/DialoGPT-medium",
    "parameters": {
      "model": "microsoft/DialoGPT-medium"
    }
  }'

# Install embedding model
curl -X POST http://localhost:8080/models/apply \
  -H "Content-Type: application/json" \
  -d '{
    "id": "text-embedding-ada-002", 
    "object": "model",
    "name": "all-MiniLM-L6-v2",
    "parameters": {
      "model": "all-MiniLM-L6-v2"
    }
  }'

echo "Models installation initiated..."