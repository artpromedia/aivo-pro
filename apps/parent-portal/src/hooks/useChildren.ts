import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParentStore } from '../stores/parentStore';
import type { Child } from '../stores/parentStore';

// Mock API functions - replace with actual API calls
const fetchChildren = async (): Promise<Child[]> => {
  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          firstName: 'Emma',
          lastName: 'Chen',
          birthDate: '2012-03-15',
          grade: 6,
          zipCode: '80202',
          disabilities: ['dyslexia'],
          hasIEP: true,
          avatar: '👧',
          progress: {
            overall: 78,
            subjects: {
              math: 85,
              reading: 65,
              science: 80,
              socialStudies: 82,
            },
          },
          currentActivity: {
            subject: 'Mathematics',
            lesson: 'Fractions and Decimals',
            timeSpent: 24,
          },
          weeklyStats: {
            hoursLearned: 8.5,
            skillsMastered: 3,
            avgScore: 78,
          },
        },
        {
          id: '2',
          firstName: 'Marcus',
          lastName: 'Johnson',
          birthDate: '2014-07-22',
          grade: 4,
          zipCode: '80202',
          disabilities: [],
          hasIEP: false,
          avatar: '👦',
          progress: {
            overall: 92,
            subjects: {
              math: 88,
              reading: 95,
              science: 90,
              socialStudies: 94,
            },
          },
          currentActivity: {
            subject: 'Reading',
            lesson: 'Story Comprehension',
            timeSpent: 18,
          },
          weeklyStats: {
            hoursLearned: 12.2,
            skillsMastered: 5,
            avgScore: 92,
          },
        },
      ]);
    }, 500);
  });
};

const addChildAPI = async (childData: Omit<Child, 'id'>): Promise<Child> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newChild: Child = {
        ...childData,
        id: Date.now().toString(),
        progress: {
          overall: 0,
          subjects: {
            math: 0,
            reading: 0,
            science: 0,
            socialStudies: 0,
          },
        },
        weeklyStats: {
          hoursLearned: 0,
          skillsMastered: 0,
          avgScore: 0,
        },
      };
      resolve(newChild);
    }, 1000);
  });
};

const updateChildAPI = async (childId: string, updates: Partial<Child>): Promise<Child> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock updated child - in real app, this would be the API response
      resolve({ id: childId, ...updates } as Child);
    }, 500);
  });
};

export const useChildren = () => {
  const { children, setChildren } = useParentStore();
  
  const query = useQuery({
    queryKey: ['children'],
    queryFn: fetchChildren,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update store when data changes
  React.useEffect(() => {
    if (query.data) {
      setChildren(query.data);
    }
  }, [query.data, setChildren]);

  return {
    children: query.data || children,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useAddChild = () => {
  const queryClient = useQueryClient();
  const { addChild } = useParentStore();

  return useMutation({
    mutationFn: addChildAPI,
    onSuccess: (newChild) => {
      // Update cache
      queryClient.setQueryData(['children'], (oldData: Child[] | undefined) => {
        return oldData ? [...oldData, newChild] : [newChild];
      });
      
      // Update store
      addChild(newChild);
    },
  });
};

export const useUpdateChild = () => {
  const queryClient = useQueryClient();
  const { updateChild } = useParentStore();

  return useMutation({
    mutationFn: ({ childId, updates }: { childId: string; updates: Partial<Child> }) =>
      updateChildAPI(childId, updates),
    onSuccess: (updatedChild, { childId }) => {
      // Update cache
      queryClient.setQueryData(['children'], (oldData: Child[] | undefined) => {
        return oldData?.map((child) =>
          child.id === childId ? { ...child, ...updatedChild } : child
        );
      });
      
      // Update store
      updateChild(childId, updatedChild);
    },
  });
};

export const useChild = (childId: string) => {
  const { children } = useChildren();
  return children?.find((child) => child.id === childId);
};