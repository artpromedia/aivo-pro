#!/bin/bash

# =============================================================================
# AIVO Local AI Setup Script
# =============================================================================
# This script sets up local AI models for testing without API keys
# Run this after starting docker-compose

set -e

echo "🚀 AIVO Local AI Setup"
echo "======================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Ollama is running
echo -e "${BLUE}Checking Ollama service...${NC}"
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  echo "Waiting for Ollama to start..."
  sleep 2
done
echo -e "${GREEN}✓ Ollama is running${NC}"
echo ""

# Pull recommended models
echo -e "${BLUE}Pulling recommended AI models...${NC}"
echo "This will take a few minutes on first run"
echo ""

# Main chat model - fast and efficient
echo -e "${YELLOW}1. Pulling Llama 3.2 (3B) - Main chat model...${NC}"
docker exec -it aivo-pro-ollama-1 ollama pull llama3.2:3b

# Embedding model - for semantic search
echo -e "${YELLOW}2. Pulling Nomic Embed - Embedding model...${NC}"
docker exec -it aivo-pro-ollama-1 ollama pull nomic-embed-text

# Code generation model
echo -e "${YELLOW}3. Pulling CodeLlama (7B) - Code generation...${NC}"
docker exec -it aivo-pro-ollama-1 ollama pull codellama:7b

# Vision model (optional)
echo -e "${YELLOW}4. Pulling LLaVA (7B) - Vision model...${NC}"
docker exec -it aivo-pro-ollama-1 ollama pull llava:7b

# Multilingual model for translations
echo -e "${YELLOW}5. Pulling Aya (8B) - Multilingual model...${NC}"
docker exec -it aivo-pro-ollama-1 ollama pull aya:8b

echo ""
echo -e "${GREEN}✓ All models pulled successfully!${NC}"
echo ""

# List available models
echo -e "${BLUE}Available models:${NC}"
docker exec -it aivo-pro-ollama-1 ollama list

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "You can now:"
echo "  • Access Ollama API at: http://localhost:11434"
echo "  • Access Ollama Web UI at: http://localhost:3000"
echo "  • Access LocalAI at: http://localhost:8080"
echo ""
echo "To test the chat model:"
echo "  docker exec -it aivo-pro-ollama-1 ollama run llama3.2:3b"
echo ""
echo "To use in your app, set AI_PROVIDER=local in .env"
