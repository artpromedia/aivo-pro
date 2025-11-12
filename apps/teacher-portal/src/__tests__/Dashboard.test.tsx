import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock the API calls
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'teacher-1',
      name: 'Jane Doe',
      email: 'jane@school.edu',
      role: 'teacher'
    },
    isAuthenticated: true
  })
}));

describe('Teacher Dashboard', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Dashboard />
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('renders dashboard title', () => {
    renderDashboard();
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('displays class overview cards', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/My Classes/i)).toBeInTheDocument();
    });
  });

  it('shows recent activity section', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    });
  });

  it('displays student progress metrics', async () => {
    renderDashboard();
    
    await waitFor(() => {
      // Check for progress-related elements
      const progressElements = screen.queryAllByText(/progress/i);
      expect(progressElements.length).toBeGreaterThan(0);
    });
  });
});
