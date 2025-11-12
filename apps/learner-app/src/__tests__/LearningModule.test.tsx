import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import LearningModule from '../components/LearningModule';

// Mock API responses
global.fetch = vi.fn();

describe('LearningModule Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  const mockModuleData = {
    id: 'module-123',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    gradeLevel: 4,
    content: {
      lessons: [
        { id: 'lesson-1', title: 'What are Fractions?', completed: false },
        { id: 'lesson-2', title: 'Adding Fractions', completed: false }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockModuleData
    });
  });

  const renderModule = () => {
    return render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <LearningModule moduleId="module-123" />
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('loads and displays module content', async () => {
    renderModule();
    
    await waitFor(() => {
      expect(screen.getByText('Introduction to Fractions')).toBeInTheDocument();
    });
  });

  it('displays lesson list', async () => {
    renderModule();
    
    await waitFor(() => {
      expect(screen.getByText('What are Fractions?')).toBeInTheDocument();
      expect(screen.getByText('Adding Fractions')).toBeInTheDocument();
    });
  });

  it('handles lesson completion', async () => {
    renderModule();
    
    await waitFor(() => {
      const lessonButton = screen.getByText('What are Fractions?');
      fireEvent.click(lessonButton);
    });

    // Verify completion state update
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/lessons/lesson-1/complete'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });

  it('shows loading state', () => {
    (global.fetch as any).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    renderModule();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));
    
    renderModule();
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
