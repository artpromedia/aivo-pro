# AIVO Learning Platform - Copilot Instructions

This is a Turborepo monorepo for the AIVO Learning Platform with the following structure:

## Project Architecture
- **Framework**: Turborepo monorepo with pnpm workspaces
- **Frontend**: React 19.0.0 with TypeScript 5.6+
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 4.0.0-beta with custom design system
- **Node.js**: 20.19.4

## Apps Structure
- `apps/web/` - Marketing website (Port 5173)
- `apps/parent-portal/` - Parent dashboard (Port 5174)  
- `apps/teacher-portal/` - Teacher dashboard (Port 5175)
- `apps/learner-app/` - Student learning interface (Port 5176)
- `apps/baseline-assessment/` - Initial assessment (Port 5179)
- `apps/mobile/` - React Native app

## Packages Structure
- `packages/ui/` - Shared component library with design system
- `packages/types/` - TypeScript definitions
- `packages/utils/` - Shared utilities
- `packages/auth/` - Authentication logic
- `packages/config/` - Shared configuration

## Services
- `services/mock-api/` - Development API server

## Design System Guidelines
- Use rounded corners (extra rounded like in screenshots)  
- Coral/salmon primary colors (coral: FF7B5C, salmon: FF636F)
- Soft shadows with color tinting
- Gradient accents (pink/purple for AI components)
- Accessibility-first approach with focus management
- Modern card-based layouts with hover animations

## Development Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm test` - Run tests across workspace
- `pnpm lint` - Lint all code