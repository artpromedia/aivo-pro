# District Portal

A comprehensive management dashboard for district administrators to oversee schools, manage licenses, monitor analytics, and handle billing across their entire district.

## Features

- **Dashboard**: Real-time overview of district performance, license utilization, and school metrics
- **School Management**: Add, edit, and monitor all schools in the district
- **License Management**: Allocate and track license usage across schools
- **Teacher Management**: Oversee all teachers in the district
- **Analytics & Reporting**: Usage reports, performance analytics, and compliance reporting
- **Billing**: Manage payments, invoices, and budget tracking
- **Settings**: Configure district preferences and integrations

## Tech Stack

- React 19.0.0
- TypeScript 5.7+
- Vite 7.0.0
- React Router 7.1+
- TanStack Query 5.62+ (data fetching)
- Framer Motion 11.15+ (animations)
- Tailwind CSS 4.0.0-beta
- Lucide React (icons)
- Recharts 2.15+ (data visualization)

## Getting Started

### Prerequisites

- Node.js 20.19.4 or higher
- pnpm 8.0.0 or higher

### Installation

From the project root:

```bash
# Install dependencies
pnpm install

# Start District Portal in development mode
cd apps/district-portal
pnpm dev
```

The portal will be available at `http://localhost:5177`

### Building for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```text
apps/district-portal/
├── src/
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── Schools/              # School management pages
│   │   ├── Teachers/             # Teacher management pages
│   │   ├── Licenses/             # License allocation pages
│   │   ├── Analytics/            # Reporting and analytics
│   │   ├── Billing/              # Payment and invoices
│   │   └── Settings.tsx          # District settings
│   ├── layouts/                  # Layout components
│   │   └── DistrictLayout.tsx    # Main layout with sidebar
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Key Pages

### Dashboard

- District overview with key metrics
- License utilization tracking
- Top performing schools
- Recent activity feed
- Budget overview
- Compliance status
- Quick actions

### Schools

- List all schools in the district
- Add new schools
- View detailed school metrics
- Monitor student and teacher counts

### License Management

- View total, allocated, and available licenses
- Allocate licenses to schools
- Track license utilization per school
- Purchase additional licenses
- View license history

### Analytics

- Usage reports
- Performance analytics
- Compliance reporting
- Custom date ranges
- Exportable reports

### Billing

- View billing dashboard
- Invoice history
- Payment management
- Budget tracking

## API Integration

The portal is configured to work with the AIVO backend API. Update API endpoints in:

- `src/pages/Dashboard.tsx` - Main dashboard data
- `src/pages/Licenses/index.tsx` - License management
- Other page components as needed

Replace mock data with actual API calls:

```typescript
const { data } = useQuery({
  queryKey: ['district-overview'],
  queryFn: async () => {
    const response = await fetch('/api/v1/district/overview');
    return response.json();
  },
});
```

## Styling

The portal uses Tailwind CSS 4.0.0-beta with custom design tokens:

- **Primary Colors**: Coral (#FF7B5C) and Salmon (#FF636F)
- **Rounded Corners**: Extra rounded (rounded-xl, rounded-2xl)
- **Shadows**: Soft with color tinting
- **Accessibility**: Focus states and keyboard navigation

## Environment Variables

Create a `.env` file in the app directory:

```env
VITE_API_URL=https://api.aivo.com
VITE_APP_URL=http://localhost:5177
```

## Development

### Code Style

- Use TypeScript for all new files
- Follow React 19 best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

## Deployment

The portal can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

Build the app first:

```bash
pnpm build
```

Then deploy the `dist` folder.

## License

Proprietary - AIVO Learning Platform

## Support

For issues or questions, contact:

- Email: <support@aivo.com>
- Documentation: <https://docs.aivo.com>
