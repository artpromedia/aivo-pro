import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParentStore } from '../stores/parentStore';
import type { Suggestion } from '../stores/parentStore';

// Mock API functions
const fetchSuggestions = async (): Promise<Suggestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          childId: '1',
          type: 'homework_help',
          title: 'Additional Math Practice',
          description: 'Emma could benefit from extra practice with fraction operations to strengthen her understanding.',
          priority: 'medium',
          createdAt: '2024-11-01T10:00:00Z',
          status: 'pending',
          estimatedTime: 20,
          subject: 'Mathematics',
        },
        {
          id: '2',
          childId: '1',
          type: 'intervention',
          title: 'Reading Comprehension Support',
          description: 'Consider using audio books alongside text to support Emma\'s dyslexia and improve reading comprehension.',
          priority: 'high',
          createdAt: '2024-11-01T14:30:00Z',
          status: 'pending',
          estimatedTime: 30,
          subject: 'Reading',
        },
        {
          id: '3',
          childId: '2',
          type: 'enrichment',
          title: 'Advanced Science Projects',
          description: 'Marcus is excelling in science. Consider introducing more challenging experiments and concepts.',
          priority: 'low',
          createdAt: '2024-11-02T09:15:00Z',
          status: 'pending',
          estimatedTime: 45,
          subject: 'Science',
        },
      ]);
    }, 300);
  });
};

const updateSuggestionAPI = async (
  suggestionId: string,
  status: 'approved' | 'rejected'
): Promise<Suggestion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response
      resolve({
        id: suggestionId,
        status,
      } as Suggestion);
    }, 500);
  });
};

export const useSuggestions = () => {
  const { suggestions, setSuggestions } = useParentStore();

  const query = useQuery({
    queryKey: ['suggestions'],
    queryFn: fetchSuggestions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update store when data changes
  React.useEffect(() => {
    if (query.data) {
      setSuggestions(query.data);
    }
  }, [query.data, setSuggestions]);

  const pendingSuggestions = query.data?.filter(s => s.status === 'pending') || [];

  return {
    suggestions: query.data || suggestions,
    pendingSuggestions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useUpdateSuggestion = () => {
  const queryClient = useQueryClient();
  const { updateSuggestion } = useParentStore();

  return useMutation({
    mutationFn: ({ suggestionId, status }: { suggestionId: string; status: 'approved' | 'rejected' }) =>
      updateSuggestionAPI(suggestionId, status),
    onSuccess: (updatedSuggestion, { suggestionId, status }) => {
      // Update cache
      queryClient.setQueryData(['suggestions'], (oldData: Suggestion[] | undefined) => {
        return oldData?.map((suggestion) =>
          suggestion.id === suggestionId ? { ...suggestion, status } : suggestion
        );
      });

      // Update store
      updateSuggestion(suggestionId, status);
    },
  });
};

export const useSuggestionsByChild = (childId: string) => {
  const { suggestions } = useSuggestions();
  return suggestions.filter(suggestion => suggestion.childId === childId);
};

export const usePendingSuggestions = () => {
  const { suggestions } = useSuggestions();
  return suggestions.filter(suggestion => suggestion.status === 'pending');
};