# AIVO Learning Platform

A production-ready Turborepo monorepo for the AIVO Learning Platform built
with React 19, TypeScript 5.6+, Vite 7.0.0, and Tailwind CSS 4.0.0-beta.

## 🌍 Global Reach & Content Generation - NEW!

**AIVO now has the world's most advanced educational content system:**

### 📚 4 Complete Content Generators
- ✅ **AdvancedMathGenerator** - All K-12 math (Arithmetic, Algebra, Geometry, Statistics)
- ✅ **AdvancedScienceGenerator** - Biology, Chemistry, Physics, Earth Science with labs
- ✅ **AdvancedELAGenerator** - Reading, Writing, Grammar, Vocabulary with Lexile levels
- ✅ **WorldLanguagesGenerator** - 50+ languages with CEFR framework (A1-C2)

### 🎯 Advanced Features
- **Differentiation**: 3 student levels + 4 learning styles
- **Real-World Contexts**: 8+ scenarios per topic
- **Inquiry-Based Labs**: Complete materials, procedures, analysis
- **Scaffolding & Extensions**: Support all learners
- **Cultural Adaptation**: Region-specific content for global audiences

### 🌐 Global Coverage
- **15+ Core Subjects** across all grade levels (K-12)
- **50+ Languages** with native speaker quality TTS
- **15+ International Curricula** (US Common Core, UK National, IB, Cambridge, China Gaokao, CAPS, etc.)
- **Cultural Sensitivity** for Middle East, China, India, Africa, Latin America, Europe
- **1+ Billion Students** addressable worldwide

### � Documentation
- [Content Generators Reference](./CONTENT_GENERATORS_REFERENCE.md) - Quick start guide for all generators
- [Advanced Features Complete](./ADVANCED_CONTENT_FEATURES_COMPLETE.md) - Full implementation details
- [Global Curriculum Enhancement](./GLOBAL_CURRICULUM_ENHANCEMENT.md) - International standards
- [Global Quick Reference](./GLOBAL_CURRICULUM_QUICK_REF.md) - API examples

## 🚀 Quick Start

### Local Development (With Docker + Local AI)

```bash
# 1. Install dependencies
pnpm install

# 2. Start all services with local AI (no API keys needed!)
docker-compose up -d

# 3. Setup local AI models
.\scripts\setup-local-ai.ps1

# 4. Verify everything works
.\scripts\test-local-ai.ps1

# 5. Start developing!
# Visit http://localhost:5176 (Learner App)
```

### Traditional Development (Without Docker)

```bash
# Install dependencies
pnpm install

# Start all applications in development mode
pnpm dev

# Build all applications
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### 🧠 Local AI Testing (Zero Cost!)

Run the entire platform locally using Docker Hub models - no API keys or cloud costs:

- **Ollama**: Primary LLM service (Llama, Mistral, Gemma)
- **LocalAI**: OpenAI-compatible inference
- **vLLM**: Production-grade performance testing

See [LOCAL_AI_GUIDE.md](./LOCAL_AI_GUIDE.md) for complete setup instructions.

## 📁 Project Structure

```
aivo-learning/
├── apps/
│   ├── web/                    # Marketing website (Port 5173)
│   ├── parent-portal/          # Parent dashboard (Port 5174)
│   ├── teacher-portal/         # Teacher dashboard (Port 5175)
│   ├── learner-app/           # Student learning interface (Port 5176)
│   ├── baseline-assessment/    # Initial assessment (Port 5179)
│   └── mobile/                # React Native app
├── packages/
│   ├── ui/                    # Shared component library
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Shared utilities
│   ├── auth/                  # Authentication logic
│   └── config/                # Shared configuration
└── services/
    └── mock-api/              # Development API server (Port 8000)
```

## 🛠️ Technology Stack

- **Framework**: Turborepo monorepo with pnpm workspaces
- **Frontend**: React 19.0.0 with TypeScript 5.6+
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 4.0.0-beta with custom design system
- **Node.js**: 20.19.4
- **Package Manager**: pnpm 10+

## 🎨 Design System

The UI package includes a comprehensive design system with:

- **Colors**: Coral/salmon primary colors (#FF7B5C, #FF636F)
- **Rounded Corners**: Extra rounded design (0.75rem to 2.25rem)
- **Shadows**: Soft, color-tinted shadows
- **Gradients**: Pink/purple accents for AI components
- **Accessibility**: Focus management and keyboard navigation
- **Animations**: Smooth hover effects and transitions

## 🏃‍♂️ Development

### Prerequisites

- Node.js 20.19.4+ (use `.nvmrc`)
- pnpm 10.0.0+

### Environment Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables as needed.

### Running Individual Apps

```bash
# Marketing website
cd apps/web && pnpm dev

# Parent portal
cd apps/parent-portal && pnpm dev

# Teacher portal
cd apps/teacher-portal && pnpm dev

# Student learning app
cd apps/learner-app && pnpm dev

# Baseline assessment
cd apps/baseline-assessment && pnpm dev

# Mock API server
cd services/mock-api && pnpm dev
```

### Docker Development

```bash
# Start all services with Docker (local AI included)
docker-compose up -d

# CPU-only mode (no GPU required)
docker-compose -f docker-compose.yml -f docker-compose.cpu.yml up -d

# Start specific service
docker-compose up web

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Available Endpoints:**
- Web App: http://localhost:5173
- Parent Portal: http://localhost:5174
- Teacher Portal: http://localhost:5175
- Learner App: http://localhost:5176
- Ollama API: http://localhost:11434
- Ollama Web UI: http://localhost:3000
- LocalAI: http://localhost:8080

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter @aivo/ui

# Run tests in watch mode
pnpm test --watch
```

## 🔧 Building

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm build --filter @aivo/web

# Clean build artifacts
pnpm clean
```

## 📦 Package Management

This monorepo uses pnpm workspaces. Shared packages are linked automatically:

- `@aivo/ui` - Shared component library
- `@aivo/types` - TypeScript definitions
- `@aivo/utils` - Utility functions
- `@aivo/auth` - Authentication logic
- `@aivo/config` - Configuration management

## 🌈 Theme Support

The platform supports three educational levels:

- **K5**: Elementary (Pink/Yellow/Green theme)
- **MS**: Middle School (Blue/Purple/Teal theme)
- **HS**: High School (Gray/Indigo/Amber theme)

## 🚢 Deployment

Each app can be deployed independently:

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📄 License

Private - AIVO Learning Platform

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 🆘 Support

For support and questions, please contact the AIVO development team.
