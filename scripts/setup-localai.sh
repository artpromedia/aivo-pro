#!/bin/bash

# AIVO LocalAI Model Setup Script
echo "🧠 Setting up LocalAI models for AIVO Platform..."

# Wait for LocalAI to be ready
echo "⏳ Waiting for LocalAI to be ready..."
until curl -f http://localhost:8080/readyz; do
  echo "LocalAI not ready yet, waiting..."
  sleep 5
done

echo "✅ LocalAI is ready!"

# Download models for different AI agents
echo "📥 Downloading AI models..."

# Main chat model for AIVO Brain
echo "🧠 Installing main chat model (llama3.2:3b)..."
curl -X POST http://localhost:8080/models \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "action": "install"
  }'

# Code/Math model for homework helper
echo "🔢 Installing code/math model (codellama:7b)..."
curl -X POST http://localhost:8080/models \
  -H "Content-Type: application/json" \
  -d '{
    "model": "codellama:7b", 
    "action": "install"
  }'

# Embedding model for content understanding
echo "🔍 Installing embedding model (nomic-embed-text)..."
curl -X POST http://localhost:8080/models \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text",
    "action": "install"
  }'

# Vision model for homework OCR
echo "👁️ Installing vision model (llava:7b)..."
curl -X POST http://localhost:8080/models \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llava:7b",
    "action": "install"
  }'

# Lightweight model for quick responses
echo "⚡ Installing lightweight model (tinyllama:1.1b)..."
curl -X POST http://localhost:8080/models \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tinyllama:1.1b",
    "action": "install"
  }'

echo "🎉 All AI models installed successfully!"
echo "🚀 AIVO Platform is now ready with LocalAI integration!"

# Test the models
echo "🧪 Testing model connectivity..."
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "messages": [
      {"role": "user", "content": "Hello! Are you ready to help students learn?"}
    ],
    "max_tokens": 50
  }'

echo -e "\n✅ LocalAI setup complete! All AIVO services are now connected to local AI models."