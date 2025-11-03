# AIVO Learning Platform

A production-ready Turborepo monorepo for the AIVO Learning Platform built with React 19, TypeScript 5.6+, Vite 7.0.0, and Tailwind CSS 4.0.0-beta.

## 🚀 Quick Start

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
# Start all services with Docker
docker-compose up

# Start specific service
docker-compose up web
```

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